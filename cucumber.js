module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register/transpile-only'],
    require: ['tests/stepDefinitions/**/*.ts', 'tests/support/hooks.ts'],
    format: [
      'progress',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    dryRun: false,
    failFast: false,
    parallel: 0,
    strict: true,
    timeout: 60000,
    worldParameters: {
      appUrl: 'https://www.gov.uk'
    }
  },
  headless: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register/transpile-only'],
    require: ['tests/stepDefinitions/**/*.ts', 'tests/support/hooks.ts'],
    format: [
      'progress',
      'json:reports/cucumber-report.json'
    ],
    parallel: 0,
    timeout: 60000
  },
  headed: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register/transpile-only'],
    require: ['tests/stepDefinitions/**/*.ts', 'tests/support/hooks.ts'],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    parallel: 0,
    timeout: 60000,
    publishQuiet: true
  },
  smoke: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register/transpile-only'],
    require: ['tests/stepDefinitions/**/*.ts', 'tests/support/hooks.ts'],
    tags: '@smoke',
    format: ['progress', 'json:reports/smoke-report.json'],
    timeout: 60000
  }
};
