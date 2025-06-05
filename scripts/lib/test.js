/* eslint-disable max-lines-per-function */
const util = require('util');

const { exec, execSync } = require('child_process');
const { Listr, delay } = require('listr2');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const { createBoxedText } = require('../utils');
const { getNextVersion } = require('./utils');

const { getAffectedModulesAndApps } = require('../depcruise/index');

const execAsync = util.promisify(exec);

const isAlphaPublish = process.argv.includes('--alpha');

const main = async () => {
  const tasks = new Listr([
    ...(isAlphaPublish
      ? [
          {
            title: 'Check for new commits with respect to previous release',
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
                  'Skipping all subsequent tasks as no change in atoms/blocks/molecules/components affected',
                );
              }
            },
          },
        ]
      : []),

    {
      title: 'Build node package',

      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (ctx, task) => {
        const { stdout, stderr } = await execAsync('npx tsup');
        task.output = JSON.stringify({ stdout, stderr });
        await delay(2000);
      },
    },

    {
      title: 'Create package.json and add dependecncies',
      skip: (ctx) => ctx.skipRemainingTasks,
      task: async (_, task) => {
        let cmd = 'node scripts/lib/addPackageDetails.js --test';
        if (isAlphaPublish) {
          cmd = 'node scripts/lib/addPackageDetails.js --alpha';
        }
        const { stdout, stderr } = await execAsync(cmd);
        task.output = JSON.stringify({ stdout, stderr });
        await delay(2000);
      },
    },

    ...(!isAlphaPublish
      ? [
          {
            title: 'Yarn link (create yarn symbolic link on machine)',
            skip: (ctx) => ctx.skipRemainingTasks,
            task: async () => {
              execSync(
                `cd ${path.join(
                  process.cwd(),
                  'dist',
                )}  && yarn unlink && yarn link`,
              );

              console.log(
                createBoxedText(
                  'cyanBright',
                  'next unreleased version will be',
                  chalk.cyan.bold(
                    JSON.parse(
                      fs.readFileSync(
                        path.join(process.cwd(), 'dist', 'package.json'),
                      ),
                    ).version,
                  ),
                ),
              );
              console.log(
                chalk.yellow.bold(
                  `\nRun "yarn add ${path.join(
                    process.cwd(),
                    'dist',
                  )}" in the root directory of the consuming project for testing.\n`,
                ),

                chalk.cyan.bold(
                  '\n-----------------------------For Feature Branch Url testing, node module can be published as alpha ----------------------------------\n',
                ),

                chalk.green.bold(
                  '\nTo publish module as alpha version run "yarn @vymo/ui:test --alpha".',
                ),

                chalk.cyan.bold(
                  '\n---------------------------------------------------------------\n',
                ),

                chalk.bgRed.bold(
                  '\nFYI - To remove the node module do "yarn remove @vymo/ui" and "yarn add @vymo/ui" to take the node module form cloud registry (npm)\n',
                ),
              );

              await delay(2000);
            },
          },
        ]
      : []),

    ...(isAlphaPublish
      ? [
          {
            title: 'Publish alpha version of node package',
            skip: (ctx) => ctx.skipRemainingTasks,
            task: async (ctx, task) => {
              task.output = await execAsync(
                'npm publish --tag alpha  --registry http://4.240.91.27:4873/',
                {
                  cwd: path.join(process.cwd(), 'dist'),
                  stdio: 'inherit',
                  shell: true,
                },
              );
              ctx.version = JSON.parse(
                fs.readFileSync(
                  path.join(process.cwd(), 'dist', 'package.json'),
                ),
              ).version;

              console.log(
                createBoxedText(
                  'cyanBright',
                  'Release version is',
                  chalk.cyan.bold(ctx.version),
                ),
              );
              console.log(
                chalk.green('Run yarn add @vymo/ui@alpha to install the same'),
              );
              await delay(2000);
            },
          },
          {
            title: 'Add Version Tag',
            skip: (ctx) => ctx.skipRemainingTasks,
            task: async (ctx, task) => {
              task.output = execSync(
                `git tag -a "@vymo/ui/${ctx.version}" -m "Version ${ctx.version}" && git push`,
              );
              await delay(2000);
            },
          },
        ]
      : []),
  ]);

  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
