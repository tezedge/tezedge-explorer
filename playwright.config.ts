import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    baseURL: process.env.URL || 'http://localhost:4200/#',
    headless: false,
  },
};

export default config;
export const BASE_URL = config.use.baseURL;
