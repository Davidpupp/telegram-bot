import { DateTime } from 'luxon';
import { prisma } from '../db.js';
import { nowSP, daySP as TZ_DAY } from '../lib/time.js';

async function dayCounts(day: DateTime) {
  const range = { gte: day.startOf('day').toJSDate(), lt: day.endOf('day').toJSDate() };
  const rows = await prisma.appointment.groupBy({
    by: ['status'],
    where: { start: range, status: { not: 'CANCELED' } },
    _count: true,
  });
  const n = (s: string) => rows.find((r) => r.status === s)?._count ?? 0;
  const total = rows.reduce((acc, r) => acc + r._count, 0);
  return { today: total, confirmed: n('CONFIRMED') + n('DONE'), awaitingReply: n('PENDING') + n('RESCHEDULED') };
}

const avoidedBetween = (from: DateTime, to: DateTime) =>
  prisma.appointment.count({ where: { noShowAvoidedAt: { gte: from.toJSDate(), lt: to.toJSDate() } } });

export async function getMetrics(date?: string) {
  const day = date ? TZ_DAY(date) : nowSP().startOf('day');
  const end = day.endOf('day');
  const [current, lastWeek, month, week, prevWeek] = await Promise.all([
    dayCounts(day),
    dayCounts(day.minus({ weeks: 1 })),
    avoidedBetween(end.minus({ days: 30 }), end),
    avoidedBetween(end.minus({ days: 7 }), end),
    avoidedBetween(end.minus({ days: 14 }), end.minus({ days: 7 })),
  ]);
  return {
    date: day.toISODate(),
    ...current,
    confirmationRate: current.today ? Math.round((current.confirmed / current.today) * 100) / 100 : 0,
    noShowsAvoidedMonth: month,
    deltas: {
      today: current.today - lastWeek.today,
      confirmed: current.confirmed - lastWeek.confirmed,
      awaitingReply: current.awaitingReply - lastWeek.awaitingReply,
      noShowsAvoidedMonth: week - prevWeek,
    },
    deltaBasis: {
      today: 'mesmo dia da semana anterior',
      confirmed: 'mesmo dia da semana anterior',
      awaitingReply: 'mesmo dia da semana anterior',
      noShowsAvoidedMonth: 'últimos 7 dias × 7 dias anteriores',
    },
  };
}

const CHANNEL_LABEL = { SITE: 'Site', WHATSAPP: 'WhatsApp', PHONE: 'Telefone' } as const;

export async function getReports(days: number) {
  const end = nowSP();
  const start = end.minus({ days }).startOf('day');
  const appts = await prisma.appointment.findMany({
    where: { start: { gte: start.toJSDate(), lte: end.toJSDate() } },
    select: { channel: true, insuranceId: true, status: true, start: true, confirmedAt: true, noShowAvoidedAt: true },
  });
  const insurances = await prisma.insurance.findMany();

  const byChannel = (Object.keys(CHANNEL_LABEL) as (keyof typeof CHANNEL_LABEL)[]).map((channel) => ({
    channel,
    label: CHANNEL_LABEL[channel],
    count: appts.filter((a) => a.channel === channel).length,
  }));

  const insMap = new Map<string, { insuranceId: string | null; name: string; count: number }>();
  for (const a of appts) {
    const key = a.insuranceId ?? 'PARTICULAR';
    const name = a.insuranceId ? (insurances.find((i) => i.id === a.insuranceId)?.name ?? '—') : 'Particular';
    const cur = insMap.get(key) ?? { insuranceId: a.insuranceId, name, count: 0 };
    cur.count++;
    insMap.set(key, cur);
  }
  const byInsurance = [...insMap.values()].sort((a, b) => b.count - a.count);

  const weeks = new Map<string, { weekStart: string; total: number; confirmed: number; noShows: number; avoided: number }>();
  for (let w = start.startOf('week'); w <= end; w = w.plus({ weeks: 1 })) {
    weeks.set(w.toISODate()!, { weekStart: w.toISODate()!, total: 0, confirmed: 0, noShows: 0, avoided: 0 });
  }
  const bucket = (d: Date) => weeks.get(DateTime.fromJSDate(d).setZone(end.zone).startOf('week').toISODate()!);
  for (const a of appts) {
    const b = bucket(a.start);
    if (!b) continue;
    if (a.status !== 'CANCELED') {
      b.total++;
      if (a.confirmedAt) b.confirmed++;
    }
    if (a.status === 'NO_SHOW') b.noShows++;
    if (a.noShowAvoidedAt) b.avoided++;
  }
  const list = [...weeks.values()];
  return {
    from: start.toISODate(),
    to: end.toISODate(),
    total: appts.length,
    byChannel,
    byInsurance,
    confirmationRateByWeek: list.map((w) => ({
      weekStart: w.weekStart,
      total: w.total,
      confirmed: w.confirmed,
      rate: w.total ? Math.round((w.confirmed / w.total) * 100) / 100 : 0,
    })),
    noShowsAvoidedByWeek: list.map((w) => ({ weekStart: w.weekStart, count: w.avoided, noShows: w.noShows })),
  };
}
