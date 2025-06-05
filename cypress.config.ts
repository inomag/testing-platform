import { defineConfig } from 'cypress';
import { cloudPlugin } from 'cypress-cloud/plugin';

process.env.FAST_REFRESH = 'true';
// @ts-ignore
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

const webpackConfig = require('./config/webpack.config');

export default defineConfig({
  numTestsKeptInMemory: 1,
  component: {
    projectId: process.env.CYPRESS_DASHBOARD_KEY,
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: webpackConfig('development', {
        allApps: true,
        apps: [],
      }),
    },
    specPattern: 'src/**/integration/**/*.spec.**',
    supportFile: 'cypress/modules/support/commands.ts',
    indexHtmlFile: 'cypress/modules/index.html',
    defaultCommandTimeout: 10000,
    responseTimeout: 60000,
    video: false,
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      require('@cypress/code-coverage/task')(on, config);
      on('before:browser:launch', (browser, launchOptions) => {
        if (['chrome', 'edge'].includes(browser.name)) {
          if (browser.isHeadless) {
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-gl-drawing-for-tests');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--memory-pressure-thresholds=low');
          }
          launchOptions.args.push('--js-flags=--max-old-space-size=7500');
        }
        return launchOptions;
      });
      return cloudPlugin(on, config);
    },
  },
  e2e: {
    projectId: process.env.CYPRESS_E2E_DASHBOARD_KEY,
    baseUrl: 'https://staging.lms.getvymo.com',
    specPattern: 'cypress/e2e/integration/**/*.spec.**',
    supportFile: 'cypress/e2e/support/commands.ts',
    defaultCommandTimeout: 60000,
    responseTimeout: 40000,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (['chrome', 'edge'].includes(browser.name)) {
          if (browser.isHeadless) {
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-gl-drawing-for-tests');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--memory-pressure-thresholds=low');
          }
          launchOptions.args.push('--js-flags=--max-old-space-size=7500');
        }
        return launchOptions;
      });
      return cloudPlugin(on, config);
    },
  },
  env: {
    TEST_ENV: process.env.TEST_ENV || 'localhost',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  retries: { openMode: null, runMode: 2 },
  chromeWebSecurity: false,
});
