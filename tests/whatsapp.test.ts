import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { captureEvents, freeSlot, http, setupApp, testPatient } from './helpers.js';

let app: Awaited<ReturnType<typeof setupApp>>;
beforeAll(async () => {
  app = await setupApp();
});
afterAll(() => app.close());

async function book() {
  const patient = testPatient();
  const start = await freeSlot(app, 'doc_fernando', 'consulta-oftalmologica', 3);
  const res = await http(app)
    .post('/public/appointments')
    .send({ serviceId: 'consulta-oftalmologica', doctorId: 'doc_fernando', insuranceId: null, start, patient, lgpdConsent: true })
    .expect(201);
  return { appointment: res.body.appointment, phone: res.body.appointment.patient.phone as string };
}

describe('WhatsApp simulado', () => {
  it('confirmar pelo WhatsApp muda o status para CONFIRMED e marca as mensagens como lidas', async () => {
    const { appointment, phone } = await book();
    const conv = await http(app).get(`/public/whatsapp/${encodeURIComponent(phone)}`).expect(200);
    const out = conv.body.messages.find((m: { buttons: unknown }) => m.buttons);
    expect(out.body).toContain('Toque em Confirmar ou Remarcar');

    const ev = captureEvents();
    const res = await http(app)
      .post(`/public/whatsapp/${encodeURIComponent(phone)}/reply`)
      .send({ messageId: out.id, buttonId: 'CONFIRM' })
      .expect(200);
    ev.stop();

    expect(res.body.action).toBe('CONFIRMED');
    const saved = await prisma.appointment.findUniqueOrThrow({ where: { id: appointment.id } });
    expect(saved.status).toBe('CONFIRMED');
    expect(saved.confirmedAt).not.toBeNull();

    const after = await http(app).get(`/public/whatsapp/${encodeURIComponent(phone)}`).expect(200);
    const msgs = after.body.messages as { id: string; direction: string; body: string; status: string }[];
    expect(msgs.find((m) => m.id === out.id)?.status).toBe('READ');
    expect(msgs.some((m) => m.direction === 'IN' && m.body === 'Confirmar')).toBe(true);
    expect(msgs.at(-1)?.body).toContain('confirmada');
    expect(ev.types()).toEqual(expect.arrayContaining(['appointment.updated', 'message.created']));
  });

  it('remarcar pelo WhatsApp devolve o link /agendar?remarcar={id}', async () => {
    const { appointment, phone } = await book();
    const conv = await http(app).get(`/public/whatsapp/${phone.replace('+', '')}`).expect(200);
    const out = conv.body.messages[0];
    const res = await http(app)
      .post(`/public/whatsapp/${phone.replace('+', '')}/reply`)
      .send({ messageId: out.id, buttonId: 'RESCHEDULE' })
      .expect(200);
    expect(res.body.rescheduleUrl).toBe(`/agendar?remarcar=${appointment.id}`);
  });

  it('lembrete da véspera e resposta contam como falta evitada', async () => {
    const res = await http(app).post('/demo/send-reminders').expect(200);
    expect(res.body.sent).toBeGreaterThanOrEqual(0);
    const again = await http(app).post('/demo/send-reminders').expect(200);
    expect(again.body.sent).toBe(0); // não duplica

    if (res.body.sent > 0) {
      const id = res.body.appointmentIds[0];
      const reminder = await prisma.message.findFirstOrThrow({
        where: { relatedId: id, body: { contains: 'lembrar' } },
        include: { patient: true },
      });
      await http(app)
        .post(`/public/whatsapp/${encodeURIComponent(reminder.patient.phone)}/reply`)
        .send({ messageId: reminder.id, buttonId: 'CONFIRM' })
        .expect(200);
      const a = await prisma.appointment.findUniqueOrThrow({ where: { id } });
      expect(a.noShowAvoidedAt).not.toBeNull();
    }
  });

  it('botão inexistente → 422', async () => {
    const { phone } = await book();
    const conv = await http(app).get(`/public/whatsapp/${encodeURIComponent(phone)}`).expect(200);
    const res = await http(app)
      .post(`/public/whatsapp/${encodeURIComponent(phone)}/reply`)
      .send({ messageId: conv.body.messages[0].id, buttonId: 'PAIN' })
      .expect(422);
    expect(res.body.error.code).toBe('INVALID_BUTTON');
  });
});
