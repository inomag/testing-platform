const { execSync } = require('child_process');
const fs = require('fs-extra');

const REPORTS_FOLDER = 'reports';
const FINAL_OUTPUT_FOLDER = 'coverage';

const run = (commands) => {
  commands.forEach((command) => execSync(command, { stdio: 'inherit' }));
};

fs.emptyDirSync(REPORTS_FOLDER);

if (fs.existsSync('cypress/coverage')) {
  fs.copySync('cypress/coverage', `${REPORTS_FOLDER}`);
}

if (fs.existsSync('jest/coverage/coverage-final.json')) {
  fs.copyFileSync(
    'jest/coverage/coverage-final.json',
    `${REPORTS_FOLDER}/from-jest.json`,
  );
}

fs.emptyDirSync('.nyc_output');
fs.emptyDirSync(FINAL_OUTPUT_FOLDER);

run([
  `nyc merge ${REPORTS_FOLDER} && mv coverage.json .nyc_output/out.json`,
  `nyc report --reporter lcov --reporter json --report-dir ${FINAL_OUTPUT_FOLDER}`,
]);
