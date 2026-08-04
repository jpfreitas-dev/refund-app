import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const testDatabaseUrl = 'postgresql://refund:refund@localhost:5432/refund_test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev --workspace refund-api',
      url: 'http://localhost:3334/users',
      cwd: monorepoRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        DATABASE_URL: testDatabaseUrl,
        JWT_SECRET: 'e2e-jwt-secret',
        PORT: '3334',
      },
    },
    {
      command: 'npm run dev --workspace refund-web -- --port 5174',
      url: 'http://localhost:5174',
      cwd: monorepoRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_URL: 'http://localhost:3334',
      },
    },
  ],
});
