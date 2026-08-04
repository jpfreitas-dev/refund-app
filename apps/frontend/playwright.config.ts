import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(frontendRoot, '../..');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev --workspace refund-api',
      url: 'http://localhost:3333/users',
      cwd: monorepoRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace refund-web',
      url: 'http://localhost:5173',
      cwd: monorepoRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
