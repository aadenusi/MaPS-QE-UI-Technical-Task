# Playwright Cucumber Framework - Holiday Entitlement Calculator

This repository contains an end-to-end UI automation solution for the GOV.UK Holiday Entitlement Calculator using Playwright, Cucumber, and TypeScript.

## Overview

The suite validates holiday entitlement calculations for employees with:

- irregular/part-year work patterns
- regular work patterns

Target page:

https://www.gov.uk/calculate-your-holiday-entitlement

## Requirement Fit

This solution meets the Part 1 brief by providing:

- a working automated UI test suite for the required GOV.UK page
- implementation with the requested language/tooling stack
- clear build and execution instructions
- positive-path and validation-path coverage to demonstrate tester mindset

## Architecture and Trade-offs

### Why this structure

- tests/features: business-readable behavior
- tests/stepDefinitions: step-to-action bindings
- tests/pages: selector and page interaction logic
- tests/support: hooks for setup/teardown and evidence capture
- config/config.ts: centralized runtime configuration

This separation keeps scenarios readable while limiting UI-change impact to page objects.

### Key decisions

- Cucumber + Playwright for readable BDD and stable automation
- TypeScript for safer refactoring and maintainability
- Scenario outline with conditional question handling to avoid duplicated scenarios
- Env-driven screenshot behavior for flexible evidence strategy

### Trade-offs

- parallel: 0 for deterministic execution over speed
- straightforward selectors and waits for easier debugging
- minimal abstraction to stay interview-defensible

## Technology Stack

- Playwright
- Cucumber
- TypeScript
- ts-node
- dotenv

## Project Structure

```text
project-root/
├── .github/
│   └── workflows/
│       └── qa.yml
├── config/
│   └── config.ts
├── tests/
│   ├── features/
│   │   └── calculateHoliday.feature
│   ├── pages/
│   │   ├── BasePage.ts
│   │   └── CalculateHolidayPage.ts
│   ├── stepDefinitions/
│   │   └── holidayCalculatorSteps.ts
│   ├── support/
│   │   └── hooks.ts
│   └── types/
│       └── world.d.ts
├── cucumber.js
├── tsconfig.json
├── package.json
├── .env
├── reports/
├── screenshots/
└── README.md
```

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
cd "MaPS-QE UI Technical Task"
npm install
npx playwright install
```

## Environment Configuration

Current environment variables used by the framework:

```env
BASE_URL=https://www.gov.uk
TARGET_PAGE=/calculate-your-holiday-entitlement

BROWSER=chromium
HEADLESS=true
SLOW_MO=0

NAVIGATION_TIMEOUT=30000
ACTION_TIMEOUT=10000
ASSERTION_TIMEOUT=5000

SCREENSHOTS_ENABLED=true
SCREENSHOT_ON_FAILURE=true
SCREENSHOT_ON_PASS=false
SCREENSHOT_ONLY_LAST_RESULT=true
SCREENSHOT_PATH=./screenshots
```

## Running Tests

```bash
npm test                  # all scenarios
npm run test:smoke        # @smoke tagged scenarios only (fast confidence check)
npm run test:regression   # non-smoke scenarios only
npm run test:headed       # run with visible browser
npm run test:headless     # run headless
npm run test:report       # run and generate HTML + JSON reports
npm run test:debug        # headed with slow-mo for debugging
npm run test:chrome       # chromium
npm run test:firefox      # firefox
npm run test:webkit       # webkit
npm run typecheck         # TypeScript type check only
```

Suggested pre-submission check:

```bash
npm run typecheck && npm test
```

Run a specific feature:

```bash
npx cucumber-js tests/features/calculateHoliday.feature --parallel 0
```

## Current Coverage

Feature file:

- tests/features/calculateHoliday.feature

Current examples cover:

- irregular hours = Yes, days worked = 5, expected = 28
- irregular hours = Yes, days worked = 4, expected = 22.4
- irregular hours = Yes, days worked = 3, expected = 16.8
- irregular hours = No, days worked = 3, expected = 16.8
- irregular hours = No, days worked = 7, expected = 28 (upper-bound/cap check)

Validation coverage also includes invalid days worked per week:

- 0
- 8
- abc

Scenarios are split into two tagged groups:

- `@smoke` — one happy-path calculation and one validation check; run with `npm run test:smoke`
- untagged (Full regression) — remaining scenarios; run with `npm run test:regression`

Notes:

- BDD/Gherkin usage is optional in the brief and intentionally used here for readability.
- Tests run serially (`parallel: 0`) to prioritize determinism and easier debugging.

## Reports and Artifacts

After execution, artifacts may include:

- cucumber-report.html
- cucumber-report.json
- reports/
- screenshots/

## GitHub Workflow

The repository includes CI at .github/workflows/qa.yml.

Workflow behavior:

- triggers on push to main, PR to main, manual run, and nightly schedule
- runs npm ci
- installs Playwright browsers/dependencies
- runs npm run typecheck
- runs npm test
- uploads artifacts even if tests fail:
  - cucumber-report.html
  - cucumber-report.json
  - reports/
  - screenshots/

### How to Run in GitHub UI
1. Open the repository in GitHub.
2. Select the **Actions** tab.
3. In the left panel, select **QA Automation CI**.
4. Select **Run workflow**.
5. Choose the target branch.
6. Select **Run workflow** to start the job.
7. Open the workflow run to monitor status and view logs.
8. When complete, download artifacts from the **Artifacts** section (report files and screenshots).

Notes:

- The workflow also runs automatically on `push` to `main`, `pull_request` to `main`, and on the nightly schedule.
- If **Run workflow** is not visible, ensure the workflow file exists on the selected branch and that Actions are enabled for the repository.

## Troubleshooting

- No tests found: verify tests/features and cucumber.js paths
- Browser missing: run npx playwright install
- Type issues: run npm run typecheck
- Missing screenshots: validate screenshot env flags and output path

## Resources

- https://cucumber.io/docs/cucumber/
- https://playwright.dev/docs/intro
