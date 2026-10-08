import type { Role } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { config, isProd } from '../config.js';
import { AppError } from './errors.js';

export const COOKIE_NAME = 'mutton_session';
const MAX_AGE_S = 60 * 60 * 12;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: SessionUser;
  }
}

export const signToken = (u: SessionUser) => jwt.sign(u, config.JWT_SECRET, { expiresIn: MAX_AGE_S });

export const cookieOptions = () => ({
  path: '/',
  httpOnly: true,
  // front e API em domínios diferentes (Vercel × Render) exigem SameSite=None + Secure
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  secure: isProd,
  maxAge: MAX_AGE_S,
});

export function readUser(req: FastifyRequest): SessionUser | undefined {
  const header = req.headers.authorization;
  const token =
    req.cookies?.[COOKIE_NAME] ??
    (header?.startsWith('Bearer ') ? header.slice(7) : undefined) ??
    (req.query as { token?: string } | undefined)?.token;
  if (!token) return undefined;
  try {
    const { id, email, name, role } = jwt.verify(token, config.JWT_SECRET) as SessionUser;
    return { id, email, name, role };
  } catch {
    return undefined;
  }
}

export async function requireAuth(req: FastifyRequest, _reply: FastifyReply) {
  const user = readUser(req);
  if (!user) throw new AppError(401, 'UNAUTHORIZED', 'Faça login para acessar o painel.');
  req.user = user;
}
