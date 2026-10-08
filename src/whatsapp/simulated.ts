import { storeOutgoing } from './store.js';
import type { WhatsAppProvider } from './types.js';

/** Padrão da demo: nada sai da clínica; a conversa vive no banco e no painel. */
export const simulatedProvider: WhatsAppProvider = {
  name: 'simulated',
  sendMessage: (input) => storeOutgoing(input, 'DELIVERED'),
};
