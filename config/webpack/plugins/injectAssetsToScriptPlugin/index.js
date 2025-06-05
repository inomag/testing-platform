const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const {
  getScriptContent,
  getClientIdsPerAppConfig,
  writeFileForWebpack,
} = require('./templates/utils');
const { appPages, appBuild, appPublic } = require('../../../paths');
const { proxyLmsUrls } = require('../../../../scripts/constants');
const { getHomeButton } = require('../injectAssetsToHtmlPlugin/utils');

class InjectAssetsToScriptPlugin {
  constructor(isEnvProduction, appsToCompile, proxyUrl, appEnv) {
    this.isEnvProduction = isEnvProduction || false;
    this.appsToCompile = appsToCompile || [];
    this.proxyUrl = proxyUrl || '';
    this.appEnv = appEnv;
  }

  // eslint-disable-next-line class-methods-use-this, max-lines-per-function
  apply(compiler) {
    if (!existsSync(appBuild)) {
      mkdirSync(appBuild);
    }

    compiler.hooks.emit.tapAsync(
      'InjectAssetsToScriptPlugin',
      (compilation, callback) => {
        compilation.entrypoints.forEach((entrypoint) => {
          const appName = entrypoint.name;
          const entryFiles = entrypoint.getFiles();

          const fileData = getScriptContent(
            entryFiles,
            appName,
            this.isEnvProduction,
          );
          const outputDir = compilation.options.output.path;
          const fileName = `index.js`;

          writeFileForWebpack({
            compilation,
            fileData,
            outputDir,
            appName,
            fileName,
            isEnvProduction: this.isEnvProduction,
          });
        });
        callback();
      },
    );

    // TODO: This should be available in dev mode as well
    compiler.hooks.afterEmit.tap('afterEmit', (compilation) => {
      if (this.isEnvProduction) {
        compilation.entrypoints.forEach((entrypoint) => {
          const appName = entrypoint.name;

          // Create Client specifc html
          const { clients, type } =
            appPages.find((appPage) => appPage.name === appName)?.output ?? {};
          if (type === 'clientHtml') {
            if (!clients || clients.length === 0) {
              console.log(chalk.yellow(`No clients found for app: ${appName}`));
            }

            clients.forEach((clientName) => {
              // Read the HTML template
              const indexPath = `${compilation.options.output.path}/${appName}/index.html`;
              const indexContent = readFileSync(indexPath, 'utf-8');
              // Modify the content dynamically
              const dynamicContent = `window.vymo?.default?.render?.("${clientName}")
                window.APP = "${appName}"`;
              const modifiedTemplate = indexContent.replace(
                'window.vymo?.default?.render?.()',
                dynamicContent,
              );

              writeFileSync(
                `${compilation.options.output.path}/${appName}/${clientName}.html`,
                modifiedTemplate,
              );
            });
          }
        });
      }
    });

    // Read the Web Platform HTML template (this will not run for app specific html)
    let templatePath = path.join(__dirname, 'templates/dev.html');
    if (this.isEnvProduction) {
      templatePath = path.join(__dirname, 'templates/build.html');
    }
    const templateContent = readFileSync(templatePath, 'utf-8');

    const appBuildPages =
      this.isEnvProduction || this.appsToCompile.indexOf('all') > -1
        ? appPages
        : appPages.filter(({ name }) => this.appsToCompile.indexOf(name) > -1);

    let modifiedTemplate = '';

    if (
      !['production', 'preProd', 'staging'].includes(this.appEnv) &&
      appBuildPages.length > 0
    ) {
      // Modify the content dynamically
      const dynamicContent = `<select id="portalSelect" name="portalSelect" onchange="handleAppSelection()">
    <option value="" disabled selected>Select an option</option>
    ${appBuildPages.map(
      ({ name }) => ` <option value=${name}>${name}</option>`,
    )}</select>`;
      modifiedTemplate = templateContent.replace(
        '<select id="portalSelect" name="portalSelect"></select>',
        dynamicContent,
      );

      // append platform button to the body for each platform html in dev mode and in deployed feature urls
      modifiedTemplate = modifiedTemplate.replace(
        '<div id="root">',
        getHomeButton(),
      );
    } else {
      const dynamicContent = `const clientIdsPerApp = [];   
      document.querySelector(".startPortal").innerHTML = "<h1>Page Not Found</h1>"`;
      modifiedTemplate = templateContent.replace(
        'const clientIdsPerApp = [];',
        dynamicContent,
      );
    }

    modifiedTemplate = modifiedTemplate.replace(
      'const clientIdsPerApp = []',
      `const clientIdsPerApp = ${JSON.stringify(
        getClientIdsPerAppConfig(appBuildPages),
      )}`,
    );

    if (!this.isEnvProduction) {
      // add support to change proxy urls without restarting the server for dev mode
      const secondWebSocketPort = process.env.WEB_SOCKET_PORT;

      const dynamicProxyUrls = `<select id="proxySelect" name="proxySelect" onchange="updateProxy()">${proxyLmsUrls
        .filter(({ value }) => value)
        .map(({ name, value }) =>
          value === this.proxyUrl
            ? `<option value=${value} selected>${name}</option>`
            : `<option value=${value}>${name}</option>`,
        )}</select>`;

      modifiedTemplate = modifiedTemplate
        .replace('<select id="proxySelect"></select>', dynamicProxyUrls)
        .replace(
          "socket = new WebSocket('ws://localhost:port');",
          `socket = new WebSocket('ws://localhost:${secondWebSocketPort}');`,
        );
    }

    // Save the modified content to a new HTML file
    let outputPath = path.join(appPublic, 'index.html');
    console.log(outputPath);
    if (this.isEnvProduction) {
      outputPath = path.join(appBuild, 'index.html');
    }

    writeFileSync(outputPath, modifiedTemplate);
  }
}

module.exports = InjectAssetsToScriptPlugin;
