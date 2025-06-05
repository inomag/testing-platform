const { execSync } = require('child_process');
const _ = require('lodash');
const { apps } = require('../../config/app.config');

const isDebug = process.argv.includes('--debug');

const { BITBUCKET_BRANCH, BITBUCKET_COMMIT } = process.env;

const getAppNameFromIndexPath = (appsAffected) =>
  appsAffected.map(
    (appIndexPath) =>
      apps.find(
        ({ appIndexJs }) =>
          appIndexPath.indexOf(`${appIndexJs.split('/index')[0]}`) > -1,
      )?.name,
  );

// List of files to analyze
const getChangedFiles = () =>
  _.uniq(
    execSync(
      BITBUCKET_BRANCH === 'master'
        ? `git show --name-only --pretty=format:"" ${
            BITBUCKET_COMMIT || 'origin/master'
          }`
        : `git diff --name-only --diff-filter=d origin/master && git log  --name-only --pretty=format:"" origin/${
            BITBUCKET_BRANCH || 'master'
          }^.. `,
      // below command will check for files from where branch is cut from origin/master
      // git log --name-only --pretty=format:"" --reverse origin/master.. && git diff --name-only
    )
      .toString()
      .split('\n')
      .filter((file) => file),
  );

// Function to extract added or modified keys from the git diff output for package.json
// this is needed as many major deps change in package.json should be analyzed with apps affected
const getNodeModulesModified = () => {
  // Run the git diff command and capture the output
  const diffOutput = execSync(
    'git diff --unified=0 origin/master^.. -- package.json',
    { encoding: 'utf-8' },
  );

  const lines = diffOutput.split('\n');
  const keys = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const line of lines) {
    if (line.startsWith('+') && line.includes(':')) {
      const key = line
        .split(':')[0]
        .trim()
        .substring(1)
        .replace(/["']/g, '')
        .trim();
      keys.push(key);
    }
  }

  if (isDebug) {
    console.log('Added or Modified Node Modules:', keys);
  }
  return keys;
};

module.exports = {
  getAppNameFromIndexPath,
  getChangedFiles,
  getNodeModulesModified,
  isDebug,
};
