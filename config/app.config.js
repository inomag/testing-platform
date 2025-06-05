const recruitmentAppConfig = require('../src/apps/recruitment/appConfig');
const copilotAppConfig = require('../src/apps/copilot/appConfig');
const vymoWebAppConfig = require('../src/apps/vymoWeb/appConfig');

const onboardingAppConfig = require('../src/apps/onboarding/appConfig');

const dashboardAppConfig = require('../src/apps/frontendBoard/appConfig');

const uiBuilderAppConfig = require('../src/apps/uiBuilder/appConfig');

const selfserveAppConfig = require('../src/apps/selfserve/appConfig');

const apps = [
  recruitmentAppConfig,
  copilotAppConfig,
  vymoWebAppConfig,
  onboardingAppConfig,
  dashboardAppConfig,
  uiBuilderAppConfig,
  selfserveAppConfig,
];

module.exports = {
  apps,
};
