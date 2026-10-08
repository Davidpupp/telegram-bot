import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { freeSlot, http, setupApp, testPatient } from './helpers.js';

let app: Awaited<ReturnType<typeof setupApp>>;
beforeAll(async () => {
  app = await setupApp();
});
afterAll(() => app.close());

describe('Webhook do WhatsApp (Meta Cloud API)', () => {
  it('verificação GET devolve o challenge só com o token certo', async () => {
    const ok = await http(app)
      .get('/webhooks/whatsapp')
      .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'token-de-teste', 'hub.challenge': '12345' })
      .expect(200);
    expect(ok.text).toBe('12345');
    await http(app)
      .get('/webhooks/whatsapp')
      .query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'errado', 'hub.challenge': '1' })
      .expect(403);
  });

  it('um toque em "Confirmar" vindo da Meta segue o mesmo fluxo do simulado', async () => {
    const start = await freeSlot(app, 'doc_helena', 'olho-seco', 3);
    const created = await http(app)
      .post('/public/appointments')
      .send({ serviceId: 'olho-seco', doctorId: 'doc_helena', insuranceId: 'ins_c', start, patient: testPatient(), lgpdConsent: true })
      .expect(201);
    const { id, patient } = created.body.appointment;
    const out = await prisma.message.findFirstOrThrow({ where: { relatedId: id, direction: 'OUT' } });

    await http(app)
      .post('/webhooks/whatsapp')
      .send({
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      id: 'wamid.TESTE',
                      from: patient.phone.replace('+', ''),
                      type: 'interactive',
                      interactive: { type: 'button_reply', button_reply: { id: `${out.id}:CONFIRM`, title: 'Confirmar' } },
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
      .expect(200);

    const saved = await prisma.appointment.findUniqueOrThrow({ where: { id } });
    expect(saved.status).toBe('CONFIRMED');
  });
});
