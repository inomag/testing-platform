/* eslint-disable max-lines-per-function */
const util = require('util');

const { exec } = require('child_process');
const { Listr, delay } = require('listr2');

const { getAffectedModulesAndApps } = require('../depcruise/index');

const execAsync = util.promisify(exec);

const main = async () => {
  const tasks = new Listr([
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
      title: 'Run Chromatic for visual check',

      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        const { stdout, stderr } = await execAsync('yarn chromatic');
        task.output = JSON.stringify({ stdout, stderr });
        await delay(2000);
      },
    },
  ]);

  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
  }
};

main();
