const BasePage = require('./BasePage');
const config = require('../config/config');

class CalculateHolidayPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      startButton: 'a.govuk-button--start',
      continueButton: '#current-question .gem-c-button--bottom-margin',
      irregularHoursYesRadio: '.govuk-radios #response-0',
      irregularHoursNoRadio: '.govuk-radios #response-1',
      leaveStartDayInput: '.govuk-date-input #response-0',
      leaveStartMonthInput: '.govuk-date-input #response-1',
      leaveStartYearInput: '.govuk-date-input #response-2',
      entitlementsBasedOnSelect: '.govuk-fieldset .govuk-radios',
      daysWorkedInput: '.govuk-form-group .govuk-input',
      resultSelectors: [
        '.govuk-panel__body',
        '.govuk-panel__title',
        'main h1',
        'main .govuk-body-l',
        'main p.govuk-body-l'
      ],
      mainContent: 'main'
    };
  }

  async dismissCookieBanner() {
    try {
      const rejectButton = this.page.locator('button:has-text("Reject"), button:has-text("Hide")').first();
      if (await rejectButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await rejectButton.click();
        await this.page.waitForTimeout(500);
        return;
      }
    } catch (error) {
      // skip if not found
    }
  }
  
  async navigateToCalculator() {
    await this.navigate(config.targetPage);
    await this.waitForNavigation();
    await this.dismissCookieBanner();
  }

  async startCalculator() {
    await this.click(this.selectors.startButton);
    await this.waitForNavigation();
  }

  async answerIrregularHours(answer) {
    const answerMap = {
      'yes': this.selectors.irregularHoursYesRadio,
      'no': this.selectors.irregularHoursNoRadio
    };
    
    const selector = answerMap[answer.toLowerCase()];
    await this.page.locator(selector).check();
    await this.page.waitForTimeout(500);
    
    const isChecked = await this.page.locator(selector).isChecked();
    if (!isChecked) {
      throw new Error(`Failed to check radio button: ${selector}`);
    }
  }

  async enterLeaveYearStart(leaveDay, leaveMonth, leaveYear) {
    const dayInput = this.page.getByLabel(/^Day$/).first();
    const monthInput = this.page.getByLabel(/^Month$/).first();
    const yearInput = this.page.getByLabel(/^Year$/).first();

    if (!(await dayInput.isVisible().catch(() => false))) {
      throw new Error('Leave year day/month/year inputs are not visible on the current page');
    }

    await dayInput.fill(String(leaveDay));
    await monthInput.fill(String(leaveMonth));
    await yearInput.fill(String(leaveYear));
    await this.page.waitForTimeout(500);
    await this.clickContinue();
  }

  async selectOption(option) {
    await this.selectRadioByLabel(option, 'response');
    await this.page.waitForTimeout(500);
    await this.clickContinue();
  }

  async enterDaysWorkedPerWeek(days) {
    await this.fillText(this.selectors.daysWorkedInput, days.toString());
    await this.page.waitForTimeout(500);
  }

  async clickContinue() {
    const continueBtn = this.page.locator(this.selectors.continueButton).first();
    await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtn.click();
    await this.waitForNavigation();
  }

  // Assertion/Verification Methods
  
  async getEntitlementDays() {
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Try each selector in priority order
    for (const selector of this.selectors.resultSelectors) {
      const element = await this.page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        const text = await element.textContent();
        if (text && text.match(/\d+/)) {
          return text;
        }
      }
    }
    
    const mainText = await this.page.locator(this.selectors.mainContent).first().textContent();
    return mainText;
  }

  extractEntitlementValue(resultText) {
    const match = resultText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  async getCurrentPageUrl() {
    return this.page.url();
  }

  async getCurrentPageTitle() {
    return this.page.title();
  }
}

module.exports = CalculateHolidayPage;
