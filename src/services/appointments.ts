import { Prisma, type AppointmentStatus, type Channel } from '@prisma/client';
import { DateTime } from 'luxon';
import { prisma } from '../db.js';
import { AppError, notFound } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { formatParts } from '../lib/time.js';
import { BUTTONS, firstName, render, TEMPLATES, clinicPhone } from '../templates.js';
import { sendMessage } from '../whatsapp/index.js';
import { ACTIVE_STATUSES, assertSlotFree, freeSlotsOfDay, getDoctorService, lockDoctor } from './availability.js';

export const appointmentInclude = {
  patient: true,
  doctor: { select: { id: true, name: true, avatarInitials: true } },
  service: { select: { id: true, slug: true, name: true, durationMin: true, icon: true } },
  insurance: { select: { id: true, name: true } },
} satisfies Prisma.AppointmentInclude;

export type AppointmentFull = Prisma.AppointmentGetPayload<{ include: typeof appointmentInclude }>;

export function loadAppointment(id: string) {
  return prisma.appointment.findUnique({ where: { id }, include: appointmentInclude });
}

function messageVars(a: AppointmentFull) {
  return {
    nome: firstName(a.patient.name),
    serviço: a.service.name,
    médico: a.doctor.name,
    telefone: clinicPhone,
    ...formatParts(a.start),
  };
}

export async function sendAppointmentMessage(
  a: AppointmentFull,
  kind: 'confirmacao' | 'remarcacao' | 'lembrete' | 'confirmado' | 'cancelado' | 'remarcarLink',
  extra: Record<string, string> = {},
) {
  const withButtons = kind === 'confirmacao' || kind === 'remarcacao' || kind === 'lembrete';
  return sendMessage({
    to: a.patient.phone,
    patientId: a.patientId,
    body: render(TEMPLATES[kind], { ...messageVars(a), ...extra }),
    buttons: withButtons ? BUTTONS.appointment : undefined,
    relatedType: 'APPOINTMENT',
    relatedId: a.id,
  });
}

/** Converte violação do índice único parcial em SLOT_TAKEN. */
async function slotTakenFromUnique(err: unknown, doctorId: string, durationMin: number, start: Date): Promise<never> {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    throw new AppError(409, 'SLOT_TAKEN', 'Poxa, esse horário acabou de ser reservado. Veja os horários ainda livres neste dia.', {
      slots: await freeSlotsOfDay(prisma, doctorId, durationMin, start),
    });
  }
  throw err;
}

export interface CreateAppointmentInput {
  serviceId: string;
  doctorId: string;
  insuranceId: string | null;
  start: Date;
  patient: { name: string; phone: string; birthDate: Date };
  notes?: string;
  channel?: Channel;
  status?: AppointmentStatus;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const { service } = await getDoctorService(prisma, input.doctorId, input.serviceId);
  if (input.insuranceId) {
    const ins = await prisma.insurance.findUnique({ where: { id: input.insuranceId } });
    if (!ins || !ins.active) throw notFound('Convênio');
    // "Particular" é guardado como insuranceId = null
    if (ins.name === 'Particular') input = { ...input, insuranceId: null };
  }

  let id: string;
  try {
    id = await prisma.$transaction(async (tx) => {
      await lockDoctor(tx, input.doctorId);
      const slot = await assertSlotFree(tx, input.doctorId, service.durationMin, input.start);
      const patient = await tx.patient.upsert({
        where: { phone: input.patient.phone },
        create: { ...input.patient, lgpdConsentAt: new Date() },
        update: { name: input.patient.name, birthDate: input.patient.birthDate, lgpdConsentAt: new Date() },
      });
      const appt = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: input.doctorId,
          serviceId: input.serviceId,
          insuranceId: input.insuranceId,
          start: slot.start,
          end: slot.end,
          status: input.status ?? 'PENDING',
          channel: input.channel ?? 'SITE',
          notes: input.notes,
        },
      });
      return appt.id;
    });
  } catch (err) {
    return slotTakenFromUnique(err, input.doctorId, service.durationMin, input.start);
  }

  const appointment = (await loadAppointment(id))!;
  publish('appointment.created', { appointment });
  const message = await sendAppointmentMessage(appointment, 'confirmacao');
  return { appointment, message };
}

const FINAL: AppointmentStatus[] = ['CANCELED', 'NO_SHOW', 'DONE'];

/** Remarca: valida o novo slot, libera o antigo, RESCHEDULED → PENDING e nova mensagem. */
export async function rescheduleAppointment(id: string, start: Date, doctorId?: string) {
  const current = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!current) throw notFound('Agendamento');
  if (FINAL.includes(current.status)) {
    throw new AppError(422, 'APPOINTMENT_CLOSED', 'Esse agendamento já foi encerrado e não pode ser remarcado.');
  }
  const targetDoctor = doctorId ?? current.doctorId;
  if (targetDoctor !== current.doctorId) await getDoctorService(prisma, targetDoctor, current.serviceId);
  const previous = { start: current.start, doctorId: current.doctorId };

  try {
    await prisma.$transaction(async (tx) => {
      // trava sempre na mesma ordem para evitar deadlock entre dois médicos
      for (const d of [...new Set([current.doctorId, targetDoctor])].sort()) await lockDoctor(tx, d);
      const slot = await assertSlotFree(tx, targetDoctor, current.service.durationMin, start, { excludeAppointmentId: id });
      await tx.appointment.update({
        where: { id },
        data: { status: 'RESCHEDULED', start: slot.start, end: slot.end, doctorId: targetDoctor },
      });
      await tx.appointment.update({
        where: { id },
        data: { status: 'PENDING', reminderSentAt: null, confirmedAt: null },
      });
    });
  } catch (err) {
    return slotTakenFromUnique(err, targetDoctor, current.service.durationMin, start);
  }

  const appointment = (await loadAppointment(id))!;
  publish('appointment.updated', { appointment, change: 'rescheduled', previous });
  const message = await sendAppointmentMessage(appointment, 'remarcacao');
  return { appointment, message };
}

export async function setAppointmentStatus(id: string, status: AppointmentStatus) {
  const current = await prisma.appointment.findUnique({ where: { id } });
  if (!current) throw notFound('Agendamento');
  if (current.status === status) return (await loadAppointment(id))!;

  // voltar um agendamento cancelado para ativo precisa do horário livre
  if (!ACTIVE_STATUSES.includes(current.status) && ACTIVE_STATUSES.includes(status)) {
    const svc = await prisma.service.findUniqueOrThrow({ where: { id: current.serviceId } });
    const clash = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        doctorId: current.doctorId,
        status: { in: ACTIVE_STATUSES },
        start: { lt: current.end },
        end: { gt: current.start },
      },
    });
    if (clash) {
      throw new AppError(409, 'SLOT_TAKEN', 'Esse horário já foi ocupado por outro agendamento.', {
        slots: await freeSlotsOfDay(prisma, current.doctorId, svc.durationMin, current.start),
      });
    }
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      status,
      confirmedAt: status === 'CONFIRMED' && !current.confirmedAt ? new Date() : undefined,
    },
  });
  const appointment = (await loadAppointment(id))!;
  publish('appointment.updated', { appointment, change: 'status', previousStatus: current.status });
  if (status === 'CANCELED' && appointment.start > new Date()) await sendAppointmentMessage(appointment, 'cancelado');
  return appointment;
}

export function dayRange(date: DateTime) {
  return { gte: date.startOf('day').toJSDate(), lt: date.endOf('day').toJSDate() };
}
