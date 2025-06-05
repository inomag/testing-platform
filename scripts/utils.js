const util = require('util');
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const { exec } = require('child_process');

const execAsync = util.promisify(exec);

const { BITBUCKET_BRANCH } = process.env;

function createBoxedText(color = 'cyan', ...lines) {
  if (!Array.isArray(lines)) {
    throw new Error('Input should be an array of strings.');
  }

  // striptAnsi is used as we are using chalk which add ascii character space which is not detected by .length of string
  const maxWidth = Math.max(...lines.map((line) => stripAnsi(line).length));

  const topBorder = chalk[color](`╔${'═'.repeat(maxWidth + 2)}╗`);

  const middleLines = lines.map((line) => {
    const plainText = stripAnsi(line);
    const paddingLength = maxWidth - plainText.length;
    const paddedLine = line + ' '.repeat(paddingLength);
    return chalk[color](`║ ${paddedLine} ║`);
  });

  const bottomBorder = chalk[color](`╚${'═'.repeat(maxWidth + 2)}╝`);

  const boxedText = [topBorder, ...middleLines, bottomBorder].join('\n');

  return boxedText;
}

async function isWorkingTreeClean() {
  try {
    return await execAsync('git diff');
  } catch (error) {
    return false;
  }
}

const isMasterBranch = () => BITBUCKET_BRANCH === 'master';

module.exports = { createBoxedText, isWorkingTreeClean, isMasterBranch };
