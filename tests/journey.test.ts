import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { captureEvents, http, login, setupApp } from './helpers.js';

let app: Awaited<ReturnType<typeof setupApp>>;
let cookie: string[];
beforeAll(async () => {
  app = await setupApp();
  cookie = await login(app);
});
afterAll(() => app.close());

describe('Jornada cirúrgica', () => {
  it('avança até o D+1, a paciente responde DOR e o alerta aparece no painel', async () => {
    const list = await http(app).get('/admin/journeys').set('Cookie', cookie).expect(200);
    expect(list.body).toHaveLength(8);
    const journey = list.body.find((j: { currentStep: string | null }) => j.currentStep === null);
    expect(journey).toBeTruthy();

    const ev = captureEvents();
    let last;
    for (const expected of ['D_MINUS_7', 'D_MINUS_1', 'D_DAY', 'D_PLUS_1']) {
      last = await http(app).post(`/admin/journeys/${journey.id}/advance`).set('Cookie', cookie).expect(200);
      expect(last.body.journey.currentStep).toBe(expected);
    }
    const d1 = last!.body.message;
    expect(d1.buttons.map((b: { id: string }) => b.id)).toEqual(['OK', 'DOUBT', 'PAIN']);
    expect(d1.body).toContain('equipe médica');
    const step = last!.body.journey.steps.find((s: { key: string }) => s.key === 'D_PLUS_1');
    expect(step.sentAt).not.toBeNull();
    expect(new Date(last!.body.journey.simulatedNow).getTime()).toBe(new Date(step.scheduledFor).getTime());

    const phone = encodeURIComponent(journey.patient.phone);
    const reply = await http(app).post(`/public/whatsapp/${phone}/reply`).send({ messageId: d1.id, buttonId: 'PAIN' }).expect(200);
    ev.stop();
    expect(reply.body.alert.type).toBe('POST_OP_PAIN');

    const alerts = await http(app).get('/admin/alerts?open=true').set('Cookie', cookie).expect(200);
    const alert = alerts.body.find((a: { journeyId: string }) => a.journeyId === journey.id);
    expect(alert).toBeTruthy();
    expect(alert.type).toBe('POST_OP_PAIN');
    expect(alert.message).toContain(journey.patient.name);
    expect(ev.types()).toEqual(expect.arrayContaining(['journey.updated', 'alert.created', 'message.created']));

    const detail = await http(app).get(`/admin/journeys/${journey.id}`).set('Cookie', cookie).expect(200);
    expect(detail.body.steps.find((s: { key: string }) => s.key === 'D_PLUS_1').response).toBe('PAIN');

    const resolved = await http(app).post(`/admin/alerts/${alert.id}/resolve`).set('Cookie', cookie).expect(200);
    expect(resolved.body.resolvedBy).toBe('Recepção Mutton');
    const open = await http(app).get('/admin/alerts?open=true').set('Cookie', cookie).expect(200);
    expect(open.body.some((a: { id: string }) => a.id === alert.id)).toBe(false);
  });

  it('o seed já traz um alerta de pós-operatório aberto', async () => {
    const open = await http(app).get('/admin/alerts?open=true').set('Cookie', cookie).expect(200);
    expect(open.body.length).toBeGreaterThanOrEqual(1);
  });
});
