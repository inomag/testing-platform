const CLIENT = require('../constants');

const AppConfig = {
  name: 'recruitment',
  title: 'recruitment',
  appHtml: 'src/apps/recruitment/index.html',
  appIndexJs: 'src/apps/recruitment/index',
  output: {
    type: 'clientHtml',
    clients: [CLIENT.AGEAS, CLIENT.COLLX],
  },
};

module.exports = AppConfig;
