import { DateTime } from 'luxon';
import { TZ } from '../config.js';

export const SLOT_MIN = 20;

export const nowSP = () => DateTime.now().setZone(TZ);
export const toSP = (d: Date) => DateTime.fromJSDate(d).setZone(TZ);

/** "YYYY-MM-DD" interpretado no fuso da clínica. */
export function daySP(date: string): DateTime {
  const d = DateTime.fromISO(date, { zone: TZ });
  if (!d.isValid) throw new Error(`Data inválida: ${date}`);
  return d.startOf('day');
}

/** Combina um dia (SP) com "HH:mm". */
export function atTime(day: DateTime, hhmm: string): DateTime {
  const [h, m] = hhmm.split(':').map(Number);
  return day.set({ hour: h, minute: m, second: 0, millisecond: 0 });
}

export const isWeekday = (d: DateTime) => d.weekday >= 1 && d.weekday <= 5;

export const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart < bEnd && bStart < aEnd;

const WEEKDAYS = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'];

export function formatParts(d: Date) {
  const sp = toSP(d);
  return {
    dia: WEEKDAYS[sp.weekday - 1],
    data: sp.toFormat('dd/MM'),
    hora: sp.toFormat('HH:mm'),
  };
}

export const iso = (d: Date | DateTime) => (d instanceof Date ? d.toISOString() : d.toUTC().toISO()!);
