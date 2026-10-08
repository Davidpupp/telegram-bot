import { randomUUID } from 'node:crypto';
import type { AppointmentStatus, Channel, JourneyResponse, JourneyStepKey, Prisma, Procedure } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DateTime } from 'luxon';
import { prisma } from '../db.js';
import { formatParts, isWeekday, nowSP, overlaps, toSP } from '../lib/time.js';
import { gridForDay } from '../services/availability.js';
import { STEP_OFFSET_DAYS, STEP_ORDER, stepSchedule } from '../services/journeys.js';
import { BUTTONS, firstName, postOpMessage, procedureLabel, render, TEMPLATES } from '../templates.js';
import {
  DEMO_PASSWORD,
  DOCTORS,
  FIXED_HOLIDAYS,
  fakePerson,
  INSURANCES,
  makeRng,
  SERVICES,
  USERS,
  WORKING_HOURS,
  type Rng,
} from './data.js';

type DoctorId = (typeof DOCTORS)[number]['id'];
type Appt = Prisma.AppointmentCreateManyInput & { id: string; start: Date; end: Date };
type Msg = Prisma.MessageCreateManyInput;

const HISTORY_DAYS = 30;
const FUTURE_DAYS = 21;

/** Zera o banco e recria tudo. Usado por `npm run db:seed`, `db:reset` e `POST /demo/reset`. */
export async function runSeed(opts: { seed?: number } = {}) {
  const rng = makeRng(opts.seed ?? 20261020);
  const now = nowSP();
  const today = now.startOf('day');

  await prisma.$executeRawUnsafe(
    'TRUNCATE "Message","Alert","JourneyStep","SurgeryJourney","Appointment","Block","Patient","WorkingHours","_DoctorServices","Service","Doctor","Insurance","User" CASCADE',
  );

  // ── Clínica ─────────────────────────────────────────────────────────────
  await prisma.doctor.createMany({ data: DOCTORS.map((d) => ({ ...d, specialties: [...d.specialties] })) });
  for (const s of SERVICES) {
    const { doctors, ...data } = s;
    await prisma.service.create({ data: { id: s.slug, ...data, doctors: { connect: doctors.map((id) => ({ id })) } } });
  }
  await prisma.insurance.createMany({ data: INSURANCES });
  await prisma.workingHours.createMany({
    data: Object.entries(WORKING_HOURS).flatMap(([doctorId, hours]) => hours.map((h) => ({ doctorId, ...h }))),
  });
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await prisma.user.createMany({ data: USERS.map((u) => ({ ...u, passwordHash })) });

  // ── Bloqueios: feriados (clínica toda) e um congresso numa sexta ────────
  const blocks: Prisma.BlockCreateManyInput[] = [];
  for (let d = today.minus({ days: HISTORY_DAYS }); d <= today.plus({ days: FUTURE_DAYS + 7 }); d = d.plus({ days: 1 })) {
    const holiday = FIXED_HOLIDAYS[d.toFormat('MM-dd')];
    if (holiday) blocks.push({ doctorId: null, start: d.toJSDate(), end: d.endOf('day').toJSDate(), reason: `Feriado – ${holiday}` });
  }
  let friday = today.plus({ days: 7 });
  while (friday.weekday !== 5) friday = friday.plus({ days: 1 });
  blocks.push({
    doctorId: 'doc_rafael',
    start: friday.toJSDate(),
    end: friday.endOf('day').toJSDate(),
    reason: 'Congresso de Oftalmologia (São Paulo)',
  });
  await prisma.block.createMany({ data: blocks });
  const isBlocked = (doctorId: string, start: Date, end: Date) =>
    blocks.some((b) => (!b.doctorId || b.doctorId === doctorId) && overlaps(start, end, b.start as Date, b.end as Date));

  // ── Pacientes ───────────────────────────────────────────────────────────
  const patients = new Map<string, { id: string; name: string; phone: string; birthDate: Date; lgpdConsentAt: Date; createdAt: Date }>();
  const newPatient = (createdAt: Date) => {
    let p = fakePerson(rng);
    while (patients.has(p.phone)) p = fakePerson(rng);
    const row = { id: randomUUID(), ...p, lgpdConsentAt: createdAt, createdAt };
    patients.set(p.phone, row);
    return row;
  };
  const pool: ReturnType<typeof newPatient>[] = [];
  const somePatient = (createdAt: Date) => {
    // ~25% são pacientes que voltam
    if (pool.length > 20 && rng.chance(0.25)) return rng.pick(pool);
    const p = newPatient(createdAt);
    pool.push(p);
    return p;
  };

  // ── Agenda: ocupação em memória para nunca sobrepor ─────────────────────
  const appts: Appt[] = [];
  const messages: Msg[] = [];
  const busy = (doctorId: string, start: Date, end: Date) =>
    appts.some((a) => a.doctorId === doctorId && a.status !== 'CANCELED' && a.status !== 'NO_SHOW' && overlaps(start, end, a.start, a.end));

  const doctorServices = (doctorId: DoctorId) => SERVICES.filter((s) => s.doctors.includes(doctorId));
  const pickService = (doctorId: DoctorId) => {
    const list = doctorServices(doctorId);
    // consulta geral é a mais comum
    return rng.chance(0.45) ? list.find((s) => s.slug === 'consulta-oftalmologica')! : rng.pick(list);
  };
  const pickInsurance = () => {
    const r = rng.next();
    return r < 0.3 ? 'ins_a' : r < 0.52 ? 'ins_b' : r < 0.68 ? 'ins_c' : r < 0.78 ? 'ins_d' : null;
  };

  /** Tenta encaixar uma consulta num dia/médico aleatório. */
  function place(day: DateTime, doctorId: DoctorId, filter?: (start: Date) => boolean) {
    const service = pickService(doctorId);
    const hours = WORKING_HOURS[doctorId].find((h) => h.weekday === day.weekday);
    const grid = gridForDay(
      day,
      hours && { start: hours.start, end: hours.end, breakStart: hours.breakStart ?? null, breakEnd: hours.breakEnd ?? null },
      service.durationMin,
    ).filter((s) => !isBlocked(doctorId, s.start, s.end) && !busy(doctorId, s.start, s.end) && (!filter || filter(s.start)));
    if (!grid.length) return null;
    const slot = rng.pick(grid);
    return { service, ...slot };
  }

  const doctorIds = DOCTORS.map((d) => d.id);

  function addConversation(a: Appt, p: { id: string; name: string }, serviceName: string, doctorName: string) {
    const vars = { nome: firstName(p.name), serviço: serviceName, médico: doctorName, ...formatParts(a.start) };
    const base = (a.createdAt as Date).getTime();
    const confirmedAt = a.confirmedAt as Date | null | undefined;
    const reminderAt = a.reminderSentAt as Date | null | undefined;
    const answered = Boolean(confirmedAt);
    messages.push({
      patientId: p.id,
      direction: 'OUT',
      body: render(TEMPLATES.confirmacao, vars),
      buttons: BUTTONS.appointment,
      status: answered || reminderAt ? 'READ' : 'DELIVERED',
      relatedType: 'APPOINTMENT',
      relatedId: a.id,
      createdAt: new Date(base + 30_000),
    });
    if (reminderAt) {
      messages.push({
        patientId: p.id,
        direction: 'OUT',
        body: render(TEMPLATES.lembrete, vars),
        buttons: BUTTONS.appointment,
        status: answered ? 'READ' : 'DELIVERED',
        relatedType: 'APPOINTMENT',
        relatedId: a.id,
        createdAt: reminderAt,
      });
    }
    if (confirmedAt) {
      messages.push({ patientId: p.id, direction: 'IN', body: 'Confirmar', status: 'READ', relatedType: 'APPOINTMENT', relatedId: a.id, createdAt: confirmedAt });
      messages.push({
        patientId: p.id,
        direction: 'OUT',
        body: render(TEMPLATES.confirmado, vars),
        status: 'READ',
        relatedType: 'APPOINTMENT',
        relatedId: a.id,
        createdAt: new Date(confirmedAt.getTime() + 20_000),
      });
    }
  }

  const doctorName = (id: string) => DOCTORS.find((d) => d.id === id)!.name;
  const serviceName = (slug: string) => SERVICES.find((s) => s.slug === slug)!.name;

  function push(a: Omit<Appt, 'patientId'>, patient: { id: string; name: string }, withMessages: boolean) {
    const row = { ...a, patientId: patient.id } as Appt;
    appts.push(row);
    if (withMessages) addConversation(row, patient, serviceName(a.serviceId), doctorName(a.doctorId));
    return row;
  }

  // ── Histórico: últimos 30 dias, com a confirmação melhorando semana a semana ──
  for (let i = HISTORY_DAYS; i >= 1; i--) {
    const day = today.minus({ days: i });
    if (!isWeekday(day)) continue;
    const progress = 1 - i / HISTORY_DAYS; // 0 = há 30 dias, 1 = ontem
    for (const doctorId of doctorIds) {
      const perDay = rng.int(7, 11);
      for (let k = 0; k < perDay; k++) {
        const slot = place(day, doctorId);
        if (!slot) break;
        const createdAt = DateTime.fromJSDate(slot.start).minus({ days: rng.int(2, 15), hours: rng.int(0, 8) }).toJSDate();
        const patient = somePatient(createdAt);
        const channel: Channel = rng.chance(0.15 + 0.35 * progress) ? 'SITE' : rng.chance(0.45) ? 'WHATSAPP' : 'PHONE';
        const reminded = rng.chance(0.55 + 0.4 * progress);
        const reminderSentAt = reminded ? toSP(slot.start).minus({ days: 1 }).set({ hour: 17, minute: rng.int(0, 5) }).toJSDate() : null;
        const confirmed = rng.chance(0.5 + 0.42 * progress);
        const noShowP = confirmed ? 0.02 : 0.28 - 0.14 * progress;
        let status: AppointmentStatus = rng.chance(noShowP) ? 'NO_SHOW' : 'DONE';
        if (rng.chance(0.05)) status = 'CANCELED';
        const confirmedAt = confirmed && status !== 'NO_SHOW'
          ? reminderSentAt && rng.chance(0.35)
            ? new Date(reminderSentAt.getTime() + rng.int(3, 120) * 60_000)
            : new Date(createdAt.getTime() + rng.int(5, 600) * 60_000)
          : null;
        const noShowAvoidedAt = confirmedAt && reminderSentAt && confirmedAt > reminderSentAt ? confirmedAt : null;
        push(
          {
            id: randomUUID(),
            doctorId,
            serviceId: slot.service.slug,
            insuranceId: pickInsurance(),
            start: slot.start,
            end: slot.end,
            status,
            channel,
            reminderSentAt,
            confirmedAt,
            noShowAvoidedAt,
            createdAt,
          },
          patient,
          i <= 10,
        );
      }
    }
  }

  // ── Próximas 3 semanas: ~60 agendamentos, mais cheios perto de hoje ─────
  const nowJs = now.toJSDate();
  const futureDays: DateTime[] = [];
  for (let i = 0; i < FUTURE_DAYS; i++) {
    const d = today.plus({ days: i });
    if (isWeekday(d)) futureDays.push(d);
  }
  const weights = futureDays.map((_, idx) => (idx === 0 ? 12 : idx === 1 ? 9 : idx < 5 ? 4.5 : idx < 10 ? 2.5 : 1.5));
  const total = weights.reduce((a, b) => a + b, 0);
  const target = 62;
  futureDays.forEach((day, idx) => {
    const count = Math.round((weights[idx] / total) * target);
    for (let placed = 0, tries = 0; placed < count && tries < count * 8; tries++) {
      const doctorId = rng.pick(doctorIds);
      const slot = place(day, doctorId);
      if (!slot) continue;
      placed++;
      const past = slot.start < nowJs;
      const createdAt = new Date(Math.min(nowJs.getTime() - 3_600_000, DateTime.fromJSDate(slot.start).minus({ days: rng.int(1, 12) }).toJSDate().getTime()));
      const patient = somePatient(createdAt);
      const channel: Channel = rng.chance(0.5) ? 'SITE' : rng.chance(0.6) ? 'WHATSAPP' : 'PHONE';
      let status: AppointmentStatus;
      let confirmedAt: Date | null = null;
      let reminderSentAt: Date | null = null;
      if (past) {
        status = rng.chance(0.88) ? 'DONE' : 'NO_SHOW';
        if (status === 'DONE') confirmedAt = new Date(createdAt.getTime() + 3_600_000);
        reminderSentAt = toSP(slot.start).minus({ days: 1 }).set({ hour: 17, minute: 2 }).toJSDate();
      } else {
        const r = rng.next();
        status = r < 0.08 ? 'CANCELED' : r < (idx === 0 ? 0.75 : 0.5) ? 'CONFIRMED' : 'PENDING';
        if (status === 'CONFIRMED') confirmedAt = new Date(Math.min(nowJs.getTime() - 60_000, createdAt.getTime() + rng.int(10, 600) * 60_000));
        // hoje: o lembrete saiu ontem à tarde. Amanhã ainda não, para o botão da demo.
        if (idx === 0) reminderSentAt = today.minus({ days: 1 }).set({ hour: 17, minute: 1 }).toJSDate();
      }
      if (reminderSentAt && reminderSentAt < createdAt) reminderSentAt = null;
      const noShowAvoidedAt = confirmedAt && reminderSentAt && confirmedAt > reminderSentAt ? confirmedAt : null;
      push(
        {
          id: randomUUID(),
          doctorId,
          serviceId: slot.service.slug,
          insuranceId: pickInsurance(),
          start: slot.start,
          end: slot.end,
          status,
          channel,
          confirmedAt,
          reminderSentAt,
          noShowAvoidedAt,
          notes: rng.chance(0.15) ? rng.pick(['Primeira consulta', 'Trazer exames anteriores', 'Usa lente de contato', 'Retorno pós-operatório', 'Paciente diabética']) : null,
          createdAt,
        },
        patient,
        true,
      );
    }
  });

  // ── Pós-operatório: 8 pacientes em etapas diferentes ────────────────────
  const journeyPlan: { procedure: Procedure; doctorId: DoctorId; sentUpTo: number; d1?: JourneyResponse; alertOpen?: boolean }[] = [
    { procedure: 'CATARATA', doctorId: 'doc_fernando', sentUpTo: -1 },
    { procedure: 'CATARATA', doctorId: 'doc_fernando', sentUpTo: 0 },
    { procedure: 'CROSSLINK', doctorId: 'doc_fernando', sentUpTo: 1 },
    { procedure: 'REFRATIVA', doctorId: 'doc_fernando', sentUpTo: 2 },
    { procedure: 'CATARATA', doctorId: 'doc_fernando', sentUpTo: 3 },
    { procedure: 'CATARATA', doctorId: 'doc_fernando', sentUpTo: 3, d1: 'PAIN', alertOpen: true },
    { procedure: 'PTERIGIO', doctorId: 'doc_rafael', sentUpTo: 4, d1: 'DOUBT' },
    { procedure: 'CROSSLINK', doctorId: 'doc_fernando', sentUpTo: 5, d1: 'OK' },
  ];
  const journeys: Prisma.SurgeryJourneyCreateManyInput[] = [];
  const steps: Prisma.JourneyStepCreateManyInput[] = [];
  const alerts: Prisma.AlertCreateManyInput[] = [];

  for (const plan of journeyPlan) {
    // a etapa atual cai "hoje": a jornada fica coerente com a data real
    const anchorKey: JourneyStepKey = plan.sentUpTo >= 0 ? STEP_ORDER[plan.sentUpTo] : 'D_MINUS_7';
    const extra = plan.sentUpTo >= 0 ? 0 : 3; // ainda faltam 3 dias para o D-7
    let surgery = today.plus({ days: -STEP_OFFSET_DAYS[anchorKey] + extra }).set({ hour: 7, minute: 30 });
    // cirurgia sempre em dia útil
    if (surgery.weekday === 6) surgery = surgery.minus({ days: 1 });
    if (surgery.weekday === 7) surgery = surgery.plus({ days: 1 });
    const patient = newPatient(surgery.minus({ days: 40 }).toJSDate());
    patient.birthDate = new Date(Date.UTC(1940 + rng.int(0, 25), rng.int(0, 11), rng.int(1, 28)));
    const id = randomUUID();
    const schedule = stepSchedule(surgery.toJSDate());
    const current = plan.sentUpTo >= 0 ? schedule[plan.sentUpTo] : null;
    journeys.push({
      id,
      patientId: patient.id,
      doctorId: plan.doctorId,
      procedure: plan.procedure,
      surgeryDate: surgery.toJSDate(),
      currentStep: current?.key ?? null,
      simulatedNow: current?.scheduledFor ?? nowJs,
      createdAt: surgery.minus({ days: 20 }).toJSDate(),
    });
    const vars = { nome: firstName(patient.name), médico: doctorName(plan.doctorId), procedimento: procedureLabel(plan.procedure), ...formatParts(surgery.toJSDate()) };
    schedule.forEach((s, idx) => {
      const sent = idx <= plan.sentUpTo;
      // envio às 9h (no dia da cirurgia, 6h30), nunca no futuro
      const sendTime = toSP(s.scheduledFor).set(s.key === 'D_DAY' ? { hour: 6, minute: 30 } : { hour: 9, minute: 0 }).toJSDate();
      const latest = nowJs.getTime() - (plan.sentUpTo - idx + 1) * 50 * 60_000;
      const sentAt = sent ? new Date(Math.min(sendTime.getTime(), latest)) : null;
      const isD1 = s.key === 'D_PLUS_1';
      const response = sent && isD1 ? (plan.d1 ?? (idx < plan.sentUpTo ? 'OK' : null)) : null;
      const readAt = sent && (idx < plan.sentUpTo || response) ? new Date(sentAt!.getTime() + 20 * 60_000) : null;
      steps.push({ journeyId: id, key: s.key, scheduledFor: s.scheduledFor, sentAt, readAt, response });
      if (!sent) return;
      messages.push({
        patientId: patient.id,
        direction: 'OUT',
        body: postOpMessage(s.key, vars),
        buttons: isD1 ? BUTTONS.postOp : undefined,
        status: readAt ? 'READ' : 'DELIVERED',
        relatedType: 'JOURNEY',
        relatedId: id,
        createdAt: sentAt!,
      });
      if (response) {
        const at = new Date(sentAt!.getTime() + 20 * 60_000);
        const label = { OK: 'Estou bem', DOUBT: 'Tenho uma dúvida', PAIN: 'Sinto dor' }[response];
        messages.push({ patientId: patient.id, direction: 'IN', body: label, status: 'READ', relatedType: 'JOURNEY', relatedId: id, createdAt: at });
        const tpl = response === 'PAIN' ? TEMPLATES.posOpDor : response === 'DOUBT' ? TEMPLATES.posOpDuvida : TEMPLATES.posOpOk;
        messages.push({
          patientId: patient.id,
          direction: 'OUT',
          body: render(tpl, { nome: firstName(patient.name) }),
          status: 'READ',
          relatedType: 'JOURNEY',
          relatedId: id,
          createdAt: new Date(at.getTime() + 15_000),
        });
        if (response !== 'OK') {
          alerts.push({
            journeyId: id,
            type: response === 'PAIN' ? 'POST_OP_PAIN' : 'POST_OP_DOUBT',
            message:
              response === 'PAIN'
                ? `${patient.name} relatou DOR na etapa D+1 · como está? da ${procedureLabel(plan.procedure)}. Telefone: ${patient.phone}.`
                : `${patient.name} tem uma DÚVIDA na etapa D+1 · como está? da ${procedureLabel(plan.procedure)}. Telefone: ${patient.phone}.`,
            createdAt: at,
            resolvedAt: plan.alertOpen ? null : new Date(at.getTime() + 40 * 60_000),
            resolvedBy: plan.alertOpen ? null : 'Recepção Mutton',
          });
        }
      }
    });
  }

  // ── Grava tudo ───────────────────────────────────────────────────────────
  await prisma.patient.createMany({ data: [...patients.values()] });
  await prisma.appointment.createMany({ data: appts });
  await prisma.surgeryJourney.createMany({ data: journeys });
  await prisma.journeyStep.createMany({ data: steps });
  await prisma.alert.createMany({ data: alerts });
  await prisma.message.createMany({ data: messages as Prisma.MessageCreateManyInput[] });

  const futureCount = appts.filter((a) => a.start >= today.toJSDate()).length;
  return {
    doctors: DOCTORS.length,
    services: SERVICES.length,
    patients: patients.size,
    appointments: appts.length,
    upcomingAppointments: futureCount,
    historyAppointments: appts.length - futureCount,
    journeys: journeys.length,
    openAlerts: alerts.filter((a) => !a.resolvedAt).length,
    messages: messages.length,
    blocks: blocks.length,
  };
}
