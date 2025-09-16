import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

// carrega o .env da raiz
dotenv.config();

const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // YYYY-MM-DDTHH-MM-SS
const outputFolder = path.resolve(__dirname, 'monocart-report');
const uniqueJsonFile = path.join(outputFolder, `report-${timestamp}.json`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['monocart-reporter', {
      name: "Relatório de Testes do Portal RH",
      outputFile: './monocart-report/index.html',
      outputJSON: uniqueJsonFile,
    }],
    ['playwright-ctrf-json-reporter', {
      outputFile: 'tests-results.json',
      outputDir: 'playwright-report',
      minimal: false,
      screenshot: true
    }]
  ],

  use: {
    trace: 'on-first-retry',
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

});
