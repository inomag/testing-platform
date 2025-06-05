const fs = require('fs');
const path = require('path');

// Function to find the path of react-datepicker in node_modules
const findPackagePath = (packageName) => {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const packagePath = path.join(nodeModulesPath, packageName);
  if (fs.existsSync(packagePath)) {
    return packagePath;
  }
  return null;
};

const removePropertyFromPackageJson = (packageJsonPath, property) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson[property]) {
    delete packageJson[property];
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8',
    );
    console.log(`Removed "${property}" from ${packageJsonPath}`);
  } else {
    console.log(`Property "${property}" not found in ${packageJsonPath}`);
  }
};

const packageName = 'react-datepicker';
const propertyToRemove = 'browser';

const packagePath = findPackagePath(packageName);
if (packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    removePropertyFromPackageJson(packageJsonPath, propertyToRemove);
  } else {
    console.log(`package.json not found for ${packageName}`);
  }
} else {
  console.log(`${packageName} not found in node_modules`);
}
