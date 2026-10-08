import { Prisma } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { AppError } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { nowSP } from '../lib/time.js';
import { computeDays } from '../services/availability.js';
import { createAppointment } from '../services/appointments.js';
import { sendTomorrowReminders } from '../services/reminders.js';
import { processReply } from '../services/replies.js';
import { randomPatient } from '../seed/data.js';
import { runSeed } from '../seed/index.js';

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/** Atalhos para conduzir a apresentação. Só existem com DEMO_MODE=true. */
export async function demoRoutes(app: FastifyInstance) {
  app.post('/send-reminders', async () => sendTomorrowReminders());

  app.post('/simulate-reply', async () => {
    // última mensagem com botões ainda sem resposta, de qualquer paciente
    const candidates = await prisma.message.findMany({
      where: { direction: 'OUT', buttons: { not: Prisma.DbNull }, status: { not: 'READ' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    const open = [];
    for (const m of candidates) {
      if (m.relatedType === 'APPOINTMENT') {
        const a = await prisma.appointment.findUnique({ where: { id: m.relatedId! } });
        if (a && ['PENDING', 'RESCHEDULED'].includes(a.status) && a.start > new Date()) open.push(m);
      } else open.push(m);
    }
    if (!open.length) throw new AppError(404, 'NOTHING_TO_REPLY', 'Nenhuma mensagem aguardando resposta agora.');
    const msg = pick(open);
    const r = Math.random();
    const buttonId =
      msg.relatedType === 'JOURNEY' ? (r < 0.6 ? 'OK' : r < 0.85 ? 'DOUBT' : 'PAIN') : r < 0.8 ? 'CONFIRM' : 'RESCHEDULE';
    const patient = await prisma.patient.findUniqueOrThrow({ where: { id: msg.patientId } });
    const result = await processReply(msg.id, buttonId);
    return { patient: { id: patient.id, name: patient.name, phone: patient.phone }, messageId: msg.id, buttonId, result };
  });

  app.post('/random-appointments', async (req) => {
    const { count } = z.object({ count: z.coerce.number().int().min(1).max(30).default(5) }).parse(req.query);
    const services = await prisma.service.findMany({ include: { doctors: { where: { active: true } } } });
    const insurances = await prisma.insurance.findMany({ where: { active: true } });
    const created = [];
    for (let i = 0; i < count * 5 && created.length < count; i++) {
      const service = pick(services.filter((s) => s.doctors.length));
      const doctor = pick(service.doctors);
      const days = await computeDays(prisma, doctor.id, service.durationMin, nowSP(), 7);
      const free = days.flatMap((d) => d.free);
      if (!free.length) continue;
      const ins = pick(insurances);
      try {
        const { appointment } = await createAppointment({
          serviceId: service.id,
          doctorId: doctor.id,
          insuranceId: ins.name === 'Particular' ? null : ins.id,
          start: pick(free.slice(0, 40)),
          patient: randomPatient(),
          channel: pick(['SITE', 'SITE', 'WHATSAPP', 'PHONE'] as const),
        });
        created.push(appointment);
      } catch (err) {
        if (!(err instanceof AppError && err.code === 'SLOT_TAKEN')) throw err;
      }
    }
    return { created: created.length, appointments: created };
  });

  app.post('/reset', async () => {
    const summary = await runSeed();
    publish('demo.reset', summary);
    return { ok: true, ...summary };
  });
}
