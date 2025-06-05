// this script should run before build step
// will remove homePage from package.json and modifies it based on the APP_ENV environment variable.

const fs = require('fs');

const { APP_ENV } = process.env;

const PACKAGE_JSON_PATH = 'package.json';
let VYMO_WEB_PLATFORM_PATH;

switch (APP_ENV) {
  case 'production':
    VYMO_WEB_PLATFORM_PATH = `/web-platform`;
    break;

  case 'preProd':
    VYMO_WEB_PLATFORM_PATH = `/web-platform`;
    break;

  case 'staging':
    // use staging url with suffix /web-platform
    // needed to have route different from feature branch pointed to staging
    VYMO_WEB_PLATFORM_PATH = `/web-platform`;
    break;

  case 'pod':
    // used by feature branches in CI/CD for pod releases
    VYMO_WEB_PLATFORM_PATH = `/web-platform/branch/${process.env.BITBUCKET_BRANCH}`;
    break;

  default:
    // use url with suffix /build for local dev
    // as build folder has all the files
    VYMO_WEB_PLATFORM_PATH = '';
}

const packageJsonData = fs.readFileSync(PACKAGE_JSON_PATH);
const packageJson = JSON.parse(packageJsonData);
packageJson.homepage = VYMO_WEB_PLATFORM_PATH;

fs.writeFileSync('package.json', JSON.stringify(packageJson));
