require('dotenv').config();

const config = {
  baseURL: process.env.BASE_URL || 'https://www.gov.uk',
  targetPage: '/calculate-your-holiday-entitlement',
  
  browser: {
    type: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    args: ['--start-maximized']
  },

  context: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  timeout: {
    navigation: 30000,
    action: 10000,
    assertion: 5000
  },

  testData: {
    invalidDateFormat: '32/13/2024',
    validDateFormat: 'dd/mm/yyyy'
  },

  environments: {
    dev: {
      baseURL: 'https://dev.gov.uk'
    },
    staging: {
      baseURL: 'https://staging.gov.uk'
    },
    production: {
      baseURL: 'https://www.gov.uk'
    }
  },

  logging: {
    enabled: process.env.LOGGING_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info'
  },

  screenshots: {
    enabled: true,
    path: './screenshots',
    onFailure: true
  },

  reports: {
    path: './reports',
    formats: ['json', 'html']
  }
};

module.exports = config;
