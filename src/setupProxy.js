/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const stagingURL = 'https://staging.lms.getvymo.com';

// var regex_Api = /\/(portal|!index.html)/;
// var regex_notApi = /\/((?!selfserve).)*/;

let proxyMiddleware;

function getAppNameRegex(appPages) {
  const appNameArray = appPages.map((app) =>
    app.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const patternString = `^(?!/${appNameArray.join(
    '/|/',
  )}|/static|/images|/index.html)[\\s\\S]+$`;
  const pattern = new RegExp(patternString, 'm');
  return pattern;
}

module.exports = function (app, appPages, proxyUrl = stagingURL) {
  console.log('Using Env', proxyUrl);
  const regex = getAppNameRegex(appPages);

  if (proxyMiddleware) {
    // remove the old proxy
    const stackIndex = app._router.stack.findIndex(
      (layer) => layer.handle === proxyMiddleware,
    );
    if (stackIndex !== -1) {
      app._router.stack.splice(stackIndex, 1);
    }
  }

  proxyMiddleware = createProxyMiddleware({
    name: 'proxyMiddleware',
    target: proxyUrl,
    changeOrigin: true,
    on: {
      proxyReq: function (proxyReq, req, res) {
        if (req.baseUrl.indexOf('sso') > -1) {
          proxyReq.setHeader('host', req.headers.host);
        } else {
          proxyReq.setHeader('referrer', proxyUrl);
        }
      },
      proxyRes: function (proxyRes, req, res) {
        if (proxyRes.headers['location']) {
          proxyRes.headers['location'] = proxyRes.headers['location'].replace(
            /https:\/\/localhost/gi,
            'http://localhost:3011',
          );
        }
      },
    },
    pathFilter: (path) => regex.test(path),

    headers: {
      Connection: 'keep-alive',
    },
    cookieDomainRewrite: 'localhost',
  });

  app.use((req, res, next) => {
    // Check if the request is for an asset (e.g., images, CSS, JS)
    const assetExtensions = [
      '.js',
      '.css',
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
      '.gif',
      '.svg',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
    ];
    const isAssetRequest = assetExtensions.some((ext) =>
      req.path.endsWith(ext),
    );

    if (!isAssetRequest) {
      // Apply the proxy middleware only for fetch API calls
      proxyMiddleware(req, res, next);
    } else {
      // Skip the proxy for asset requests
      next();
    }
  });
};

// const reRouteApp = express();

// const localhostUrl = 'http://localhost:3011';

// reRouteApp.use(
//   createProxyMiddleware('/', {
//     target: localhostUrl,
//     changeOrigin: true,
//   }),
// );

// var key = fs.readFileSync(__dirname + '/../certs/selfserve.key');
// var cert = fs.readFileSync(__dirname + '/../certs/selfserve.crt');
// var options = {
//   key: key,
//   cert: cert,
// };

// var reRouteServer = https.createServer(options, reRouteApp);

// reRouteServer.listen(443);
