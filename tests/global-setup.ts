import { execSync } from 'node:child_process';

/** Aplica as migrations e roda o seed completo no banco de testes. */
export default async function setup() {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
  const { runSeed } = await import('../src/seed/index.js');
  const { prisma } = await import('../src/db.js');
  await runSeed();
  await prisma.$disconnect();
}
