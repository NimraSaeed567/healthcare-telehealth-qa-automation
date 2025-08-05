import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'always' }]],
  use: {
    trace: 'on-first-retry',
    timeout: 120000, // 2 minutes per test
    actionTimeout: 100000, // 100 seconds per user action
    headless: true,
    video: 'on-first-retry',
    screenshot:'on-first-failure'
    // baseURL: process.env.BASE_URL || 'https://hcmd-stage.hcmdcommunication.com',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});