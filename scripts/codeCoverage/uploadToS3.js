const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);
const AWS = require('aws-sdk');

// TODO - this logic will move to pod dashboard with cypress cron logic

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION } =
  process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_DEFAULT_REGION,
});

const branchParams = {
  Bucket: 'self-serve-ui',
  Key: 'web-platform/master/testCoverageReport.json',
};

const pathToReport = path.join(__dirname, 'testCoverageReport.json');

const createCombinedCoverageFileS3 = async () => {
  const fileContent = fs.readFileSync(pathToReport);

  const params = {
    Bucket: 'self-serve-ui',
    Key: 'web-platform/master/testCoverageReport.json',
    Body: fileContent,
    ACL: 'public-read',
    ContentType: 'text/plain',
  };
  console.log('uploading');

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch (error) {
    console.log('Error uploading file:', error);
  }
};

const getCombinedCoverageFileS3 = async () => {
  const fileStream = fs.createWriteStream(pathToReport);
  const readStream = s3.getObject(branchParams).createReadStream();

  console.log('downloading ');
  try {
    await pipeline(readStream, fileStream);
    console.log('File downloaded successfully');
  } catch (e) {
    console.error('Error downloading file', e);
  }
};

// Function to extract coverage data as key-value pairs
const extractCoverageData = (coverageSummary) => {
  const lines = coverageSummary.split('\n');
  const keyValuePair = {};
  lines.forEach((line) => {
    if (line.includes('Statements')) {
      const parts = line.split(':');
      const match = parts[1]?.match(/[+-]?([0-9]*[.])?[0-9]+/); // Matches a floating-point number
      if (match) {
        const percentageValue = parseFloat(match[0]); // Convert the matched string to a floating-point number
        keyValuePair[new Date().toLocaleDateString()] =
          percentageValue.toString(); // Store as a string
      }
    }
  });
  return keyValuePair;
};

// Function to prepend coverage data to file
const prependCoverageToFile = (filePath, newCoverageData) => {
  let existingContentArr = [];
  try {
    const existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    existingContentArr = existingContent.coverageData || [];
    console.log('existingContent', existingContent);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // Ignore file not found error
      existingContentArr = [];
      throw err;
    }
  }

  const coverageData = {
    ...Object.assign(
      {},
      ...existingContentArr.map((existingItem) => ({
        [existingItem.date]: existingItem.coverage,
      })),
    ),
    ...newCoverageData,
  };

  // Prepend new coverage data to existing content
  const updatedContentObj = {
    coverageData: Object.keys(coverageData).map((coverageDataKey) => ({
      date: coverageDataKey,
      coverage: coverageData[coverageDataKey],
    })),
  };

  // Write updated content to the file
  fs.writeFileSync(
    filePath,
    JSON.stringify(updatedContentObj, null, 2),
    'utf8',
  );
  // fs.writeFileSync(filePath, '', 'utf8');
};

const deleteFile = (filePath) => {
  try {
    // Delete the file
    fs.unlinkSync(filePath);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

const main = async () => {
  try {
    const regex = /\n/g;
    const coverageSummary = execSync('npx nyc report --reporter text-summary')
      .toString()
      .toString()
      .replace(regex, ' \n\n');

    const coverageData = extractCoverageData(coverageSummary);
    console.log('coverageData', coverageData);

    await getCombinedCoverageFileS3();

    const reportFilePath = pathToReport;
    await prependCoverageToFile(reportFilePath, coverageData);

    await createCombinedCoverageFileS3();

    await deleteFile(reportFilePath);
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

main();
