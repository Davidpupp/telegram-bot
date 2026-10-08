import { badRequest } from './errors.js';

/** Normaliza telefones brasileiros para E.164 (+55DDDNÚMERO). */
export function normalizePhone(input: string): string {
  let digits = decodeURIComponent(input).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.replace(/^0+/, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!digits.startsWith('55') || (digits.length !== 12 && digits.length !== 13)) {
    throw badRequest('INVALID_PHONE', 'Telefone inválido. Use DDD + número, ex.: (15) 99876-5432.');
  }
  return `+${digits}`;
}
