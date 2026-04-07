import dotenv from 'dotenv';

dotenv.config();

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface AppConfig {
  baseURL: string;
  targetPage: string;
  browser: {
    type: BrowserType;
    headless: boolean;
    slowMo: number;
  };
  context: {
    viewport: {
      width: number;
      height: number;
    };
    ignoreHTTPSErrors: boolean;
  };
  timeout: {
    navigation: number;
    action: number;
    assertion: number;
  };
  screenshots: {
    enabled: boolean;
    path: string;
    onFailure: boolean;
    onPass: boolean;
    onlyLastResult: boolean;
  };
}

function getBrowserType(value: string | undefined): BrowserType {
  if (value === 'firefox' || value === 'webkit' || value === 'chromium') {
    return value;
  }
  return 'chromium';
}

function getNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const config: AppConfig = {
  baseURL: process.env.BASE_URL || 'https://www.gov.uk',
  targetPage: process.env.TARGET_PAGE || '/calculate-your-holiday-entitlement',

  browser: {
    type: getBrowserType(process.env.BROWSER),
    headless: process.env.HEADLESS !== 'false',
    slowMo: getNumber(process.env.SLOW_MO, 0)
  },

  context: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  },

  timeout: {
    navigation: getNumber(process.env.NAVIGATION_TIMEOUT, 30000),
    action: getNumber(process.env.ACTION_TIMEOUT, 10000),
    assertion: getNumber(process.env.ASSERTION_TIMEOUT, 5000)
  },

  screenshots: {
    enabled: process.env.SCREENSHOTS_ENABLED !== 'false',
    path: process.env.SCREENSHOT_PATH || './screenshots',
    onFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    onPass: process.env.SCREENSHOT_ON_PASS === 'true',
    onlyLastResult: process.env.SCREENSHOT_ONLY_LAST_RESULT === 'true'
  }
};

export default config;
