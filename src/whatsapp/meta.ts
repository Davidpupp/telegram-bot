import { config } from '../config.js';
import { prisma } from '../db.js';
import { AppError } from '../lib/errors.js';
import { storeOutgoing } from './store.js';
import type { WhatsAppProvider } from './types.js';

/**
 * WhatsApp oficial (Meta Cloud API). As respostas chegam em POST /webhooks/whatsapp.
 * O id de cada botão vai como "<messageId>:<buttonId>" para o webhook saber a qual mensagem ele pertence.
 */
export const metaProvider: WhatsAppProvider = {
  name: 'meta',
  async sendMessage(input) {
    const message = await storeOutgoing(input, 'SENT');
    const to = input.to.replace(/^\+/, '');
    const payload = input.buttons?.length
      ? {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: input.body.slice(0, 1024) },
            action: {
              buttons: input.buttons.slice(0, 3).map((b) => ({
                type: 'reply',
                reply: { id: `${message.id}:${b.id}`, title: b.label.slice(0, 20) },
              })),
            },
          },
        }
      : { messaging_product: 'whatsapp', to, type: 'text', text: { body: input.body } };

    const res = await fetch(
      `https://graph.facebook.com/${config.WHATSAPP_API_VERSION}/${config.WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json().catch(() => ({}))) as { messages?: { id: string }[]; error?: { message?: string } };
    if (!res.ok) {
      throw new AppError(502, 'WHATSAPP_SEND_FAILED', `Não foi possível enviar pelo WhatsApp: ${data.error?.message ?? res.status}`);
    }
    const externalId = data.messages?.[0]?.id;
    return externalId ? prisma.message.update({ where: { id: message.id }, data: { externalId } }) : message;
  },
};
