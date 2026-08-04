import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function globalSetup() {
  execSync('npx prisma migrate deploy', {
    cwd: path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../backend',
    ),
    env: {
      ...process.env,
      DATABASE_URL: 'postgresql://refund:refund@localhost:5432/refund_test',
    },
    stdio: 'inherit',
  });
}
