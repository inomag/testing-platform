const fs = require('fs-extra');

const CYPRESS_COVERAGE_FOLDER = 'cypress/coverage';
const CYPRESS_COVERAGE_FILE = `${CYPRESS_COVERAGE_FOLDER}/coverage-final.json`;

const CYPRESS_COVERAGE_UPDATED_FILENAME = `${CYPRESS_COVERAGE_FOLDER}/coverage-final_${
  process.env.BITBUCKET_PARALLEL_STEP + 1
}.json`;

if (fs.existsSync(CYPRESS_COVERAGE_FILE)) {
  fs.renameSync(CYPRESS_COVERAGE_FILE, CYPRESS_COVERAGE_UPDATED_FILENAME);
} else {
  console.log(
    `${CYPRESS_COVERAGE_FILE} file does not exsit for step ${
      process.env.BITBUCKET_PARALLEL_STEP + 1
    }`,
  );
}
