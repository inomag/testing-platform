const { exec } = require('child_process');
const { promisify } = require('util');
const _ = require('lodash');
const chalk = require('react-dev-utils/chalk');
const { MODULE_REGEX, APP_REDUCER_REGEX } = require('./constants');
const { getAppNameFromIndexPath } = require('./utils');
const { getChangedFiles } = require('./utils');

const execAsync = promisify(exec);

async function getAffectedDependencies(file) {
  try {
    const { stdout, stderr } = await execAsync(
      `npx depcruise src  --reaches ${file} --output-type json`,
    );
    if (stderr) {
      console.error(stderr);
    }

    // Simulate asynchronous behavior for demonstration

    const dependencies = (JSON.parse(stdout || '').modules || []).map(
      ({ source }) => source,
    );

    return {
      dependencyModule: dependencies.filter((dependentFile) =>
        dependentFile.match(MODULE_REGEX),
      ),
      dependencyApps: dependencies.filter((dependentFile) =>
        dependentFile.match(APP_REDUCER_REGEX),
      ),
    };
  } catch (error) {
    throw Error(error);
  }
}

async function getAffectedModulesAndApps() {
  const changedFiles = getChangedFiles();

  try {
    const results = await Promise.allSettled(
      changedFiles.map(getAffectedDependencies),
    );

    let { modulesAffected, appsAffected } = results.reduce(
      (acc, current) => {
        acc.modulesAffected = acc.modulesAffected.concat(
          current.value.dependencyModule,
        );
        acc.appsAffected = acc.appsAffected.concat(
          current.value.dependencyApps,
        );
        return acc;
      },
      {
        modulesAffected: [],
        appsAffected: [],
      },
    );

    modulesAffected = _.uniq(modulesAffected);
    appsAffected = getAppNameFromIndexPath(_.uniq(appsAffected));

    console.log(
      chalk.bold.blue('Apps Affected:'),
      chalk.bold.blue(appsAffected),
    );
    return {
      modulesAffected,
      appsAffected,
    };
  } catch (error) {
    throw Error(error);
  }
}

module.exports = {
  getAffectedModulesAndApps,
};
