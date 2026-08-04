import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const backendRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(backendRoot, './src'),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    fileParallelism: false,
  },
});
