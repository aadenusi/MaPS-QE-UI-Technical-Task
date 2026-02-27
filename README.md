# Playwright Cucumber Framework - Holiday Entitlement Calculator

A comprehensive end-to-end testing framework built with **Playwright** and **Cucumber** (BDD) for automating tests on the UK Government's Holiday Entitlement Calculator. The framework uses the **Page Object Model** (POM) architecture for maintainability and scalability.

## Overview

This framework automates the testing of holiday entitlement calculations for employees with irregular working hours. It implements the Behavior-Driven Development (BDD) approach using Cucumber feature files to create readable, stakeholder-friendly test scenarios.

**Target Page:** `https://www.gov.uk/calculate-your-holiday-entitlement`

## Project Structure

```
project-root/
├── features/
│   └── calculateHolidayEntitlement.feature    # Gherkin scenarios
├── step-definitions/
│   └── holidayCalculatorSteps.js              # Step implementations
├── pages/
│   ├── BasePage.js                            # Base page class (common methods)
│   └── CalculateHolidayPage.js               # Holiday calculator page object
├── config/
│   └── config.js                              # Configuration management
├── cucumber.js                                # Cucumber configuration
├── package.json                               # Dependencies and scripts
├── .env                                       # Environment variables
├── .gitignore                                 # Git ignore rules
└── README.md                                  # This file
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git** (optional, for version control)

## Installation

1. **Clone or extract the project:**
   ```bash
   cd "Solirius QE UI Technical Task"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This installs:
   - `@cucumber/cucumber` - BDD framework
   - `@playwright/test` - Playwright test utilities
   - `playwright` - Browser automation
   - `dotenv` - Environment variable management

## Configuration

### Environment Variables (.env)

The `.env` file contains configurable settings:

```env
BASE_URL=https://www.gov.uk
TARGET_PAGE=/calculate-your-holiday-entitlement
BROWSER=chromium
HEADLESS=true
LOGGING_ENABLED=true
```

**Available Options:**
- `BASE_URL` - Base URL for the application
- `BROWSER` - Browser type: `chromium`, `firefox`, `webkit`
- `HEADLESS` - Run tests in headless mode: `true` or `false`
- `SLOW_MO` - Slow down actions (milliseconds)
- `LOGGING_ENABLED` - Enable logging output

### Config File (config/config.js)

The configuration module provides:
- Browser settings
- Navigation timeouts
- Assertion timeouts
- Screenshot capture settings
- Report output paths

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (visible browser)
```bash
HEADLESS=false npm test
```

### Run Tests with Reporting
```bash
npm run test:report
```

### Run with Specific Browser
```bash
BROWSER=firefox npm test
```

### Run Specific Feature
```bash
npm test features/calculateHolidayEntitlement.feature
```

## Test Scenarios

### Scenario: Calculate Holiday Entitlement for Irregular Hours

The framework tests three scenarios with different weekly working hours:

| Scenario | Days Worked/Week | Expected Entitlement |
|----------|-----------------|----------------------|
| 1        | 5               | 28 days              |
| 2        | 4               | 22.4 days            |
| 3        | 3               | 16.8 days            |

**Common Test Data:**
- Leave Year Start Date: `20/01/1998`
- Entitlements Based On: `days worked per week`
- Holiday Calculation: `for a full leave year`
- Irregular Hours: `Yes`

## Architecture

### Page Object Model (POM)

The framework implements POM to separate test logic from page interactions:

#### **BasePage.js**
Base class providing common functionality:
- `navigate()` - Navigate to a page
- `click()` - Click an element
- `fillText()` - Enter text in input
- `getText()` - Get element text
- `waitForElement()` - Wait for element presence
- `takeScreenshot()` - Capture screenshots
- `selectDropdownOption()` - Select dropdown values

#### **CalculateHolidayPage.js**
Extends BasePage with calculator-specific methods:
- `navigateToCalculator()` - Navigate to calculator
- `startCalculator()` - Start the calculator
- `answerIrregularHours()` - Answer irregular hours question
- `enterLeaveStartDate()` - Enter date
- `selectEntitlementsBasedOn()` - Select entitlement option
- `selectHolidayCalculation()` - Select calculation period
- `enterDaysWorkedPerWeek()` - Enter days worked
- `getEntitlementDays()` - Retrieve calculated entitlement
- `verifyEntitlement()` - Verify expected entitlement

