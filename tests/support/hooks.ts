import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, BrowserType, Page, chromium, firefox, webkit } from 'playwright';
import config from '../../config/config';
import CalculateHolidayPage from '../pages/CalculateHolidayPage';

setDefaultTimeout(60000);

let browser: Browser | null;
let context: BrowserContext | null;
let page: Page | null;
let calculateHolidayPage: CalculateHolidayPage | null;

function getBrowserType(): BrowserType {
  switch (config.browser.type.toLowerCase()) {
    case 'firefox': return firefox;
    case 'webkit': return webkit;
    default: return chromium;
  }
}

Before(async function () {
  console.log(`\n=== Starting New Test ===`);
  console.log(`Browser: ${config.browser.type}, Headless: ${config.browser.headless}`);

  browser = await getBrowserType().launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo
  });

  context = await browser.newContext(config.context);
  page = await context.newPage();

  calculateHolidayPage = new CalculateHolidayPage(page);
  this.page = page;
  this.calculateHolidayPage = calculateHolidayPage;

  console.log('Browser initialized successfully');
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && page && !page.isClosed() && calculateHolidayPage) {
    try {
      await calculateHolidayPage.takeScreenshot(`failure-${Date.now()}`);
    } catch {
      // screenshot failure should not break teardown
    }
  }

  await page?.close();
  await context?.close();
  await browser?.close();

  page = null;
  context = null;
  browser = null;
  calculateHolidayPage = null;

  console.log('=== Test Completed ===\n');
});
