const { spawnSync, execSync } = require('child_process');

const isAlphaPublish = process.argv.includes('--alpha');

const getNextVersion = async () => {
  const child = spawnSync('npx', ['git-cliff', '--bumped-version'], {
    encoding: 'utf-8',
  });

  let nextVersion =
    child.stdout.toString().trim().split('@vymo/ui/')?.[1] ?? '0.1.0';
  const error = child.stderr.toString();
  if (error.indexOf('nothing to bump') > -1) {
    throw new Error(
      `There is nothing to bump. As no new commit is added on top of ${nextVersion}. Please make sure to have commit message.`,
    );
  }

  if (isAlphaPublish && nextVersion.indexOf('alpha') === -1) {
    nextVersion = `${nextVersion}-alpha.0`;
  } else if (!isAlphaPublish && nextVersion.indexOf('alpha') > -1) {
    nextVersion = nextVersion.replace(/-alpha\.\d+/, '');
  }
  console.log(nextVersion);

  return nextVersion;
};

const generateChangelog = async () =>
  execSync('npx git-cliff --bump -o changelog.md');

module.exports = { getNextVersion, generateChangelog };
