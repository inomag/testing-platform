const { execSync } = require('child_process');
const _ = require('lodash');
const glob = require('glob');

const { CYPRESS_DASHBOARD_KEY, BITBUCKET_BUILD_NUMBER, BITBUCKET_BRANCH } =
  process.env;

// Array to store spec files
let specFiles = [];

const { getAffectedModulesAndApps } = require('./depcruise');

const getSpecFiles = (type, data) => {
  const specPathForType = [];
  data?.forEach((path) => {
    // Extract the name from the path
    const name = type === 'modules' ? path.split('/')[2] : path.split('/')[4];

    // Construct the path to the spec files for the module/atom/block/component based on type
    const specPath = glob.sync(`src/${type}/${name}/**/integration/*.spec.tsx`);

    // Add spec files to the array
    specPathForType.push(...(Array.isArray(specPath) ? specPath : [specPath]));
  });
  return specPathForType;
};

async function main() {
  if (BITBUCKET_BRANCH === 'master') {
    const command = `CURRENTS_PROJECT_ID=${CYPRESS_DASHBOARD_KEY} cypress-cloud run --component --browser chrome --parallel --record --key ${CYPRESS_DASHBOARD_KEY} --ci-build-id ${BITBUCKET_BUILD_NUMBER}`;
    try {
      // Execute the command synchronously
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error running Cypress tests:', error);
      process.exit(1);
    }
  } else {
    const {
      modulesAffected,
      atomsAffected,
      blocksAffected,
      componentsAffected,
      moleculesAffected,
    } = await getAffectedModulesAndApps();
    const modulesSpecFiles = getSpecFiles('modules', modulesAffected);
    const atomsSpecFiles = getSpecFiles('@vymo/ui/atoms', atomsAffected);
    const blocksSpecFiles = getSpecFiles('@vymo/ui/blocks', blocksAffected);
    const componentsSpecFiles = getSpecFiles(
      '@vymo/ui/components',
      componentsAffected,
    );
    const moleculesSpecFiles = getSpecFiles(
      '@vymo/ui/molecules',
      moleculesAffected,
    );
    specFiles.push(
      ...modulesSpecFiles,
      ...atomsSpecFiles,
      ...blocksSpecFiles,
      ...componentsSpecFiles,
      ...moleculesSpecFiles,
    );
    specFiles = _.uniq(specFiles);
    if (specFiles.length > 0) {
      console.log('Running Cypress tests for affected modules:');
      console.log(specFiles.join('\n'));

      // Construct the command to run Cypress tests
      const command = `CURRENTS_PROJECT_ID=${CYPRESS_DASHBOARD_KEY} cypress-cloud run --spec "${specFiles.join(
        ',',
      )}" --component --browser chrome --parallel --record --key ${CYPRESS_DASHBOARD_KEY} --ci-build-id ${BITBUCKET_BUILD_NUMBER}`;

      try {
        // Execute the command synchronously
        execSync(command, { stdio: 'inherit' });
      } catch (error) {
        console.error('Error running Cypress tests:', error);
        process.exit(1);
      }
    } else {
      console.log('No Cypress tests found for affected modules.');
    }
  }
}

main();
