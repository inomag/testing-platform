const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const { appSrc, appPath: appRoot } = require('../../../config/paths');

const copyResources = (resourceArray, templatePath, appPath) => {
  resourceArray.forEach((resource) => {
    fs.copyFileSync(
      path.join(templatePath, resource),
      path.join(appPath, resource),
    );
  });
};

const getPortalAppFolderPath = (appName) => path.join(appSrc, 'apps', appName);

const getStoreDataModified = (appName, reducerListBlock) => {
  let modifiedReducerListBlock = `import { reducerList as ${appName}Reducer } from 'src/apps/${appName}/modulesReducerConfig'; 
    ${reducerListBlock}\n`;

  const closingBraceIndex = modifiedReducerListBlock.lastIndexOf('}');
  if (closingBraceIndex !== -1) {
    // Insert the new data before the closing curly brace
    modifiedReducerListBlock = `${modifiedReducerListBlock.slice(
      0,
      closingBraceIndex,
    )}...${appName}Reducer,\n${modifiedReducerListBlock.slice(
      closingBraceIndex,
    )}`;
  } else {
    throw new Error(
      chalk.red('Store reducerList closing curly brace not found'),
    );
  }

  return modifiedReducerListBlock;
};

const modifyStore = (appName) => {
  const storePath = path.join(appSrc, 'store', 'index.ts');
  const storeData = fs.readFileSync(storePath).toString();
  const regex = /export\s+const\s+reducerList\s*=\s*{[^}]*};/s;
  const match = storeData.match(regex);

  if (match) {
    const modifiedReducerListBlock = getStoreDataModified(appName, match[0]);
    const modifiedStoreData = storeData.replace(
      regex,
      modifiedReducerListBlock,
    );
    fs.writeFileSync(storePath, modifiedStoreData);
  } else {
    throw new Error(chalk.red('Store modifying redcuerList failed!'));
  }
};

const getWebpackAppConfigDataModified = (appName, appListBlock) => {
  let modifiedAppListBlock = `const ${appName}AppConfig = require('../src/apps/${appName}/appConfig');\n 
    ${appListBlock}\n`;

  const closingBraceIndex = modifiedAppListBlock.lastIndexOf(']');
  if (closingBraceIndex !== -1) {
    // Insert the new data before the closing curly brace
    modifiedAppListBlock = `${modifiedAppListBlock.slice(
      0,
      closingBraceIndex,
    )}${appName}AppConfig,\n${modifiedAppListBlock.slice(closingBraceIndex)}`;
  } else {
    throw new Error(
      chalk.red('Store reducerList closing curly brace not found'),
    );
  }

  return modifiedAppListBlock;
};

const modifyWebPackAppConfig = (appName) => {
  const appConfigPath = path.join(appRoot, 'config', 'app.config.js');
  const webpaackAppConfig = fs.readFileSync(appConfigPath).toString();
  const regex = /const\s+apps\s*=\s*\[\s*([\w\s,]*?)\s*\];/s;
  const match = webpaackAppConfig.match(regex);

  if (match) {
    const modifiedAppListBlock = getWebpackAppConfigDataModified(
      appName,
      match[0],
    );
    const modifiedStoreData = webpaackAppConfig.replace(
      regex,
      modifiedAppListBlock,
    );
    fs.writeFileSync(appConfigPath, modifiedStoreData);
  } else {
    throw new Error(chalk.red('app.config.js modifying appsList failed!'));
  }
};

const getCypressModuleListDataModified = (appName, appListBlock) => {
  let modifiedCypressListBlock = `import { moduleList as ${appName}ModuleList } from 'src/apps/${appName}/modulesReducerConfig'; 
    ${appListBlock}\n`;

  const closingBraceIndex = modifiedCypressListBlock.lastIndexOf('}');
  if (closingBraceIndex !== -1) {
    // Insert the new data before the closing curly brace
    modifiedCypressListBlock = `${modifiedCypressListBlock.slice(
      0,
      closingBraceIndex,
    )}...${appName}ModuleList,\n${modifiedCypressListBlock.slice(
      closingBraceIndex,
    )}`;
  } else {
    throw new Error(
      chalk.red('Store reducerList closing curly brace not found'),
    );
  }

  return modifiedCypressListBlock;
};

const modifyCypressModuleList = (appName) => {
  const cypressModuleListPath = path.join(
    appRoot,
    'cypress/modules/support',
    'moduleConfig.ts',
  );
  const cypressModuleList = fs.readFileSync(cypressModuleListPath).toString();

  const regex = /export\s+const\s+moduleList\s*=\s*{[^}]*};/s;
  const match = cypressModuleList.match(regex);

  if (match) {
    const modifiedAppListBlock = getCypressModuleListDataModified(
      appName,
      match[0],
    );
    const modifiedStoreData = cypressModuleList.replace(
      regex,
      modifiedAppListBlock,
    );
    fs.writeFileSync(cypressModuleListPath, modifiedStoreData);
  } else {
    throw new Error(chalk.red('app.config.js modifying appsList failed!'));
  }
};

const modifyReacAppEnv = (appName) => {
  const reactAppEnvPath = path.join(appSrc, 'react-app-env.d.ts');
  const reactAppEnvData = fs.readFileSync(reactAppEnvPath).toString();

  const regex = /APP:\s*"([^"]+)"(?:\s*\|\s*"([^"]+)")*/g;

  const reactAppEnvUpdatedData = reactAppEnvData.replace(regex, (match) => {
    // Check if the app name already exists to avoid duplication
    if (!match.includes(`"${appName}"`)) {
      return `${match} | "${appName}"`;
    }

    console.log(chalk.yellow('app name already exist in types'));
    return match;
  });

  fs.writeFileSync(reactAppEnvPath, reactAppEnvUpdatedData);
};

const createNewApp = (appName, appOutputType, templateType) => {
  const appPath = getPortalAppFolderPath(appName);
  const templatePath = path.join(__dirname, 'template');

  console.log('templateType used', templateType);

  if (fs.existsSync(appPath)) {
    throw new Error(
      chalk.red.bold(
        `${appName} app already exists. Please give the unique app name`,
      ),
    );
  }

  fs.mkdirSync(appPath);

  const appConfigData = fs
    .readFileSync(path.join(templatePath, 'appConfig.js'))
    .toString()
    .replace(/{{appName}}/g, appName)
    .replace(/{{appOutputType}}/g, appOutputType);
  fs.writeFileSync(path.join(appPath, 'appConfig.js'), appConfigData);

  const indexHtmlData = fs
    .readFileSync(path.join(templatePath, 'index.html'))
    .toString()
    .replace(/{{appName}}/g, appName);

  fs.writeFileSync(path.join(appPath, 'index.html'), indexHtmlData);

  const indexScriptData = fs
    .readFileSync(path.join(templatePath, 'index.tsx'))
    .toString()
    .replace(/PortalApp/g, _.upperFirst(appName));

  fs.writeFileSync(path.join(appPath, 'index.tsx'), indexScriptData);

  copyResources(
    ['index.scss', 'layout.tsx', 'modulesReducerConfig.ts'],
    templatePath,
    appPath,
  );

  modifyStore(appName);
  modifyWebPackAppConfig(appName);
  modifyCypressModuleList(appName);
  modifyReacAppEnv(appName);
};

module.exports = { createNewApp, getPortalAppFolderPath };
