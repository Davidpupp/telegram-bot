import type { MessageStatus } from '@prisma/client';
import { prisma } from '../db.js';
import { publish } from '../lib/events.js';
import { notFound } from '../lib/errors.js';
import type { SendMessageInput } from './types.js';

/** Grava a mensagem OUT na tabela Message e publica `message.created`. */
export async function storeOutgoing(input: SendMessageInput, status: MessageStatus) {
  const patientId =
    input.patientId ?? (await prisma.patient.findUnique({ where: { phone: input.to } }))?.id;
  if (!patientId) throw notFound('Paciente');
  const message = await prisma.message.create({
    data: {
      patientId,
      direction: 'OUT',
      body: input.body,
      buttons: input.buttons?.length ? input.buttons.map((b) => ({ id: b.id, label: b.label })) : undefined,
      status,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
    },
  });
  publish('message.created', { message, phone: input.to });
  return message;
}
