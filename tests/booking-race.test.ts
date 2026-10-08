import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { captureEvents, freeSlot, http, setupApp, testPatient } from './helpers.js';

let app: Awaited<ReturnType<typeof setupApp>>;
beforeAll(async () => {
  app = await setupApp();
});
afterAll(() => app.close());

const body = (start: string) => ({
  serviceId: 'consulta-oftalmologica',
  doctorId: 'doc_rafael',
  insuranceId: 'ins_b',
  start,
  patient: testPatient(),
  lgpdConsent: true,
});

describe('POST /public/appointments', () => {
  it('cria o agendamento, gera a mensagem de confirmação e publica os eventos', async () => {
    const ev = captureEvents();
    const start = await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 3, 5);
    const res = await http(app).post('/public/appointments').send(body(start)).expect(201);
    ev.stop();

    expect(res.body.appointment.status).toBe('PENDING');
    expect(res.body.appointment.channel).toBe('SITE');
    expect(res.body.icsUrl).toMatch(/\/public\/appointments\/.+\/ics$/);
    expect(ev.types()).toEqual(expect.arrayContaining(['appointment.created', 'message.created']));

    const msg = await prisma.message.findFirst({ where: { relatedId: res.body.appointment.id } });
    expect(msg?.body).toContain('Rua Santiago, 289');
    expect(msg?.buttons).toEqual([
      { id: 'CONFIRM', label: 'Confirmar' },
      { id: 'RESCHEDULE', label: 'Remarcar' },
    ]);

    const ics = await http(app).get(`/public/appointments/${res.body.appointment.id}/ics`).expect(200);
    expect(ics.headers['content-type']).toContain('text/calendar');
    expect(ics.text).toContain('BEGIN:VEVENT');
  });

  it('corrida: dois pedidos no mesmo horário → um 201 e um 409 SLOT_TAKEN', async () => {
    const start = await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 4);
    const [a, b] = await Promise.all([
      http(app).post('/public/appointments').send(body(start)),
      http(app).post('/public/appointments').send(body(start)),
    ]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);

    const conflict = a.status === 409 ? a : b;
    expect(conflict.body.error.code).toBe('SLOT_TAKEN');
    expect(Array.isArray(conflict.body.slots)).toBe(true);
    expect(conflict.body.slots).not.toContain(start);
    expect(conflict.body.slots.length).toBeGreaterThan(0);

    const active = await prisma.appointment.count({
      where: { doctorId: 'doc_rafael', start: new Date(start), status: { in: ['PENDING', 'CONFIRMED'] } },
    });
    expect(active).toBe(1);
  });

  it('corrida com 5 pedidos simultâneos: só um leva o horário', async () => {
    const start = await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 5);
    const results = await Promise.all(Array.from({ length: 5 }, () => http(app).post('/public/appointments').send(body(start))));
    const codes = results.map((r) => r.status).sort();
    expect(codes).toEqual([201, 409, 409, 409, 409]);
  });

  it('sem consentimento LGPD → 400 com mensagem em pt-BR', async () => {
    const start = await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 3);
    const res = await http(app)
      .post('/public/appointments')
      .send({ ...body(start), lgpdConsent: false })
      .expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(res.body.error.details)).toContain('LGPD');
  });

  it('remarcar libera o horário antigo e volta para PENDING com nova mensagem', async () => {
    const [s1, s2] = [
      await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 6, 0),
      await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 6, 2),
    ];
    const created = await http(app).post('/public/appointments').send(body(s1)).expect(201);
    const id = created.body.appointment.id;
    const res = await http(app).post(`/public/appointments/${id}/reschedule`).send({ start: s2 }).expect(200);
    expect(res.body.appointment.status).toBe('PENDING');
    expect(new Date(res.body.appointment.start).toISOString()).toBe(new Date(s2).toISOString());

    const free = await freeSlot(app, 'doc_rafael', 'consulta-oftalmologica', 6, 0);
    expect(free).toBe(s1);
    const msgs = await prisma.message.findMany({ where: { relatedId: id }, orderBy: { createdAt: 'asc' } });
    expect(msgs.at(-1)?.body).toContain('remarcada');
  });
});
