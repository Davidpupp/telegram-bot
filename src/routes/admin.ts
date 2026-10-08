import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';
import { AppError, notFound } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { daySP, nowSP } from '../lib/time.js';
import { appointmentInclude, dayRange, rescheduleAppointment, setAppointmentStatus } from '../services/appointments.js';
import { advanceJourney, getJourney, listJourneys } from '../services/journeys.js';
import { getMetrics, getReports } from '../services/metrics.js';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD');
const isoDateTime = z.string().datetime({ offset: true, message: 'Use data e hora em ISO 8601' });
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm');
const idParam = z.object({ id: z.string().min(1) });

const STATUS = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELED', 'NO_SHOW', 'DONE'] as const;

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/metrics', async (req) => {
    const { date } = z.object({ date: isoDate.optional() }).parse(req.query);
    return getMetrics(date);
  });

  app.get('/agenda', async (req) => {
    const q = z.object({ date: isoDate.optional(), doctorId: z.string().optional() }).parse(req.query);
    const day = q.date ? daySP(q.date) : nowSP().startOf('day');
    const [appointments, blocks] = await Promise.all([
      prisma.appointment.findMany({
        where: { start: dayRange(day), ...(q.doctorId ? { doctorId: q.doctorId } : {}) },
        include: appointmentInclude,
        orderBy: [{ start: 'asc' }, { doctorId: 'asc' }],
      }),
      prisma.block.findMany({
        where: {
          start: { lt: day.endOf('day').toJSDate() },
          end: { gt: day.startOf('day').toJSDate() },
          ...(q.doctorId ? { OR: [{ doctorId: q.doctorId }, { doctorId: null }] } : {}),
        },
      }),
    ]);
    return { date: day.toISODate(), appointments, blocks };
  });

  app.patch('/appointments/:id', async (req) => {
    const { id } = idParam.parse(req.params);
    const body = z
      .union([
        z.object({ status: z.enum(STATUS) }).strict(),
        z.object({ start: isoDateTime, doctorId: z.string().min(1).optional() }).strict(),
      ])
      .parse(req.body);
    if ('status' in body) return { appointment: await setAppointmentStatus(id, body.status) };
    const { appointment } = await rescheduleAppointment(id, new Date(body.start), body.doctorId);
    return { appointment };
  });

  app.get('/journeys', async () => listJourneys());
  app.get('/journeys/:id', async (req) => getJourney(idParam.parse(req.params).id));
  app.post('/journeys/:id/advance', async (req) => advanceJourney(idParam.parse(req.params).id));

  app.get('/alerts', async (req) => {
    const { open } = z.object({ open: z.enum(['true', 'false']).optional() }).parse(req.query);
    return prisma.alert.findMany({
      where: open === 'true' ? { resolvedAt: null } : open === 'false' ? { resolvedAt: { not: null } } : {},
      include: {
        journey: { include: { patient: { select: { id: true, name: true, phone: true } }, doctor: { select: { id: true, name: true } } } },
        appointment: { include: { patient: { select: { id: true, name: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  app.post('/alerts/:id/resolve', async (req) => {
    const { id } = idParam.parse(req.params);
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) throw notFound('Alerta');
    if (alert.resolvedAt) return alert;
    const updated = await prisma.alert.update({
      where: { id },
      data: { resolvedAt: new Date(), resolvedBy: req.user!.name },
    });
    publish('alert.resolved', { alert: updated });
    return updated;
  });

  app.get('/reports', async (req) => {
    const { days } = z.object({ days: z.coerce.number().int().min(1).max(365).default(30) }).parse(req.query);
    return getReports(days);
  });

  app.get('/doctors', async () =>
    prisma.doctor.findMany({ include: { services: { select: { id: true, name: true } }, workingHours: true }, orderBy: { name: 'asc' } }),
  );

  app.get('/doctors/:id/working-hours', async (req) => {
    const { id } = idParam.parse(req.params);
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw notFound('Médico');
    return prisma.workingHours.findMany({ where: { doctorId: id }, orderBy: { weekday: 'asc' } });
  });

  app.put('/doctors/:id/working-hours', async (req) => {
    const { id } = idParam.parse(req.params);
    const items = z
      .array(
        z
          .object({
            weekday: z.number().int().min(1).max(5),
            start: hhmm,
            end: hhmm,
            breakStart: hhmm.nullish(),
            breakEnd: hhmm.nullish(),
          })
          .refine((h) => h.start < h.end, 'O início precisa ser antes do fim')
          .refine((h) => !h.breakStart === !h.breakEnd, 'Informe início e fim do intervalo')
          .refine((h) => !h.breakStart || (h.start <= h.breakStart && h.breakStart < h.breakEnd! && h.breakEnd! <= h.end), 'Intervalo fora do expediente'),
      )
      .refine((arr) => new Set(arr.map((h) => h.weekday)).size === arr.length, 'Dia da semana repetido')
      .parse(req.body);
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw notFound('Médico');
    await prisma.$transaction([
      prisma.workingHours.deleteMany({ where: { doctorId: id } }),
      prisma.workingHours.createMany({
        data: items.map((h) => ({ ...h, breakStart: h.breakStart ?? null, breakEnd: h.breakEnd ?? null, doctorId: id })),
      }),
    ]);
    return prisma.workingHours.findMany({ where: { doctorId: id }, orderBy: { weekday: 'asc' } });
  });

  app.get('/blocks', async () => prisma.block.findMany({ where: { end: { gte: new Date() } }, include: { doctor: { select: { id: true, name: true } } }, orderBy: { start: 'asc' } }));

  app.post('/blocks', async (req, reply) => {
    const body = z
      .object({ doctorId: z.string().min(1).nullish(), start: isoDateTime, end: isoDateTime, reason: z.string().trim().min(2).max(120) })
      .refine((b) => new Date(b.start) < new Date(b.end), 'O início precisa ser antes do fim')
      .parse(req.body);
    if (body.doctorId && !(await prisma.doctor.findUnique({ where: { id: body.doctorId } }))) throw notFound('Médico');
    const block = await prisma.block.create({
      data: { doctorId: body.doctorId ?? null, start: new Date(body.start), end: new Date(body.end), reason: body.reason },
    });
    const affected = await prisma.appointment.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'] },
        start: { lt: block.end },
        end: { gt: block.start },
        ...(block.doctorId ? { doctorId: block.doctorId } : {}),
      },
    });
    return reply.status(201).send({ block, affectedAppointments: affected });
  });

  app.delete('/blocks/:id', async (req, reply) => {
    const { id } = idParam.parse(req.params);
    const res = await prisma.block.deleteMany({ where: { id } });
    if (!res.count) throw notFound('Bloqueio');
    return reply.status(204).send();
  });

  app.get('/patients/:id/messages', async (req) => {
    const { id } = idParam.parse(req.params);
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new AppError(404, 'NOT_FOUND', 'Paciente não encontrado(a).');
    const messages = await prisma.message.findMany({ where: { patientId: id }, orderBy: { createdAt: 'asc' } });
    return { patient, messages };
  });
}
