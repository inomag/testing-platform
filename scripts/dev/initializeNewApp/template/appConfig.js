const AppConfig = {
  name: '{{appName}}',
  title: '{{appName}}',
  appHtml: 'src/apps/{{appName}}/index.html',
  appIndexJs: 'src/apps/{{appName}}/index',
  output: {
    type: '{{appOutputType}}',
    clients: [],
  },
};

module.exports = AppConfig;
