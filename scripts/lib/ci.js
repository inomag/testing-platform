/* eslint-disable max-lines-per-function */

const chalk = require('chalk');

const { Listr } = require('listr2');

const { execSync } = require('child_process');
const { getAffectedModulesAndApps } = require('../depcruise/index');
const { getPrDetails } = require('../pipeline/api');

const main = async () => {
  const tasks = new Listr([
    {
      title: 'Check for atoms/blocks/molecules/components change',
      task: async (ctx, task) => {
        const {
          atomsAffected,
          blocksAffected,
          componentsAffected,
          moleculesAffected,
        } = await getAffectedModulesAndApps();
        if (
          atomsAffected.length === 0 &&
          blocksAffected.length === 0 &&
          moleculesAffected.length === 0 &&
          componentsAffected.length === 0
        ) {
          ctx.skipRemainingTasks = true;
          task.skip(
            'Skipping all subsequent tasks as no change in atoms/blocks/molecules',
          );
        }
      },
    },

    {
      title: 'Check for Pr title',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        try {
          const prData = await getPrDetails();
          const regex = /\b(fix|feat|scope|revert)\b/;
          if (!regex.test(prData.title)) {
            ctx.skipRemainingTasks = true;
            task.skip(
              'Pr title should contain fix, feat, revert  or scope for @vymo/ui to publish.',
            );
            throw new Error(
              'Pr title should contain fix, feat,revert or scope! for @vymo/ui to publish.',
            );
          }
        } catch (e) {
          throw new Error(e);
        }
      },
    },

    {
      title: 'Check for module build',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async () => {
        try {
          execSync('npx tsup');
        } catch (e) {
          throw new Error(e);
        }
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
