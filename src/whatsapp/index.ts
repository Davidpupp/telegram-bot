import { config } from '../config.js';
import { metaProvider } from './meta.js';
import { simulatedProvider } from './simulated.js';
import type { SendMessageInput, WhatsAppProvider } from './types.js';

export type { Button, SendMessageInput, WhatsAppProvider } from './types.js';

export const whatsappEnabled = Boolean(config.WHATSAPP_TOKEN && config.WHATSAPP_PHONE_ID);

export const provider: WhatsAppProvider = whatsappEnabled ? metaProvider : simulatedProvider;

export function sendMessage(input: SendMessageInput) {
  return provider.sendMessage(input);
}
