const inquirer = require('@inquirer/prompts');

const proxyLmsUrls = [
  new inquirer.Separator(),
  { name: 'abc-staging', value: 'https://abc-staging.lms.getvymo.com' },
  {
    name: 'Staging',
    value: 'https://staging.lms.getvymo.com',
  },
  { name: 'frontendBoard', value: 'https://frontend.getvymo.com' },
  { name: 'frontendBoardDev', value: 'http://localhost:3000' },
  new inquirer.Separator(),
  { name: 'Pod5', value: 'https://pod5.lms.getvymo.com' },
  {
    name: 'Pod2',
    value: 'https://pod2-debug.lms.getvymo.com',
  },
  { name: 'Pod7', value: 'https://pod7.lms.getvymo.com' },
  { name: 'Pod6', value: 'http://pod6.lms.getvymo.com' },
  { name: 'Pod9', value: 'https://pod9.lms.getvymo.com' },
  { name: 'asi-dev', value: 'https://asi-dev.lms.getvymo.com' },
  new inquirer.Separator(),
  {
    name: 'asi-demo-uat',
    value: 'https://asi-demo-uat.lms.getvymo.com/',
  },
  {
    name: 'aci-sandbox',
    value: 'https://aci-sandbox.lms.getvymo.com',
  },
  {
    name: 'mockPortal',
    value: 'https://e3510723-a222-48aa-bb51-04872fec7de7.mock.pstmn.io',
  },
  new inquirer.Separator(),
  {
    name: 'Add new',
    value: 'addNew',
  },
];

module.exports = { proxyLmsUrls };

// EFMPS4645R

// sss@ss.com
