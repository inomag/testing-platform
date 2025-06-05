const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getHomeButton, getPortalSelect } = require('./utils');
const { appPages } = require('../../../paths');

class InjectCodePlugin {
  constructor(isEnvDevelopment = false, appEnv = '') {
    this.isEnvDevelopment = isEnvDevelopment;
    this.appEnv = appEnv;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('InjectCodePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectCodePlugin',
        (data, cb) => {
          if (
            this.isEnvDevelopment ||
            !this.appEnv ||
            ['pod'].includes(this.appEnv)
          ) {
            // append platform button to the body for each app html in dev mode and in deployed feature urls
            data.html = data.html.replace('<div id="root">', getHomeButton());
          }

          const appPortals =
            appPages.find(
              (appConfig) => appConfig.name === data.plugin.userOptions.name,
            )?.output?.clients?.length ?? 0;

          if (
            !['production', 'preProd', 'staging', 'pod'].includes(
              this.appEnv,
            ) &&
            appPortals.length > 0
          ) {
            data.html = data.html.replace(
              'window.vymo?.default?.render?.()',
              // passing portalId as the same is needed for testing different portals from same app url.
              // portalId is sent to backend also as part of request headers.
              // In prod not needed as each portal id would point to different app urls.
              `
              ${getPortalSelect(data.plugin.userOptions.name)}
               window.APP = "${data.plugin.userOptions.name}"`,
            );
          } else {
            data.html = data.html.replace(
              'window.vymo?.default?.render?.()',
              // In prod not needed as each portal id would point to different app urls.
              `
              window.vymo?.default?.render?.()
              window.APP = "${data.plugin.userOptions.name}"`,
            );
          }
          cb(null, data);
        },
      );
    });
  }
}

module.exports = InjectCodePlugin;
