import cron from 'node-cron';
import type { FastifyBaseLogger } from 'fastify';
import { config, TZ } from './config.js';
import { nowSP } from './lib/time.js';
import { sendTomorrowReminders } from './services/reminders.js';

/** Roda a cada minuto; a partir de REMINDER_HOUR (fuso de SP) envia os lembretes da véspera pendentes. */
export function startJobs(log: FastifyBaseLogger) {
  let running = false;
  return cron.schedule(
    '* * * * *',
    async () => {
      if (running || nowSP().hour < config.REMINDER_HOUR) return;
      running = true;
      try {
        const r = await sendTomorrowReminders();
        if (r.sent) log.info(`📨 Lembretes da véspera enviados: ${r.sent} (${r.date})`);
      } catch (err) {
        log.error({ err }, 'Falha no job de lembretes');
      } finally {
        running = false;
      }
    },
    { timezone: TZ },
  );
}
