// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  /* Parallélisme : un seul worker pour la première vague */
  fullyParallel: false,
  workers: 1,

  /* Retries : 0 en dev, 1 en CI */
  retries: process.env.CI ? 1 : 0,

  /* Reporter : liste console + rapport HTML */
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3100',
    /* Screenshots uniquement en cas d'échec */
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  /* Dev server : lance Next.js sur un port dédié pour éviter les conflits */
  webServer: {
    command: 'npx next dev --port 3100',
    port: 3100,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
