const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the {string} start page', async function(pageName) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.navigateToCalculator();
  const pageTitle = await calculateHolidayPage.getPageTitle();
});


When('I start the holiday entitlement calculator', async function() {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.startCalculator();
});

When('I answer {string} to {string}', async function(answer, question) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.answerIrregularHours(answer);
  await calculateHolidayPage.clickContinue();
});

When('I enter {int} day {int} month and {int} year as the leave year start date', async function(day, month, year) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.enterLeaveYearStart(day, month, year);
});

When('I choose {string} as what the entitlement is based on', async function(option) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.selectOption(option);
});

When('I choose to work out holiday {string}', async function(option) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.selectOption(option);
});

When('I enter {string} days worked per week', async function(days) {
  const calculateHolidayPage = this.calculateHolidayPage;
  await calculateHolidayPage.enterDaysWorkedPerWeek(days);
  await calculateHolidayPage.clickContinue();
});

Then('the statutory holiday entitlement displayed is {string} days', async function(expectedDays) {
  console.log(`Then: Verifying entitlement is ${expectedDays} days`);
  
  const calculateHolidayPage = this.calculateHolidayPage;
  let resultText = '';
 
    await calculateHolidayPage.page.waitForTimeout(1000);
    resultText = await calculateHolidayPage.getEntitlementDays();

    const extractedValue = calculateHolidayPage.extractEntitlementValue(resultText);
    const expectedValue = parseFloat(expectedDays);
    
    expect(extractedValue).toBe(expectedValue);   
  
});
