const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
const config = require('../config/config');
const CalculateHolidayPage = require('../pages/CalculateHolidayPage');

// Set timeout to 60 seconds for all steps
setDefaultTimeout(60000);

let browser;
let context;
let page;
let calculateHolidayPage;

function getBrowserType() {
  const browserType = config.browser.type.toLowerCase();
  
  switch(browserType) {
    case 'firefox':
      return firefox;
    case 'webkit':
      return webkit;
    case 'chromium':
    default:
      return chromium;
  }
}

Before(async function() {
  console.log('\n=== Starting New Test ===');
  console.log(`Browser: ${config.browser.type}, Headless: ${config.browser.headless}`);
  
  try {
    const browserType = getBrowserType();
    browser = await browserType.launch({
      headless: config.browser.headless,
      slowMo: config.browser.slowMo
    });
    
    context = await browser.newContext(config.context);
    page = await context.newPage();
    await page.setViewportSize(config.context.viewport);
    
    calculateHolidayPage = new CalculateHolidayPage(page);
    this.page = page;
    this.calculateHolidayPage = calculateHolidayPage;
    console.log('Browser initialized successfully');
  } catch (error) {
    console.error('ERROR in Before hook:', error.message);
    throw error;
  }
});

After(async function(scenario) {
  if (scenario.result.status === 'FAILED') {
    try {
      if (calculateHolidayPage && calculateHolidayPage.takeScreenshot) {
        await calculateHolidayPage.takeScreenshot(`failure-${Date.now()}`);
      }
    } catch (error) {
      console.error('Error taking screenshot:', error.message);
    }
  }
  
  try {
    if (page) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
  console.log('=== Test Completed ===\n');
});
