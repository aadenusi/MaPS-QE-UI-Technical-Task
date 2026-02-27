module.exports = {
  default: {
    require: ['step-definitions/**/*.js'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    dryRun: false,
    failFast: false,
    parallel: 1,
    strict: true,
    timeout: 60000,
    worldParameters: {
      appUrl: 'https://www.gov.uk'
    }
  },
  headless: {
    require: ['step-definitions/**/*.js'],
    format: [
      'progress',
      'json:reports/cucumber-report.json'
    ],
    parallel: 1,
    timeout: 60000
  },
  headed: {
    require: ['step-definitions/**/*.js'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html'
    ],
    parallel: 1,
    timeout: 60000,
    publishQuiet: true
  },
  smoke: {
    require: ['step-definitions/**/*.js'],
    tags: '@smoke',
    format: ['progress', 'json:reports/smoke-report.json'],
    timeout: 60000
  }
};
