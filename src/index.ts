import { config } from './config.js';
import { prisma } from './db.js';
import { startJobs } from './jobs.js';
import { buildApp } from './server.js';
import { provider } from './whatsapp/index.js';

const app = await buildApp();
const job = startJobs(app.log);

await app.listen({ port: config.PORT, host: config.HOST });
app.log.info(`👁️  API da Clínica Mutton no ar · WhatsApp: ${provider.name} · DEMO_MODE=${config.DEMO_MODE}`);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    job.stop();
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
