const { expect } = require('@playwright/test');
const config = require('../config/config');

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseURL = config.baseURL;
    this.navigationTimeout = config.timeout.navigation;
    this.actionTimeout = config.timeout.action;
  }

  async navigate(path = '') {
    const fullURL = `${this.baseURL}${path}`;
    console.log(`Navigating to: ${fullURL}`);
    await this.page.goto(fullURL, { waitUntil: 'networkidle' });
  }

  async click(selector) {
    console.log(`Clicking element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    await this.page.click(selector);
  }

  async fillText(selector, text) {
    console.log(`Filling text in ${selector}: ${text}`);
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    return await this.page.textContent(selector);
  }

  async selectDropdownOption(selector, value) {
    await this.page.selectOption(selector, { label: value });
  }

  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: config.timeout.assertion });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(selector, timeout = this.actionTimeout) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async takeScreenshot(filename) {
    if (config.screenshots.enabled) {
      await this.page.screenshot({
        path: `${config.screenshots.path}/${filename}.png`
      });
    }
  }

  async switchToFrame(selector) {
    const frameLocator = this.page.locator(selector);
    return frameLocator;
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  async pressKey(key) {
    await this.page.press('body', key);
  }

  async getAttribute(selector, attribute) {
    await this.page.waitForSelector(selector, { timeout: this.actionTimeout });
    return await this.page.getAttribute(selector, attribute);
  }

  getAllRadioOptions = async (name = null) => {
    try {
      await this.page.waitForSelector('.govuk-radios', { timeout: this.actionTimeout });
      
      const radioContainer = this.page.locator('.govuk-radios').first();
      const radioItems = radioContainer.locator('.govuk-radios__item, .gem-c-radio');
      const itemCount = await radioItems.count();
      
      const options = await Promise.all(
        Array.from({ length: itemCount }, async (_, i) => {
          const item = radioItems.nth(i);
          
          // Get the input element using arrow function
          const input = item.locator('input[type="radio"]').first();
          const id = await input.getAttribute('id').catch(() => '');
          const value = await input.getAttribute('value').catch(() => '');
          
          const label = item.locator('label').first();
          const labelText = await label.textContent().catch(() => '');
          
          return labelText ? {
            label: labelText.trim(),
            value: value || '',
            id: id || ''
          } : null;
        })
      ).then(opts => opts.filter(opt => opt !== null));
      
      return options;
    } catch (error) {
      throw error;
    }
  }

  selectRadioByLabel = async (labelText, nameAttribute = null) => {
    const options = await this.getAllRadioOptions(nameAttribute);
    
    if (!options.length) throw new Error('No radio options found in govuk-radios container');
    
    const lowerText = labelText.toLowerCase();
    const matchingOption = options.find(opt => opt.label.toLowerCase() === lowerText) || 
                          options.find(opt => opt.label.toLowerCase().includes(lowerText) || lowerText.includes(opt.label.toLowerCase()));
    
    if (!matchingOption) {
      throw new Error(`Radio option "${labelText}" not found. Available: ${options.map(o => `"${o.label}"`).join(', ')}`);
    }
    
    const selector = matchingOption.id ? `#${matchingOption.id}` : `.govuk-radios label:has-text("${matchingOption.label}")`;
    await this.page.locator(selector).first().click();
    await this.page.waitForTimeout(500);
    
    return true;
  }
}

module.exports = BasePage;
