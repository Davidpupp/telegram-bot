import { createHmac, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { prisma } from '../db.js';
import { AppError } from '../lib/errors.js';
import { publish } from '../lib/events.js';
import { processReply } from '../services/replies.js';

interface MetaWebhook {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          id: string;
          from: string;
          type: string;
          text?: { body: string };
          interactive?: { button_reply?: { id: string; title: string } };
          button?: { payload: string; text: string };
          context?: { id: string };
        }[];
        statuses?: { id: string; status: 'sent' | 'delivered' | 'read' | 'failed' }[];
      };
    }[];
  }[];
}

const STATUS_MAP = { sent: 'SENT', delivered: 'DELIVERED', read: 'READ' } as const;

function verifySignature(raw: string | undefined, header: string | undefined) {
  if (!config.WHATSAPP_APP_SECRET) return true;
  if (!raw || !header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', config.WHATSAPP_APP_SECRET).update(raw).digest('hex');
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function webhookRoutes(app: FastifyInstance) {
  // verificação do webhook pela Meta
  app.get('/whatsapp', async (req, reply) => {
    const q = req.query as Record<string, string>;
    if (q['hub.mode'] === 'subscribe' && config.WHATSAPP_VERIFY_TOKEN && q['hub.verify_token'] === config.WHATSAPP_VERIFY_TOKEN) {
      return reply.type('text/plain').send(q['hub.challenge']);
    }
    throw new AppError(403, 'INVALID_VERIFY_TOKEN', 'Token de verificação inválido.');
  });

  app.post('/whatsapp', async (req, reply) => {
    if (!verifySignature(req.rawBody, req.headers['x-hub-signature-256'] as string | undefined)) {
      throw new AppError(401, 'INVALID_SIGNATURE', 'Assinatura do webhook inválida.');
    }
    const body = req.body as MetaWebhook;
    for (const change of body.entry?.flatMap((e) => e.changes ?? []) ?? []) {
      const value = change.value ?? {};

      for (const st of value.statuses ?? []) {
        const status = STATUS_MAP[st.status as keyof typeof STATUS_MAP];
        if (!status) continue;
        const msg = await prisma.message.findUnique({ where: { externalId: st.id } });
        if (msg && msg.status !== 'READ') {
          const updated = await prisma.message.update({ where: { id: msg.id }, data: { status } });
          publish('message.updated', { message: updated });
        }
      }

      for (const m of value.messages ?? []) {
        try {
          // botão interativo: id = "<messageId>:<buttonId>" (ver whatsapp/meta.ts)
          const replyId = m.interactive?.button_reply?.id ?? m.button?.payload;
          if (replyId?.includes(':')) {
            const [messageId, buttonId] = replyId.split(':');
            await processReply(messageId, buttonId);
            continue;
          }
          // texto livre: guarda na conversa para a recepção ver
          const patient = await prisma.patient.findUnique({ where: { phone: `+${m.from}` } });
          if (patient && m.text?.body) {
            const message = await prisma.message.create({
              data: { patientId: patient.id, direction: 'IN', body: m.text.body, status: 'READ', externalId: m.id },
            });
            publish('message.created', { message, phone: patient.phone });
          }
        } catch (err) {
          req.log.warn({ err, wamid: m.id }, 'Resposta do WhatsApp ignorada');
        }
      }
    }
    // a Meta só precisa de 200; erros por mensagem ficam no log
    return reply.status(200).send({ received: true });
  });
}
