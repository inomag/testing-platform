// this script is to revert what are thae changes done in beforeBuild step
// will add back homePage from package.json

const fs = require('fs');

const PACKAGE_JSON_PATH = 'package.json';

const packageJsonData = fs.readFileSync(PACKAGE_JSON_PATH);
const packageJson = JSON.parse(packageJsonData);
delete packageJson.homepage;

fs.writeFileSync('package.json', JSON.stringify(packageJson));
