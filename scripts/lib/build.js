/* eslint-disable max-lines-per-function */
const util = require('util');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { exec, execSync } = require('child_process');
const { Listr, delay } = require('listr2');
const { getNextVersion } = require('./utils');
const { createBoxedText, isWorkingTreeClean } = require('../utils');

const { getAffectedModulesAndApps } = require('../depcruise/index');

const execAsync = util.promisify(exec);

const main = async () => {
  const tasks = new Listr([
    {
      title: 'Check Working Tree',
      task: async () => {
        const { stdout } = await isWorkingTreeClean();
        if (stdout.trim() !== '') {
          throw new Error(
            'Working tree is not clean. Please commit or stash your changes.',
          );
        }
      },
    },
    {
      title: 'Check for new commits',
      task: async () => {
        try {
          await getNextVersion();
        } catch (e) {
          throw new Error(e);
        }
      },
    },
    {
      title: 'Check for atoms/blocks/molecules/components change',
      task: async (ctx, task) => {
        const {
          atomsAffected,
          blocksAffected,
          moleculesAffected,
          componentsAffected,
        } = await getAffectedModulesAndApps();
        if (
          atomsAffected.length === 0 &&
          blocksAffected.length === 0 &&
          moleculesAffected.length === 0 &&
          componentsAffected.length === 0
        ) {
          ctx.skipRemainingTasks = true;
          task.skip(
            'Skipping all subsequent tasks as no change in atoms/blocks',
          );
        }
      },
    },

    {
      title: 'Build node package',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        const { stdout, stderr } = await execAsync('npx tsup ');
        task.output = JSON.stringify({ stdout, stderr });
        await delay(2000);
      },
    },

    {
      title: 'Create module package.json and add dependencies',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        const { stdout, stderr } = await execAsync(
          'node scripts/lib/addPackageDetails.js',
        );
        task.output = JSON.stringify({ stdout, stderr });
        await delay(2000);
      },
    },

    {
      title: 'Publish node package',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        execSync(
          `npm config set registry http://4.240.91.27:4873/ && npm config set //4.240.91.27:4873/:_authToken ${process.env.NPM_TOKEN}`,
        );
        task.output = await execAsync('npm publish', {
          cwd: path.join(process.cwd(), 'dist'),
          stdio: 'inherit',
          shell: true,
        });
        ctx.version = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'dist', 'package.json')),
        ).version;

        console.log(
          createBoxedText(
            'cyanBright',
            'Released version is',
            chalk.cyan.bold(ctx.version),
          ),
        );
        console.log(
          chalk.green('Run yarn add @vymo/ui@latest to install the same'),
        );

        await delay(2000);
      },
    },
    {
      title: 'Add Version Tag',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        const tagName = `@vymo/ui/${ctx.version}`;
        task.output = execSync(
          `git tag -a "${tagName}" -m "Version ${ctx.version}" && git push origin ${tagName}`,
        );
        await delay(2000);
      },
    },
  ]);

  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

if (process.env.CI !== 'true') {
  console.error(
    chalk.yellow.bold(
      'Warning! This script should only be intended to run on Bitbucket CI',
    ),
  );
  process.exit(0);
} else {
  main();
}
