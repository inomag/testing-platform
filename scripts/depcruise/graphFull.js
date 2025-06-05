const { execSync, exec } = require('child_process');
const util = require('util');
const chalk = require('react-dev-utils/chalk');
const _ = require('lodash');
const {
  MODULE_REGEX,
  APP_REGEX,
  APP_FOLDER_REGEX,
  ATOM_REGEX,
  BLOCK_REGEX,
  COMPONENT_REGEX,
  MOLECULE_REGEX,
} = require('./constants');
const { getAppNameFromIndexPath } = require('./utils');
const { getChangedFiles, getNodeModulesModified, isDebug } = require('./utils');

const execAsync = util.promisify(exec);

// Function to recursively find all dependents (direct and indirect) for a file
const findAllDependents = (file, dependencyGraph, visited = new Set()) => {
  if (visited.has(file)) {
    return [];
  }

  visited.add(file);

  const moduleInfo = dependencyGraph.modules.find(
    (module) => module.source === file,
  );

  if (!moduleInfo) {
    return [];
  }

  const directDependents = moduleInfo.dependents || [];
  const indirectDependents = directDependents.flatMap((dependent) =>
    findAllDependents(dependent, dependencyGraph, visited),
  );

  return Array.from(new Set([...directDependents, ...indirectDependents]));
};

// Analyze reachability for each file
const analyzeReachability = (file, modulesDependencyGraph) => {
  const dependencies = findAllDependents(file, modulesDependencyGraph);
  return {
    dependencyModule: dependencies.filter((dependentFile) =>
      dependentFile.match(MODULE_REGEX),
    ),
    dependencyApps: dependencies.filter((dependentFile) =>
      dependentFile.match(APP_REGEX),
    ),
    dependencyAtom: dependencies.filter((dependentFile) =>
      dependentFile.match(ATOM_REGEX),
    ),
    dependencyBlock: dependencies.filter((dependentFile) =>
      dependentFile.match(BLOCK_REGEX),
    ),
    dependencyMolecule: dependencies.filter((dependentFile) =>
      dependentFile.match(MOLECULE_REGEX),
    ),
    dependencyComponent: dependencies.filter((dependentFile) =>
      dependentFile.match(COMPONENT_REGEX),
    ),
  };
};

const analyzeReachabilityForNodeModules = (modulesDependencyGraph) => {
  // Get all dependents for each Node module
  const allNodeModules = modulesDependencyGraph.modules
    .filter((module) => module.source.startsWith('node_modules/'))
    .map((module) => module.source);

  const affectedFilesByNodeModule = {};

  allNodeModules.forEach((module) => {
    const affectedFiles = findAllDependents(module, modulesDependencyGraph);
    const moduleName = module.replace(/^node_modules\//, '');
    affectedFilesByNodeModule[moduleName] = _.uniq(affectedFiles).filter(
      (affectedFile) => affectedFile.match('src/'),
      -1,
    );
  });

  if (isDebug) {
    console.log(
      'Affected files by all node module:',
      affectedFilesByNodeModule,
    );
  }
  return affectedFilesByNodeModule;
};

const getFilesAffectedByNodeModules = (modulesDependencyGraph) => {
  const nodeModulesDep = analyzeReachabilityForNodeModules(
    modulesDependencyGraph,
  );
  const nodeModulesModified = getNodeModulesModified();

  const filesAffectedByNodeModule = Object.entries(nodeModulesDep)
    .filter(([file]) =>
      nodeModulesModified.find(
        (nodeModuleKey) => file.indexOf(nodeModuleKey) > -1,
      ),
    )
    .map(([, files]) => files);

  if (isDebug) {
    console.log(
      'Affected files by change node module:\n',
      chalk.red(filesAffectedByNodeModule.toString().split(',').join('\n')),
    );
  }

  return filesAffectedByNodeModule;
};

// Function to get affected modules and apps
const getAffectedModulesAndApps = async () => {
  let modulesAffected = [];
  let appsAffected = [];
  let atomsAffected = [];
  let blocksAffected = [];
  let moleculesAffected = [];
  let componentsAffected = [];

  execSync('git fetch origin master:refs/remotes/origin/master');

  let filesToAnalyze = getChangedFiles();

  appsAffected = filesToAnalyze.filter((file) => file.match(APP_FOLDER_REGEX));

  const { stdout, stderr } = await execAsync(
    'npx depcruise src --include-only .  --output-type json',
    { maxBuffer: 1024 * 10000 },
  );

  if (stderr) {
    console.log(stderr);
  }

  const modulesDependencyGraph = JSON.parse(stdout);
  const isPackageJsonUpdate = filesToAnalyze.includes('package.json');

  filesToAnalyze = [
    ...filesToAnalyze,
    ...(isPackageJsonUpdate
      ? getFilesAffectedByNodeModules(modulesDependencyGraph)
      : []),
  ];

  if (isDebug) {
    console.log(
      chalk.yellow('Files To Analyze:\n'),
      chalk.yellow(filesToAnalyze.toString().split(',').join('\n')),
    );
  }

  filesToAnalyze.forEach((file) => {
    const {
      dependencyModule,
      dependencyApps,
      dependencyAtom,
      dependencyBlock,
      dependencyComponent,
      dependencyMolecule,
    } = analyzeReachability(file, modulesDependencyGraph);
    modulesAffected = _.uniq(modulesAffected.concat(dependencyModule));
    appsAffected = _.uniq(appsAffected.concat(dependencyApps));
    atomsAffected = _.uniq(atomsAffected.concat(dependencyAtom));
    blocksAffected = _.uniq(blocksAffected.concat(dependencyBlock));
    moleculesAffected = _.uniq(moleculesAffected.concat(dependencyMolecule));
    componentsAffected = _.uniq(componentsAffected.concat(dependencyComponent));
  });

  appsAffected = _.uniq(getAppNameFromIndexPath(appsAffected));

  console.log(
    chalk.bold.magenta('Apps Affected:'),
    chalk.bold.magenta(appsAffected),
  );
  console.log(
    chalk.bold.blue('Modules Affected:\n'),
    chalk.bold.blue(modulesAffected.toString().split(',').join('\n')),
  );

  return {
    modulesAffected,
    appsAffected,
    atomsAffected,
    blocksAffected,
    moleculesAffected,
    componentsAffected,
  };
};

module.exports = {
  getAffectedModulesAndApps,
};
