import { prisma } from '../db.js';
import { publish } from '../lib/events.js';
import { nowSP } from '../lib/time.js';
import { appointmentInclude, sendAppointmentMessage } from './appointments.js';

/** Envia o lembrete da véspera para os agendamentos de amanhã ainda não lembrados. */
export async function sendTomorrowReminders() {
  const tomorrow = nowSP().plus({ days: 1 }).startOf('day');
  const due = await prisma.appointment.findMany({
    where: {
      start: { gte: tomorrow.toJSDate(), lt: tomorrow.endOf('day').toJSDate() },
      status: { in: ['PENDING', 'CONFIRMED'] },
      reminderSentAt: null,
    },
    include: appointmentInclude,
    orderBy: { start: 'asc' },
  });

  const sent: string[] = [];
  for (const a of due) {
    // marca antes de enviar: se o job rodar de novo em paralelo, não duplica
    const claimed = await prisma.appointment.updateMany({
      where: { id: a.id, reminderSentAt: null },
      data: { reminderSentAt: new Date() },
    });
    if (!claimed.count) continue;
    await sendAppointmentMessage(a, 'lembrete');
    publish('appointment.updated', { appointment: { ...a, reminderSentAt: new Date() }, change: 'reminder_sent' });
    sent.push(a.id);
  }
  return { date: tomorrow.toISODate(), sent: sent.length, appointmentIds: sent };
}
