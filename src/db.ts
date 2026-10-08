import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/** Cliente aceito pelos serviços: o global ou o de uma transação. */
export type Db = PrismaClient | Prisma.TransactionClient;
