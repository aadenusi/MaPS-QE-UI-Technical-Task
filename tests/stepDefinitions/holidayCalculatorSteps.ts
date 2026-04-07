import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type CalculateHolidayPage from '../pages/CalculateHolidayPage';

type StepWorld = {
  page: Page;
  calculateHolidayPage: CalculateHolidayPage;
};

Given('I am on the {string} start page', async function (this: StepWorld, _pageName: string) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.navigateToCalculator();
  await calculateHolidayPage.getPageTitle();
});

When('I start the holiday entitlement calculator', async function (this: StepWorld) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.startCalculator();
});

When('I answer {string} to {string}', async function (this: StepWorld, answer: string, _question: string) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.answerIrregularHours(answer);
  await calculateHolidayPage.clickContinue();
});

When(
  'I enter {int} day {int} month and {int} year as the leave year start date if asked',
  async function (this: StepWorld, day: number, month: number, year: number) {
    const calculateHolidayPage = this.calculateHolidayPage;
    await calculateHolidayPage.enterLeaveYearStart(day, month, year);
  }
);

When('I choose {string} as what the entitlement is based on', async function (this: StepWorld, option: string) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.chooseEntitlementBasis(option);
});

When('I choose to work out holiday {string}', async function (this: StepWorld, option: string) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.chooseHolidayCalculation(option);
});

When('I enter {string} days worked per week', async function (this: StepWorld, days: string) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.submitDaysWorkedPerWeek(days);
});

Then('the statutory holiday entitlement displayed is {string} days', async function (this: StepWorld, expectedDays: string) {
  console.log(`Then: Verifying entitlement is ${expectedDays} days`);

  const calculateHolidayPage = this.calculateHolidayPage;

  const resultText = await calculateHolidayPage.getEntitlementDays();

  const extractedValue = calculateHolidayPage.extractEntitlementValue(resultText);
  const expectedValue = parseFloat(expectedDays);

  expect(extractedValue).toBe(expectedValue);
});

Then('I should see a validation error for days worked per week', async function (this: StepWorld) {
  const calculateHolidayPage = this.calculateHolidayPage;
  const hasValidationError = await calculateHolidayPage.hasDaysWorkedValidationError();
  expect(hasValidationError).toBeTruthy();
});
