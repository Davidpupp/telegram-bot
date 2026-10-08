import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'vitest/config';

const env = loadEnv({ path: '.env.test', override: true }).parsed ?? {};

export default defineConfig({
  test: {
    env,
    globalSetup: ['tests/global-setup.ts'],
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 60_000,
  },
});
