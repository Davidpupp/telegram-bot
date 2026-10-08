import type { AppointmentStatus } from '@prisma/client';
import { DateTime } from 'luxon';
import { prisma, type Db } from '../db.js';
import { AppError, notFound } from '../lib/errors.js';
import { atTime, daySP, isWeekday, nowSP, overlaps, SLOT_MIN } from '../lib/time.js';

/** ISO 8601 em UTC sem milissegundos: "2026-10-20T11:00:00Z". */
export const slotIso = (d: Date) => d.toISOString().replace('.000Z', 'Z');

/** Status que ocupam a agenda. */
export const ACTIVE_STATUSES: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'DONE'];

export async function getDoctorService(db: Db, doctorId: string, serviceId: string) {
  const [doctor, service] = await Promise.all([
    db.doctor.findUnique({ where: { id: doctorId }, include: { services: { select: { id: true } } } }),
    db.service.findUnique({ where: { id: serviceId } }),
  ]);
  if (!doctor || !doctor.active) throw notFound('Médico');
  if (!service) throw notFound('Serviço');
  if (!doctor.services.some((s) => s.id === serviceId)) {
    throw new AppError(422, 'DOCTOR_DOES_NOT_OFFER_SERVICE', `${doctor.name} não atende ${service.name}.`);
  }
  return { doctor, service };
}

/** Horários da grade (20 em 20 min) que cabem no expediente, sem olhar ocupação. */
export function gridForDay(
  day: DateTime,
  hours: { start: string; end: string; breakStart: string | null; breakEnd: string | null } | undefined,
  durationMin: number,
) {
  if (!hours || !isWeekday(day)) return [];
  const out: { start: Date; end: Date }[] = [];
  const dayEnd = atTime(day, hours.end);
  const bStart = hours.breakStart ? atTime(day, hours.breakStart).toJSDate() : null;
  const bEnd = hours.breakEnd ? atTime(day, hours.breakEnd).toJSDate() : null;
  for (let t = atTime(day, hours.start); t.plus({ minutes: durationMin }) <= dayEnd; t = t.plus({ minutes: SLOT_MIN })) {
    const start = t.toJSDate();
    const end = t.plus({ minutes: durationMin }).toJSDate();
    if (bStart && bEnd && overlaps(start, end, bStart, bEnd)) continue;
    out.push({ start, end });
  }
  return out;
}

interface DayOptions {
  /** Agendamento a ignorar (para remarcação). */
  excludeAppointmentId?: string;
}

/**
 * Calcula, para cada dia útil do intervalo, a grade e os horários livres.
 * `grid` = horários válidos do expediente; `free` = grade sem bloqueios, ocupados e passado.
 */
export async function computeDays(
  db: Db,
  doctorId: string,
  durationMin: number,
  from: DateTime,
  days: number,
  opts: DayOptions = {},
) {
  const rangeStart = from.startOf('day');
  const rangeEnd = rangeStart.plus({ days });
  const [hours, blocks, appts] = await Promise.all([
    db.workingHours.findMany({ where: { doctorId } }),
    db.block.findMany({
      where: {
        OR: [{ doctorId }, { doctorId: null }],
        start: { lt: rangeEnd.toJSDate() },
        end: { gt: rangeStart.toJSDate() },
      },
    }),
    db.appointment.findMany({
      where: {
        doctorId,
        status: { in: ACTIVE_STATUSES },
        start: { lt: rangeEnd.toJSDate() },
        end: { gt: rangeStart.toJSDate() },
        ...(opts.excludeAppointmentId ? { id: { not: opts.excludeAppointmentId } } : {}),
      },
      select: { start: true, end: true },
    }),
  ]);

  const now = nowSP().toJSDate();
  const result: { date: string; grid: { start: Date; end: Date }[]; free: Date[] }[] = [];
  for (let i = 0; i < days; i++) {
    const day = rangeStart.plus({ days: i });
    if (!isWeekday(day)) continue;
    const grid = gridForDay(day, hours.find((h) => h.weekday === day.weekday), durationMin);
    const free = grid
      .filter((s) => s.start > now)
      .filter((s) => !blocks.some((b) => overlaps(s.start, s.end, b.start, b.end)))
      .filter((s) => !appts.some((a) => overlaps(s.start, s.end, a.start, a.end)))
      .map((s) => s.start);
    result.push({ date: day.toISODate()!, grid, free });
  }
  return result;
}

export async function getAvailability(doctorId: string, serviceId: string, from: string, days: number) {
  const { service } = await getDoctorService(prisma, doctorId, serviceId);
  const result = await computeDays(prisma, doctorId, service.durationMin, daySP(from), days);
  return result.map((d) => ({ date: d.date, slots: d.free.map(slotIso) }));
}

/** Horários livres do dia (SP) que contém `start`. */
export async function freeSlotsOfDay(db: Db, doctorId: string, durationMin: number, start: Date) {
  const day = DateTime.fromJSDate(start).setZone('America/Sao_Paulo').startOf('day');
  const [d] = await computeDays(db, doctorId, durationMin, day, 1);
  return (d?.free ?? []).map(slotIso);
}

/**
 * Valida um horário dentro de uma transação que já travou o médico.
 * Lança INVALID_SLOT / SLOT_IN_PAST / SLOT_TAKEN (409, com os horários livres do dia).
 */
export async function assertSlotFree(
  db: Db,
  doctorId: string,
  durationMin: number,
  start: Date,
  opts: DayOptions = {},
) {
  const day = DateTime.fromJSDate(start).setZone('America/Sao_Paulo').startOf('day');
  const [d] = await computeDays(db, doctorId, durationMin, day, 1, opts);
  const slot = d?.grid.find((s) => s.start.getTime() === start.getTime());
  if (!slot) {
    throw new AppError(422, 'INVALID_SLOT', 'Esse horário não faz parte da agenda do médico. Escolha um dos horários disponíveis.');
  }
  if (start <= new Date()) {
    throw new AppError(422, 'SLOT_IN_PAST', 'Esse horário já passou. Escolha outro, por favor.');
  }
  if (!d.free.some((s) => s.getTime() === start.getTime())) {
    throw new AppError(409, 'SLOT_TAKEN', 'Poxa, esse horário acabou de ser reservado. Veja os horários ainda livres neste dia.', {
      slots: d.free.map(slotIso),
    });
  }
  return slot;
}

/** Trava a linha do médico até o fim da transação: agendamentos do mesmo médico ficam em fila. */
export async function lockDoctor(db: Db, doctorId: string) {
  await db.$queryRaw`SELECT id FROM "Doctor" WHERE id = ${doctorId} FOR UPDATE`;
}
