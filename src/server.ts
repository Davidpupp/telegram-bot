import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { ZodError } from 'zod';
import './lib/zod-pt.js';
import { config, isProd, isTest } from './config.js';
import { AppError } from './lib/errors.js';
import { adminRoutes } from './routes/admin.js';
import { authRoutes } from './routes/auth.js';
import { demoRoutes } from './routes/demo.js';
import { eventRoutes } from './routes/events.js';
import { publicRoutes } from './routes/public.js';
import { webhookRoutes } from './routes/webhooks.js';
import { provider } from './whatsapp/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    rawBody?: string;
  }
}

function logger() {
  if (isTest) return false;
  return {
    level: config.LOG_LEVEL ?? 'info',
    transport: {
      target: 'pino-pretty',
      options: { translateTime: 'SYS:dd/mm HH:MM:ss', ignore: 'pid,hostname', colorize: !isProd },
    },
  };
}

export async function buildApp() {
  const app = Fastify({ logger: logger(), trustProxy: true });

  // guarda o corpo cru para validar a assinatura do webhook da Meta
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    req.rawBody = body as string;
    if (!body) return done(null, {});
    try {
      done(null, JSON.parse(body as string));
    } catch {
      done(new AppError(400, 'INVALID_JSON', 'O corpo da requisição não é um JSON válido.'), undefined);
    }
  });

  await app.register(cors, {
    origin: config.FRONTEND_URL.split(',').map((s) => s.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
  await app.register(cookie);

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Alguns dados estão inválidos. Confira os campos e tente de novo.',
          details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
      });
    }
    if (err instanceof AppError) {
      const { slots, ...rest } = err.extra ?? {};
      return reply.status(err.status).send({
        error: { code: err.code, message: err.message, ...rest },
        ...(slots ? { slots } : {}),
      });
    }
    const e = err as { statusCode?: number; message: string };
    if (e.statusCode && e.statusCode < 500) {
      return reply.status(e.statusCode).send({ error: { code: 'BAD_REQUEST', message: e.message } });
    }
    req.log.error({ err }, 'Erro inesperado');
    return reply.status(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Algo deu errado do nosso lado. Tente de novo em instantes.' } });
  });

  app.setNotFoundHandler((req, reply) =>
    reply.status(404).send({ error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.url} não existe.` } }),
  );

  app.get('/health', async () => ({ ok: true, whatsapp: provider.name, demoMode: config.DEMO_MODE }));

  await app.register(publicRoutes, { prefix: '/public' });
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(adminRoutes, { prefix: '/admin' });
  await app.register(eventRoutes);
  await app.register(webhookRoutes, { prefix: '/webhooks' });
  if (config.DEMO_MODE) await app.register(demoRoutes, { prefix: '/demo' });

  return app;
}
