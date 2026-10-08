import { DateTime } from 'luxon';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { http, login, setupApp } from './helpers.js';

const TZ = 'America/Sao_Paulo';
let app: Awaited<ReturnType<typeof setupApp>>;

beforeAll(async () => {
  app = await setupApp();
});
afterAll(() => app.close());

describe('GET /public/availability', () => {
  it('devolve só dias úteis, horários de 20 em 20 min, no futuro e dentro do expediente', async () => {
    const from = DateTime.now().setZone(TZ).toISODate()!;
    const res = await http(app)
      .get('/public/availability')
      .query({ doctorId: 'doc_helena', serviceId: 'consulta-oftalmologica', from, days: 14 })
      .expect(200);
    const days = res.body as { date: string; slots: string[] }[];
    expect(days.length).toBeGreaterThan(5);

    const busy = await prisma.appointment.findMany({
      where: { doctorId: 'doc_helena', status: { in: ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'DONE'] } },
    });
    const blocks = await prisma.block.findMany({ where: { OR: [{ doctorId: 'doc_helena' }, { doctorId: null }] } });
    let total = 0;
    for (const d of days) {
      const weekday = DateTime.fromISO(d.date, { zone: TZ }).weekday;
      expect(weekday).toBeLessThanOrEqual(5);
      for (const s of d.slots) {
        total++;
        expect(s).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00Z$/);
        const start = new Date(s);
        const local = DateTime.fromJSDate(start).setZone(TZ);
        expect(local.toISODate()).toBe(d.date);
        expect(local.minute % 20).toBe(0);
        // Dra. Helena: 08h–17h com almoço 12h–13h; consulta de 20 min
        expect(local.hour).toBeGreaterThanOrEqual(8);
        expect(local.hour * 60 + local.minute).toBeLessThanOrEqual(16 * 60 + 40);
        expect(local.hour).not.toBe(12);
        expect(start.getTime()).toBeGreaterThan(Date.now());
        const end = new Date(start.getTime() + 20 * 60_000);
        expect(busy.some((a) => a.start < end && start < a.end)).toBe(false);
        expect(blocks.some((b) => b.start < end && start < b.end)).toBe(false);
      }
    }
    expect(total).toBeGreaterThan(20);
  });

  it('um bloqueio tira os horários da agenda e excluí-lo devolve', async () => {
    const cookie = await login(app, 'gerencia@mutton.demo');
    const q = { doctorId: 'doc_helena', serviceId: 'consulta-oftalmologica', days: 14, from: DateTime.now().setZone(TZ).plus({ days: 2 }).toISODate()! };
    const before = (await http(app).get('/public/availability').query(q)).body as { date: string; slots: string[] }[];
    const day = before.find((d) => d.slots.length >= 3)!;
    const block = await http(app)
      .post('/admin/blocks')
      .set('Cookie', cookie)
      .send({ doctorId: 'doc_helena', start: day.slots[0], end: new Date(new Date(day.slots[0]).getTime() + 60 * 60_000).toISOString(), reason: 'Reunião clínica' })
      .expect(201);

    const after = (await http(app).get('/public/availability').query(q)).body as { date: string; slots: string[] }[];
    const sameDay = after.find((d) => d.date === day.date)!;
    expect(sameDay.slots).not.toContain(day.slots[0]);
    expect(sameDay.slots.length).toBeLessThan(day.slots.length);

    await http(app).delete(`/admin/blocks/${block.body.block.id}`).set('Cookie', cookie).expect(204);
    const restored = (await http(app).get('/public/availability').query(q)).body as { date: string; slots: string[] }[];
    expect(restored.find((d) => d.date === day.date)!.slots).toEqual(day.slots);
  });

  it('médico que não atende o serviço → 422 com mensagem em pt-BR', async () => {
    const res = await http(app)
      .get('/public/availability')
      .query({ doctorId: 'doc_helena', serviceId: 'catarata' })
      .expect(422);
    expect(res.body.error.code).toBe('DOCTOR_DOES_NOT_OFFER_SERVICE');
    expect(res.body.error.message).toContain('não atende');
  });
});
