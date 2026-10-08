import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { CLINIC } from '../clinic.js';
import { config } from '../config.js';
import { prisma } from '../db.js';
import { notFound } from '../lib/errors.js';
import { buildIcs } from '../lib/ics.js';
import { normalizePhone } from '../lib/phone.js';
import { nowSP } from '../lib/time.js';
import { getAvailability } from '../services/availability.js';
import { createAppointment, rescheduleAppointment } from '../services/appointments.js';
import { processReply } from '../services/replies.js';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD');
const isoDateTime = z.string().datetime({ offset: true, message: 'Use data e hora em ISO 8601, ex.: 2026-10-20T11:00:00Z' });

const createSchema = z.object({
  serviceId: z.string().min(1),
  doctorId: z.string().min(1),
  insuranceId: z.string().min(1).nullable().default(null),
  start: isoDateTime,
  patient: z.object({
    name: z.string().trim().min(3, 'Informe o nome completo').max(120),
    phone: z.string().min(8, 'Informe um telefone com DDD'),
    birthDate: isoDate,
  }),
  lgpdConsent: z.literal(true, { errorMap: () => ({ message: 'É preciso aceitar o uso dos dados (LGPD) para agendar.' }) }),
  notes: z.string().max(500).optional(),
});

/** Visão pública do agendamento: sem dados sensíveis além do nome. */
function publicAppointment(a: NonNullable<Awaited<ReturnType<typeof createAppointment>>>['appointment']) {
  return {
    id: a.id,
    start: a.start,
    end: a.end,
    status: a.status,
    channel: a.channel,
    notes: a.notes,
    doctor: a.doctor,
    service: a.service,
    insurance: a.insurance,
    patient: { name: a.patient.name, phone: a.patient.phone },
  };
}

export async function publicRoutes(app: FastifyInstance) {
  const icsUrl = (req: { protocol: string; host: string }, id: string) =>
    `${config.PUBLIC_API_URL?.replace(/\/$/, '') ?? `${req.protocol}://${req.host}`}/public/appointments/${id}/ics`;

  app.get('/clinic', async () => ({
    ...CLINIC,
    whatsappUrl: `https://wa.me/${CLINIC.whatsappE164.replace('+', '')}`,
  }));

  app.get('/services', async () => {
    const services = await prisma.service.findMany({
      include: { doctors: { where: { active: true }, select: { id: true } } },
      orderBy: { name: 'asc' },
    });
    return services.map(({ doctors, ...s }) => ({ ...s, doctorIds: doctors.map((d) => d.id) }));
  });

  app.get('/doctors', async (req) => {
    const { serviceId } = z.object({ serviceId: z.string().optional() }).parse(req.query);
    const doctors = await prisma.doctor.findMany({
      where: { active: true, ...(serviceId ? { services: { some: { id: serviceId } } } : {}) },
      include: { services: { select: { id: true } } },
      orderBy: { name: 'asc' },
    });
    return doctors.map(({ services, ...d }) => ({ ...d, serviceIds: services.map((s) => s.id) }));
  });

  app.get('/insurances', async () => {
    const list = await prisma.insurance.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
    // "Particular" por último: no front, insuranceId = null
    return [...list.filter((i) => i.name !== 'Particular'), ...list.filter((i) => i.name === 'Particular')];
  });

  app.get('/availability', async (req) => {
    const q = z
      .object({
        doctorId: z.string().min(1),
        serviceId: z.string().min(1),
        from: isoDate.default(() => nowSP().toISODate()!),
        days: z.coerce.number().int().min(1).max(60).default(14),
      })
      .parse(req.query);
    return getAvailability(q.doctorId, q.serviceId, q.from, q.days);
  });

  app.post('/appointments', async (req, reply) => {
    const body = createSchema.parse(req.body);
    const { appointment } = await createAppointment({
      serviceId: body.serviceId,
      doctorId: body.doctorId,
      insuranceId: body.insuranceId,
      start: new Date(body.start),
      notes: body.notes,
      patient: {
        name: body.patient.name,
        phone: normalizePhone(body.patient.phone),
        birthDate: new Date(`${body.patient.birthDate}T00:00:00Z`),
      },
    });
    return reply.status(201).send({ appointment: publicAppointment(appointment), icsUrl: icsUrl(req, appointment.id) });
  });

  app.get('/appointments/:id', async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: { select: { id: true, name: true, avatarInitials: true } },
        service: { select: { id: true, slug: true, name: true, durationMin: true, icon: true } },
        insurance: { select: { id: true, name: true } },
      },
    });
    if (!a) throw notFound('Agendamento');
    return { appointment: publicAppointment(a), icsUrl: icsUrl(req, a.id) };
  });

  app.get('/appointments/:id/ics', async (req, reply) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const a = await prisma.appointment.findUnique({ where: { id }, include: { service: true, doctor: true } });
    if (!a) throw notFound('Agendamento');
    const ics = buildIcs({ id: a.id, start: a.start, end: a.end, createdAt: a.createdAt, serviceName: a.service.name, doctorName: a.doctor.name });
    return reply
      .header('Content-Type', 'text/calendar; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="consulta-mutton-${a.id}.ics"`)
      .send(ics);
  });

  app.post('/appointments/:id/reschedule', async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const { start } = z.object({ start: isoDateTime }).parse(req.body);
    const { appointment } = await rescheduleAppointment(id, new Date(start));
    return { appointment: publicAppointment(appointment), icsUrl: icsUrl(req, appointment.id) };
  });

  app.get('/whatsapp/:phone', async (req) => {
    const phone = normalizePhone((req.params as { phone: string }).phone);
    const patient = await prisma.patient.findUnique({ where: { phone } });
    if (!patient) return { patient: null, messages: [] };
    const messages = await prisma.message.findMany({ where: { patientId: patient.id }, orderBy: { createdAt: 'asc' } });
    return { patient: { id: patient.id, name: patient.name, phone: patient.phone }, messages };
  });

  app.post('/whatsapp/:phone/reply', async (req) => {
    const phone = normalizePhone((req.params as { phone: string }).phone);
    const { messageId, buttonId } = z.object({ messageId: z.string().min(1), buttonId: z.string().min(1) }).parse(req.body);
    return processReply(messageId, buttonId, { phone });
  });
}
