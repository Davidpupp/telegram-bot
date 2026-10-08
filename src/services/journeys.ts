import type { JourneyStepKey, Prisma, Procedure } from '@prisma/client';
import { prisma } from '../db.js';
import { AppError, notFound } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { formatParts } from '../lib/time.js';
import { BUTTONS, firstName, postOpMessage, procedureLabel } from '../templates.js';
import { sendMessage } from '../whatsapp/index.js';

export const STEP_ORDER: JourneyStepKey[] = ['D_MINUS_7', 'D_MINUS_1', 'D_DAY', 'D_PLUS_1', 'FIRST_RETURN', 'D_PLUS_30'];

/** Deslocamento de cada etapa em relação à data da cirurgia (dias). */
export const STEP_OFFSET_DAYS: Record<JourneyStepKey, number> = {
  D_MINUS_7: -7,
  D_MINUS_1: -1,
  D_DAY: 0,
  D_PLUS_1: 1,
  FIRST_RETURN: 7,
  D_PLUS_30: 30,
};

export const STEP_LABEL: Record<JourneyStepKey, string> = {
  D_MINUS_7: 'D-7 · preparo',
  D_MINUS_1: 'D-1 · véspera',
  D_DAY: 'Dia da cirurgia',
  D_PLUS_1: 'D+1 · como está?',
  FIRST_RETURN: '1º retorno',
  D_PLUS_30: 'D+30 · resultado',
};

export const journeyInclude = {
  patient: { select: { id: true, name: true, phone: true } },
  doctor: { select: { id: true, name: true, avatarInitials: true } },
  steps: { orderBy: { scheduledFor: 'asc' } },
  alerts: { orderBy: { createdAt: 'desc' } },
} satisfies Prisma.SurgeryJourneyInclude;

export function stepSchedule(surgeryDate: Date) {
  return STEP_ORDER.map((key) => ({
    key,
    scheduledFor: new Date(surgeryDate.getTime() + STEP_OFFSET_DAYS[key] * 86_400_000),
  }));
}

function decorate<T extends { steps: { key: JourneyStepKey }[]; procedure: Procedure }>(j: T) {
  return {
    ...j,
    procedureLabel: procedureLabel(j.procedure),
    steps: j.steps.map((s) => ({ ...s, label: STEP_LABEL[s.key] })),
  };
}

export async function listJourneys() {
  const list = await prisma.surgeryJourney.findMany({ include: journeyInclude, orderBy: { surgeryDate: 'desc' } });
  return list.map((j) => ({ ...decorate(j), openAlerts: j.alerts.filter((a) => !a.resolvedAt).length }));
}

export async function getJourney(id: string) {
  const j = await prisma.surgeryJourney.findUnique({ where: { id }, include: journeyInclude });
  if (!j) throw notFound('Jornada');
  const messages = await prisma.message.findMany({
    where: { relatedType: 'JOURNEY', relatedId: id },
    orderBy: { createdAt: 'asc' },
  });
  return { ...decorate(j), messages };
}

/** Avança o tempo virtual até a próxima etapa e "envia" a mensagem dela. */
export async function advanceJourney(id: string) {
  const j = await prisma.surgeryJourney.findUnique({ where: { id }, include: journeyInclude });
  if (!j) throw notFound('Jornada');
  const next = j.steps.find((s) => !s.sentAt);
  if (!next) throw new AppError(422, 'JOURNEY_FINISHED', 'Essa jornada já foi concluída: todas as etapas foram enviadas.');

  const vars = {
    nome: firstName(j.patient.name),
    médico: j.doctor.name,
    procedimento: procedureLabel(j.procedure),
    ...formatParts(j.surgeryDate),
  };
  await prisma.$transaction([
    prisma.surgeryJourney.update({ where: { id }, data: { simulatedNow: next.scheduledFor, currentStep: next.key } }),
    prisma.journeyStep.update({ where: { id: next.id }, data: { sentAt: new Date() } }),
  ]);
  const message = await sendMessage({
    to: j.patient.phone,
    patientId: j.patientId,
    body: postOpMessage(next.key, vars),
    buttons: next.key === 'D_PLUS_1' ? BUTTONS.postOp : undefined,
    relatedType: 'JOURNEY',
    relatedId: j.id,
  });
  const journey = await getJourney(id);
  publish('journey.updated', { journey, step: next.key });
  return { journey, message };
}
