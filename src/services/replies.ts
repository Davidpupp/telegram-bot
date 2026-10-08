import type { JourneyResponse, Message } from '@prisma/client';
import { config } from '../config.js';
import { prisma } from '../db.js';
import { AppError, notFound } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { BUTTON_LABELS, firstName, render, TEMPLATES } from '../templates.js';
import { sendMessage } from '../whatsapp/index.js';
import { loadAppointment, sendAppointmentMessage } from './appointments.js';
import { getJourney, STEP_LABEL } from './journeys.js';
import { procedureLabel } from '../templates.js';

export const rescheduleLink = (appointmentId: string) => `/agendar?remarcar=${appointmentId}`;

/** Grava a mensagem IN (o toque no botão) e marca as anteriores como lidas. */
async function recordIncoming(source: Message, label: string) {
  const now = new Date();
  await prisma.message.updateMany({
    where: { patientId: source.patientId, direction: 'OUT', status: { not: 'READ' }, createdAt: { lte: now } },
    data: { status: 'READ' },
  });
  const incoming = await prisma.message.create({
    data: {
      patientId: source.patientId,
      direction: 'IN',
      body: label,
      status: 'READ',
      relatedType: source.relatedType,
      relatedId: source.relatedId,
    },
  });
  const patient = await prisma.patient.findUniqueOrThrow({ where: { id: source.patientId } });
  publish('message.created', { message: incoming, phone: patient.phone, markedRead: true });
  return incoming;
}

/**
 * Processa o toque num botão — vindo do WhatsApp simulado ou do webhook da Meta.
 * Retorna o que mudou para o front reagir.
 */
export async function processReply(messageId: string, buttonId: string, opts: { phone?: string } = {}) {
  const source = await prisma.message.findUnique({ where: { id: messageId }, include: { patient: true } });
  if (!source || source.direction !== 'OUT') throw notFound('Mensagem');
  if (opts.phone && source.patient.phone !== opts.phone) throw notFound('Mensagem');
  const buttons = (source.buttons as { id: string; label: string }[] | null) ?? [];
  const button = buttons.find((b) => b.id === buttonId);
  if (!button) throw new AppError(422, 'INVALID_BUTTON', 'Essa opção não existe nesta mensagem.');

  if (source.relatedType === 'APPOINTMENT' && source.relatedId) {
    return replyToAppointment(source, buttonId);
  }
  if (source.relatedType === 'JOURNEY' && source.relatedId) {
    return replyToJourney(source, buttonId as JourneyResponse);
  }
  throw new AppError(422, 'INVALID_BUTTON', 'Essa mensagem não aceita respostas.');
}

async function replyToAppointment(source: Message, buttonId: string) {
  const appt = await loadAppointment(source.relatedId!);
  if (!appt) throw notFound('Agendamento');
  if (!['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(appt.status)) {
    throw new AppError(422, 'APPOINTMENT_CLOSED', 'Esse agendamento já foi encerrado.');
  }
  const incoming = await recordIncoming(source, BUTTON_LABELS[buttonId] ?? buttonId);
  const now = new Date();
  const afterReminder = appt.reminderSentAt && !appt.noShowAvoidedAt ? now : undefined;

  if (buttonId === 'CONFIRM') {
    await prisma.appointment.update({
      where: { id: appt.id },
      data: { status: 'CONFIRMED', confirmedAt: appt.confirmedAt ?? now, noShowAvoidedAt: afterReminder },
    });
    const appointment = (await loadAppointment(appt.id))!;
    publish('appointment.updated', { appointment, change: 'confirmed', via: 'WHATSAPP' });
    const reply = await sendAppointmentMessage(appointment, 'confirmado');
    return { action: 'CONFIRMED' as const, appointment, incoming, reply };
  }

  if (buttonId === 'RESCHEDULE') {
    if (afterReminder) {
      await prisma.appointment.update({ where: { id: appt.id }, data: { noShowAvoidedAt: afterReminder } });
    }
    const link = rescheduleLink(appt.id);
    const reply = await sendAppointmentMessage(appt, 'remarcarLink', {
      link: `${config.FRONTEND_URL.replace(/\/$/, '')}${link}`,
    });
    return { action: 'RESCHEDULE' as const, rescheduleUrl: link, appointment: appt, incoming, reply };
  }
  throw new AppError(422, 'INVALID_BUTTON', 'Essa opção não existe nesta mensagem.');
}

async function replyToJourney(source: Message, response: JourneyResponse) {
  const journey = await prisma.surgeryJourney.findUnique({
    where: { id: source.relatedId! },
    include: { patient: true, steps: { where: { sentAt: { not: null } }, orderBy: { scheduledFor: 'desc' } } },
  });
  if (!journey) throw notFound('Jornada');
  const step = journey.steps[0];
  const incoming = await recordIncoming(source, BUTTON_LABELS[response] ?? response);
  if (step) {
    await prisma.journeyStep.update({ where: { id: step.id }, data: { response, readAt: step.readAt ?? new Date() } });
  }

  let alert = null;
  if (response === 'PAIN' || response === 'DOUBT') {
    const what = response === 'PAIN' ? 'relatou DOR' : 'tem uma DÚVIDA';
    alert = await prisma.alert.create({
      data: {
        journeyId: journey.id,
        type: response === 'PAIN' ? 'POST_OP_PAIN' : 'POST_OP_DOUBT',
        message: `${journey.patient.name} ${what} na etapa ${step ? STEP_LABEL[step.key] : ''} da ${procedureLabel(journey.procedure)}. Telefone: ${journey.patient.phone}.`,
      },
    });
    publish('alert.created', { alert, patient: { id: journey.patient.id, name: journey.patient.name, phone: journey.patient.phone } });
  }

  const tpl = response === 'PAIN' ? TEMPLATES.posOpDor : response === 'DOUBT' ? TEMPLATES.posOpDuvida : TEMPLATES.posOpOk;
  const reply = await sendMessage({
    to: journey.patient.phone,
    patientId: journey.patientId,
    body: render(tpl, { nome: firstName(journey.patient.name) }),
    relatedType: 'JOURNEY',
    relatedId: journey.id,
  });
  const updated = await getJourney(journey.id);
  publish('journey.updated', { journey: updated, response });
  return { action: response, journey: updated, alert, incoming, reply };
}
