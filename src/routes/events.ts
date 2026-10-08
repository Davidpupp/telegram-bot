import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../lib/auth.js';
import { subscribe } from '../lib/events.js';

const HEARTBEAT_MS = 20_000;

/**
 * SSE do painel. Autenticação pelo cookie (EventSource com `withCredentials: true`)
 * ou `?token=` para clientes que não mandam cookie.
 */
export async function eventRoutes(app: FastifyInstance) {
  app.get('/events', { preHandler: requireAuth }, (req, reply) => {
    reply.hijack();
    const res = reply.raw;
    res.writeHead(200, {
      ...(reply.getHeaders() as Record<string, string>),
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(`retry: 3000\n\n`);
    res.write(`event: ready\ndata: ${JSON.stringify({ type: 'ready', payload: { user: req.user?.name }, at: new Date().toISOString() })}\n\n`);

    const unsubscribe = subscribe((e) => {
      // `data` leva { type, payload, at }; `event` permite addEventListener('appointment.created', …)
      res.write(`event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`);
    });
    const heartbeat = setInterval(() => res.write(`: heartbeat ${new Date().toISOString()}\n\n`), HEARTBEAT_MS);

    req.raw.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });
}