### Step Definitions

Steps are implemented in `step-definitions/holidayCalculatorSteps.js`:

- **Given Steps:** Setup and navigation
- **When Steps:** User interactions
- **Then Steps:** Assertions and verification

### Hooks

- **Before:** Initialize browser, context, and page
- **After:** Clean up resources and capture screenshots on failure

## Features

- Page Object Model - Organized, maintainable code structure
- BDD with Cucumber - Readable, business-friendly scenarios
- Playwright - Fast, reliable browser automation
- Configuration Management - Centralized settings
- Error Handling - Comprehensive error management
- Logging - Detailed console output for debugging
- Screenshots - Automatic capture on test failure
- Test Reports - HTML and JSON report generation
- Timeout Management - Configurable timeouts
- CI/CD Ready - Designed for integration pipelines

## Example Test Output

```
Scenario: Calculate holiday entitlement for an employee with irregular hours

✓ Given I am on the "Calculate your holiday entitlement" start page
✓ When I start the holiday entitlement calculator
✓ And I answer "Yes" to "Does the employee work irregular hours or for part of the year?"
✓ And I enter "20/01/1998" as the leave year start date
✓ And I choose "days worked per week" as what the entitlement is based on
✓ And I choose to work out holiday "for a full leave year"
✓ And I enter "5" days worked per week
✓ Then the statutory holiday entitlement displayed is "28" days

3 scenarios (3 passed)
21 steps (21 passed)
```

## Debugging

### Enable Detailed Logging
```bash
LOGGING_ENABLED=true npm test
```

### Run in Headed Mode
```bash
HEADLESS=false npm test
```

### Slow Down Execution
```bash
SLOW_MO=1000 npm test
```

### View Screenshots
Screenshots are saved to `./screenshots/` directory when tests fail.

## Reports

After running tests:
- **HTML Report:** `cucumber-report.html` (opens in browser)
- **JSON Report:** `cucumber-report.json` (for CI/CD integration)

## CI/CD Integration

The framework is ready for CI/CD pipelines:

```bash
# Install dependencies
npm install

# Run tests in headless mode
npm test

# Reports are generated automatically
```

## Contributing

To extend the framework:

1. **Add new scenarios** to `.feature` files
2. **Create page objects** for new pages extending `BasePage.js`
3. **Implement step definitions** in `step-definitions/`
4. **Update configuration** as needed in `config/config.js`

## Resources

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Page Object Model Guide](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

## Troubleshooting

### Tests Not Running
- Ensure Node.js and npm are installed
- Run `npm install` to install dependencies
- Check that feature files are in `features/` directory

### Bonus Task Accessibility Test

Description:
When navigating the page using the keyboard (Tab key), the focus correctly moves through the form fields (Full name - Email - Your message), but when it reaches the “Done” button, the button does not display any visible focus indicator.

Expected Behavior:
Interactive elements especially buttons must show a clear, visible focus state when selected via keyboard,
This ensures keyboard-only users can understand which element is currently active.

Actual Behavior:
The “Done” button appears visually unchanged while focused. There is no outline, highlight, shadow, or any other visual cue to indicate focus.

Impact:
. Keyboard-only users may lose track of their position on the page.
. Users with motor disabilities or relying on assistive technologies may be unable to submit the form.
. Fails accessibility requirements for perceivable and operable UI.

Steps to Reproduce:
1. Open the page.
2. Press Tab repeatedly to move through the form fields.
3. Stop when the focus reaches the “Done” button.
4. Observe that the button does not show any visible focus style.

Severity:
High - Blocks keyboard accessibility and violates WCAG compliance.

List Of Bugs
The <html> element is missing a lang attribute, which can affect how a screen reader interprets and pronounces the page content.
2. The document is missing a <title> element, meaning screen readers have no page title to announce when the page first loads.
3. <img> elements do not contain alternative text, preventing screen readers from conveying the meaning or purpose of the images.
4. Keyboard users cannot navigate to the “Image” button using the Tab key, making it inaccessible without a mouse.
5. The robot image is incorrectly identified as a generic document rather than an image, and it also lacks an appropriate accessible description.
6. The screen reader reads the “Done” button text multiple times, causing redundancy and confusion for assistive technology users.
7. The document lacks a main landmark (<main> region), making it harder for screen reader users to understand the structure of the page or navigate efficiently.
