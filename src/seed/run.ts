import { prisma } from '../db.js';
import { runSeed } from './index.js';

const summary = await runSeed();
console.log('🌱 Seed concluído:', summary);
await prisma.$disconnect();
