import 'dotenv/config';
import { z } from 'zod';

const bool = z
  .string()
  .optional()
  .transform((v) => v === 'true' || v === '1');

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET precisa de pelo menos 8 caracteres'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  PUBLIC_API_URL: z.string().optional(),
  DEMO_MODE: bool,
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_ID: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_APP_SECRET: z.string().optional(),
  WHATSAPP_API_VERSION: z.string().default('v21.0'),
  /** Hora (America/Sao_Paulo) a partir da qual o job envia os lembretes da véspera. */
  REMINDER_HOUR: z.coerce.number().min(0).max(23).default(17),
  LOG_LEVEL: z.string().optional(),
});

export const config = schema.parse(process.env);
export const isTest = config.NODE_ENV === 'test';
export const isProd = config.NODE_ENV === 'production';
export const TZ = 'America/Sao_Paulo';
