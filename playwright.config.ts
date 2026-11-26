import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const APP_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001';

export default defineConfig({
  fullyParallel: true, // safe: every sign-up test uses a unique email
  forbidOnly: isCI, // a leftover test.only fails CI instead of silently skipping tests
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // API tests: no browser needed
    { name: 'api', testDir: './tests/api', use: { baseURL: API_URL } },

    // UI E2E tests
    { name: 'chromium', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'], baseURL: APP_URL } },
    { name: 'firefox', testDir: './tests/e2e', use: { ...devices['Desktop Firefox'], baseURL: APP_URL } },
    { name: 'webkit', testDir: './tests/e2e', use: { ...devices['Desktop Safari'], baseURL: APP_URL } },
  ],

  // Playwright starts both servers before the tests and stops them after.
  // Locally it reuses servers you already have running.
  webServer: [
    {
      command: 'npm run mock-api',
      url: `${API_URL}/users`,
      reuseExistingServer: !isCI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      url: APP_URL,
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
});
