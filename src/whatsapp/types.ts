import type { Message, RelatedType } from '@prisma/client';

export interface Button {
  id: string;
  label: string;
}

export interface SendMessageInput {
  /** Telefone em E.164 */
  to: string;
  body: string;
  buttons?: Button[];
  /** Contexto opcional para ligar a mensagem a um agendamento ou jornada */
  patientId?: string;
  relatedType?: RelatedType;
  relatedId?: string;
}

export interface WhatsAppProvider {
  readonly name: 'simulated' | 'meta';
  sendMessage(input: SendMessageInput): Promise<Message>;
}
