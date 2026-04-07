import { Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import config from '../../config/config';

type RadioOption = {
  label: string;
  value: string;
  id: string;
};

class BasePage {
  page: Page;
  baseURL: string;
  navigationTimeout: number;
  actionTimeout: number;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = config.baseURL;
    this.navigationTimeout = config.timeout.navigation;
    this.actionTimeout = config.timeout.action;
  }

  async navigate(path = ''): Promise<void> {
    const fullURL = `${this.baseURL}${path}`;
    console.log(`Navigating to: ${fullURL}`);
    await this.page.goto(fullURL, { waitUntil: 'networkidle', timeout: this.navigationTimeout });
  }

  async click(selector: string): Promise<void> {
    console.log(`Clicking element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    await this.page.click(selector);
  }

  async fillText(selector: string, text: string): Promise<void> {
    console.log(`Filling text in ${selector}: ${text}`);
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string | null> {
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    return this.page.textContent(selector);
  }

  async selectDropdownOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, { label: value });
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: config.timeout.assertion });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(selector: string, timeout = this.actionTimeout): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(filename: string): Promise<void> {
    if (config.screenshots.enabled) {
      await mkdir(config.screenshots.path, { recursive: true });
      await this.page.screenshot({
        path: `${config.screenshots.path}/${filename}.png`
      });
    }
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async pressKey(key: string): Promise<void> {
    await this.page.press('body', key);
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    return this.page.getAttribute(selector, attribute);
  }

  async getAllRadioOptions(): Promise<RadioOption[]> {
    await this.page.waitForSelector('.govuk-radios', { timeout: this.actionTimeout });

    const radioContainer = this.page.locator('.govuk-radios').first();
    const radioItems = radioContainer.locator('.govuk-radios__item, .gem-c-radio');
    const itemCount = await radioItems.count();

    const options = await Promise.all(
      Array.from({ length: itemCount }, async (_, i) => {
        const item = radioItems.nth(i);

        const input = item.locator('input[type="radio"]').first();
        const id = (await input.getAttribute('id').catch(() => '')) || '';
        const value = (await input.getAttribute('value').catch(() => '')) || '';

        const label = item.locator('label').first();
        const labelText = await label.textContent().catch(() => '');

        if (!labelText) {
          return null;
        }

        return {
          label: labelText.trim(),
          value,
          id
        };
      })
    );

    return options.filter((opt): opt is RadioOption => opt !== null);
  }

  async selectRadioByLabel(labelText: string): Promise<boolean> {
    const options = await this.getAllRadioOptions();

    if (!options.length) {
      throw new Error('No radio options found in govuk-radios container');
    }

    const lowerText = labelText.toLowerCase();
    const matchingOption =
      options.find((opt) => opt.label.toLowerCase() === lowerText) ||
      options.find(
        (opt) =>
          opt.label.toLowerCase().includes(lowerText) || lowerText.includes(opt.label.toLowerCase())
      );

    if (!matchingOption) {
      throw new Error(
        `Radio option "${labelText}" not found. Available: ${options
          .map((o) => `"${o.label}"`)
          .join(', ')}`
      );
    }

    const selector = matchingOption.id
      ? `#${matchingOption.id}`
      : `.govuk-radios label:has-text("${matchingOption.label}")`;

    await this.page.locator(selector).first().click();
    await this.page.waitForTimeout(500);

    return true;
  }
}

export default BasePage;
