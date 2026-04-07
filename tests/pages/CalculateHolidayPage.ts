import { Page } from '@playwright/test';
import BasePage from './BasePage';
import config from '../../config/config';

type Selectors = {
  startButton: string;
  continueButton: string;
  irregularHoursYesRadio: string;
  irregularHoursNoRadio: string;
  daysWorkedInput: string;
  errorSummary: string;
  errorMessage: string;
  resultSelectors: string[];
  mainContent: string;
};

class CalculateHolidayPage extends BasePage {
  selectors: Selectors;

  constructor(page: Page) {
    super(page);

    this.selectors = {
      startButton: 'a.govuk-button--start',
      continueButton: '#current-question .gem-c-button--bottom-margin',
      irregularHoursYesRadio: '.govuk-radios #response-0',
      irregularHoursNoRadio: '.govuk-radios #response-1',
      daysWorkedInput: '.govuk-form-group .govuk-input',
      errorSummary: '#error-summary',
      errorMessage: '.govuk-error-message',
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

  async dismissCookieBanner(): Promise<void> {
    try {
      const rejectButton = this.page
        .locator('button:has-text("Reject"), button:has-text("Hide")')
        .first();
      if (await rejectButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await rejectButton.click();
        await rejectButton.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch {
      // skip if not found
    }
  }

  async navigateToCalculator(): Promise<void> {
    await this.navigate(config.targetPage);
    await this.waitForNavigation();
    await this.dismissCookieBanner();
  }

  async startCalculator(): Promise<void> {
    await this.click(this.selectors.startButton);
    await this.waitForNavigation();
  }

  async answerIrregularHours(answer: string): Promise<void> {
    const answerMap: Record<string, string> = {
      yes: this.selectors.irregularHoursYesRadio,
      no: this.selectors.irregularHoursNoRadio
    };

    const selector = answerMap[answer.toLowerCase()];
    if (!selector) {
      throw new Error(`Unsupported answer: ${answer}`);
    }

    await this.page.locator(selector).check();

    const isChecked = await this.page.locator(selector).isChecked();
    if (!isChecked) {
      throw new Error(`Failed to check radio button: ${selector}`);
    }
  }

  async enterLeaveYearStart(leaveDay: number, leaveMonth: number, leaveYear: number): Promise<boolean> {
    const dayInput = this.page.getByLabel(/^Day$/).first();
    const monthInput = this.page.getByLabel(/^Month$/).first();
    const yearInput = this.page.getByLabel(/^Year$/).first();

    if (!(await dayInput.isVisible().catch(() => false))) {
      return false;
    }

    await dayInput.fill(String(leaveDay));
    await monthInput.fill(String(leaveMonth));
    await yearInput.fill(String(leaveYear));
    await this.clickContinue();
    return true;
  }

  private async selectCurrentQuestionOption(option: string): Promise<void> {
    await this.selectRadioByLabel(option);
    await this.clickContinue();
  }

  async chooseEntitlementBasis(option: string): Promise<void> {
    await this.selectCurrentQuestionOption(option);
  }

  async chooseHolidayCalculation(option: string): Promise<void> {
    await this.selectCurrentQuestionOption(option);
  }

  async enterDaysWorkedPerWeek(days: string): Promise<void> {
    await this.fillText(this.selectors.daysWorkedInput, days.toString());
  }

  async submitDaysWorkedPerWeek(days: string): Promise<void> {
    await this.enterDaysWorkedPerWeek(days);
    await this.clickContinue();
  }

  async hasDaysWorkedValidationError(): Promise<boolean> {
    const summaryText = await this.page.locator(this.selectors.errorSummary).first().textContent().catch(() => '');
    const inlineText = await this.page.locator(this.selectors.errorMessage).first().textContent().catch(() => '');
    const combinedText = `${summaryText} ${inlineText}`.toLowerCase();

    return /(problem|enter|number|day|between|required)/.test(combinedText);
  }

  async clickContinue(): Promise<void> {
    const continueBtn = this.page.locator(this.selectors.continueButton).first();
    await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtn.click();
    await this.waitForNavigation();
  }

  async getEntitlementDays(): Promise<string | null> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

    for (const selector of this.selectors.resultSelectors) {
      const element = this.page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        const text = await element.textContent();
        if (text?.match(/\d+/)) return text;
      }
    }

    return this.page.locator(this.selectors.mainContent).first().textContent();
  }

  extractEntitlementValue(resultText: string | null): number | null {
    if (!resultText) return null;

    const text = resultText.replace(/\s+/g, ' ').trim();
    const explicit = text.match(/holiday entitlement\D*(\d+(?:\.\d+)?)/i);
    if (explicit) return parseFloat(explicit[1]);

    const lastNumber = text.match(/(\d+(?:\.\d+)?)\D*$/);
    return lastNumber ? parseFloat(lastNumber[1]) : null;
  }

  async getCurrentPageUrl(): Promise<string> {
    return this.page.url();
  }

  async getCurrentPageTitle(): Promise<string> {
    return this.page.title();
  }
}

export default CalculateHolidayPage;
