process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'file:./prisma/test.db';

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterAll, afterEach, beforeAll } from 'vitest';

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const testDbPath = path.join(backendRoot, 'prisma/test.db');

beforeAll(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  execSync('npx prisma migrate deploy', {
    cwd: backendRoot,
    env: process.env,
  });
});

afterEach(async () => {
  const { prisma } = await import('@/lib/prisma');

  await prisma.refunds.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  const { prisma } = await import('@/lib/prisma');

  await prisma.$disconnect();

  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});
