import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/**/*.test.{js,jsx}'],
    environmentMatchGlobs: [
      ['**/__tests__/components/**', 'jsdom'],
    ],
    setupFiles: ['__tests__/setup.js'],
  },
});
