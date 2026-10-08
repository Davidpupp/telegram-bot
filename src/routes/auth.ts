import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { COOKIE_NAME, cookieOptions, requireAuth, signToken } from '../lib/auth.js';
import { AppError } from '../lib/errors.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (req, reply) => {
    const { email, password } = z
      .object({ email: z.string().email('E-mail inválido'), password: z.string().min(1, 'Informe a senha') })
      .parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha incorretos.');
    }
    const session = { id: user.id, email: user.email, name: user.name, role: user.role };
    const token = signToken(session);
    reply.setCookie(COOKIE_NAME, token, cookieOptions());
    return { user: session, token };
  });

  app.post('/logout', async (_req, reply) => {
    reply.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
    return { ok: true };
  });

  app.get('/me', { preHandler: requireAuth }, async (req) => ({ user: req.user }));
}
