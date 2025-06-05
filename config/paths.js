/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const chalk = require('chalk');
const { apps } = require('./app.config');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.

let homepage;

if (process.env.NODE_ENV === 'production') {
  if (process.env.APP_ENV) {
    // eslint-disable-next-line global-require
    homepage = require(resolveApp('package.json')).homepage;
  } else {
    homepage = '/build';
  }
} else {
  // eslint-disable-next-line global-require
  homepage = require(resolveApp('package.json')).homepage;
}

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  homepage,
  process.env.PUBLIC_URL,
);

const buildPath = process.env.BUILD_PATH || 'build';

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  // eslint-disable-next-line no-shadow
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// Resolve appPages (aka entry points)
// checks if there is at least one entry point specified
let appPages;
if (apps === undefined || apps === null || apps.length === 0) {
  chalk.red(
    'No apps exist. Please check there should be at least one app define with appConfig.js inside src/apps folder',
  );
  process.exit(1);
} else {
  appPages = apps.map((appConfig) =>
    // maps each element by resolving the right path
    ({
      ...appConfig,
      appHtml: resolveApp(appConfig.appHtml),
      appIndexJs: resolveModule(resolveApp, appConfig.appIndexJs),
    }),
  );
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp('public'),
  appPages,
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
