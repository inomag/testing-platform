// This file is used to add package details to package.json an dcopy readme.md to dist
const fs = require('fs');
const path = require('path');
const { getNextVersion, generateChangelog } = require('./utils');
const { isMasterBranch } = require('../utils');

const isAlphaPublish = process.argv.includes('--alpha');

const isTestPublish = process.argv.includes('--test');

const ignoreModules = ['react', 'react-dom'];

function getNodeModuleVersion(dependencies, moduleName) {
  if (dependencies[moduleName]) {
    return dependencies[moduleName];
  }
  const moduleNameSplit = moduleName.split('/');
  if (moduleNameSplit.length > 1) {
    moduleName = moduleNameSplit.join().slice(-1);
    return getNodeModuleVersion(dependencies, moduleName);
  }

  return null;
}

// Function to read package.json and get module versions
function getLibDepModuleVersions(packagePath, modules) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const moduleVersions = {};
  modules.forEach((moduleName) => {
    const moduleVersion = getNodeModuleVersion(
      packageJson.dependencies,
      moduleName,
    );
    if (moduleVersion) {
      moduleVersions[moduleName] = moduleVersion;
    }
  });
  return moduleVersions;
}

function extractModules(filePath, modules) {
  const content = fs.readFileSync(filePath, 'utf8');
  const requireMatches =
    content.match(/require\(['"](?![./]|src\/)[^\s'"]+['"]\)/g) || [];
  const importMatches =
    content.match(/import\s+[^;]+from\s+['"][^'"]+['"]/g) || [];
  const directImportMatches = content.match(/import\s+['"][^'"]+['"]/g) || [];
  const awaitImportMatches =
    content.match(/await\s+import\(['"][^'"]+['"]\)/g) || [];
  const matches = requireMatches.concat(
    requireMatches,
    importMatches,
    directImportMatches,
    awaitImportMatches,
  );

  matches.forEach((match) => {
    const moduleName = match.match(/['"](?![./]|src\/)([^'"]+)['"]/)?.[1];

    // filtering ignoreModules(react, react-dom) as these modules will be available in host app
    if (moduleName && !ignoreModules.includes(moduleName)) {
      modules.add(moduleName);
    }
  });
}

// Function to identify node modules name
function identifyTopLevelModules(directory) {
  const modules = new Set();
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      extractModules(filePath, modules);
    } else if (stats.isDirectory()) {
      // Recursively search directories for JavaScript files
      const subDirectory = path.join(directory, file);
      const subModules = identifyTopLevelModules(subDirectory);
      subModules.forEach((module) => modules.add(module));
    }
  });
  return Array.from(modules);
}

const topLevelModules = [...identifyTopLevelModules('src/@vymo/ui')];

console.log('Node modules idenitifed', topLevelModules);

const packageJsonPath = path.join(process.cwd(), 'package.json');

const main = async () => {
  if (fs.existsSync(packageJsonPath)) {
    const moduleVersions = getLibDepModuleVersions(
      packageJsonPath,
      topLevelModules,
    );

    console.log('Node modules Versions', moduleVersions);

    const samplePackageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'samplePackage.json')),
    );

    samplePackageJson.dependencies = moduleVersions;
    let nextVersion = '1.0.0';

    if (!isTestPublish) {
      try {
        nextVersion = await getNextVersion();
      } catch (e) {
        throw new Error(e);
      }
    }

    samplePackageJson.version = nextVersion;
    const libPackageJsonPath = path.join(process.cwd(), 'dist', 'package.json');
    fs.writeFileSync(
      libPackageJsonPath,
      JSON.stringify(samplePackageJson, null, 2),
    );

    if (isMasterBranch() && !isAlphaPublish) {
      await generateChangelog();
      fs.copyFileSync(
        path.join(process.cwd(), 'changelog.md'),
        path.join(process.cwd(), 'dist', 'Readme.md'),
      );
    }

    fs.copyFileSync(
      path.join(process.cwd(), '.npmrc'),
      path.join(process.cwd(), 'dist', '.npmrc'),
    );

    fs.copyFileSync(
      path.join(__dirname, 'postInstall.js'),
      path.join(process.cwd(), 'dist', 'postInstall.js'),
    );
  } else {
    console.error('Error: package.json not found in the subset directory!');
  }
};

main();
