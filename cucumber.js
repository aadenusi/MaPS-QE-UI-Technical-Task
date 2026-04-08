module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['ts-node/register/transpile-only'],
    require: ['tests/stepDefinitions/**/*.ts', 'tests/support/hooks.ts'],
    format: ['progress'],
    dryRun: false,
    failFast: false,
    parallel: 0,
    strict: true,
    timeout: 60000,
    worldParameters: {
      appUrl: 'https://www.gov.uk'
    }
  }
};
