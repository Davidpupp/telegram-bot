import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { http, login, setupApp } from './helpers.js';

let app: Awaited<ReturnType<typeof setupApp>>;
beforeAll(async () => {
  app = await setupApp();
});
afterAll(() => app.close());

describe('Painel', () => {
  it('rotas do painel exigem login', async () => {
    const res = await http(app).get('/admin/metrics').expect(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    await http(app).get('/events').expect(401);
  });

  it('senha errada → 401 em pt-BR', async () => {
    const res = await http(app).post('/auth/login').send({ email: 'gerencia@mutton.demo', password: 'x' }).expect(401);
    expect(res.body.error.message).toBe('E-mail ou senha incorretos.');
  });

  it('login, /auth/me, métricas, agenda e relatórios', async () => {
    const cookie = await login(app, 'gerencia@mutton.demo');
    expect(cookie.join(';')).toContain('HttpOnly');
    const me = await http(app).get('/auth/me').set('Cookie', cookie).expect(200);
    expect(me.body.user.role).toBe('MANAGER');

    const m = await http(app).get('/admin/metrics').set('Cookie', cookie).expect(200);
    expect(m.body).toMatchObject({
      today: expect.any(Number),
      confirmed: expect.any(Number),
      awaitingReply: expect.any(Number),
      noShowsAvoidedMonth: expect.any(Number),
      deltas: expect.any(Object),
    });

    const agenda = await http(app).get('/admin/agenda').set('Cookie', cookie).expect(200);
    for (const a of agenda.body.appointments) {
      expect(a.patient.name).toBeTruthy();
      expect(a.service.name).toBeTruthy();
    }

    const r = await http(app).get('/admin/reports?days=30').set('Cookie', cookie).expect(200);
    expect(r.body.byChannel).toHaveLength(3);
    expect(r.body.byInsurance.some((i: { name: string }) => i.name === 'Particular')).toBe(true);
    const weeks = r.body.confirmationRateByWeek;
    expect(weeks.length).toBeGreaterThanOrEqual(4);
    expect(weeks.at(-1).rate).toBeGreaterThan(weeks[0].rate);
    expect(r.body.noShowsAvoidedByWeek.length).toBe(weeks.length);
  });
});
