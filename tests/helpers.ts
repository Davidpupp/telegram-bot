import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { subscribe, type AppEvent } from '../src/lib/events.js';
import { buildApp } from '../src/server.js';

export async function setupApp() {
  const app = await buildApp();
  await app.ready();
  return app;
}

export const http = (app: FastifyInstance) => request(app.server);

export async function login(app: FastifyInstance, email = 'recepcao@mutton.demo') {
  const res = await http(app).post('/auth/login').send({ email, password: 'demo123' }).expect(200);
  return res.headers['set-cookie'] as unknown as string[];
}

/** Grava os eventos publicados enquanto o teste roda. */
export function captureEvents() {
  const events: AppEvent[] = [];
  const stop = subscribe((e) => events.push(e));
  return { events, stop, types: () => events.map((e) => e.type) };
}

/** Primeiro horário livre a partir de daqui a `minDaysAhead` dias. */
export async function freeSlot(app: FastifyInstance, doctorId: string, serviceId: string, minDaysAhead = 2, pick = 0) {
  const from = new Date(Date.now() + minDaysAhead * 86_400_000).toISOString().slice(0, 10);
  const res = await http(app).get('/public/availability').query({ doctorId, serviceId, from, days: 14 }).expect(200);
  const slots = (res.body as { date: string; slots: string[] }[]).flatMap((d) => d.slots);
  if (!slots[pick]) throw new Error('Nenhum horário livre para o teste');
  return slots[pick];
}

let n = 0;
export function testPatient() {
  n++;
  return {
    name: `Paciente Teste ${n}`,
    phone: `(15) 98${String(Date.now()).slice(-3)}-${String(1000 + n).slice(-4)}`,
    birthDate: '1975-03-12',
  };
}
