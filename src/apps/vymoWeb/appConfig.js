const AppConfig = {
  name: 'vymoWeb',
  title: 'Vymo',
  appHtml: 'src/apps/vymoWeb/index.html',
  appIndexJs: 'src/apps/vymoWeb/index',
  output: {
    type: 'html',
    clients: ['abcapital', 'sherlock', 'abc'],
  },
};

module.exports = AppConfig;
