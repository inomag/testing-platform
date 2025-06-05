/* eslint-disable max-lines-per-function */
const inquirer = require('@inquirer/prompts');
const {
  ListrInquirerPromptAdapter,
} = require('@listr2/prompt-adapter-inquirer');
const { Listr, delay } = require('listr2');
const util = require('util');
const chalk = require('chalk');
const { exec } = require('child_process');
const _ = require('lodash');
const { createNewApp, getPortalAppFolderPath } = require('./utils');
const { createBoxedText, isWorkingTreeClean } = require('../../utils');

const execAsync = util.promisify(exec);

const initializeNewapp = async () => {
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
      title: 'Get App Info',
      task: async (ctx, task) => {
        const prompt = task.prompt(ListrInquirerPromptAdapter);

        ctx.appName = await prompt.run(inquirer.input, {
          message: 'Enter the App name (e.g. recruitment, copilot)',
          validate: (value) => {
            if (!value) {
              return 'App name is required';
            }
            if (_.camelCase(value) !== value) {
              return 'App name should be in camelCase';
            }

            if (/^\w+(?:_\w+)*\s\w+(?:_\w+)*$/.test(value)) {
              return 'App name cannot have space and special chars. Use camelCase or _ instead of space';
            }
            return true;
          },
        });

        ctx.htmlTemplate = await prompt.run(inquirer.confirm, {
          message: 'Use default index.html template?',
          default: true,
        });

        ctx.appOutputType = await prompt.run(inquirer.select, {
          message:
            'Enter the App Type. Form more info refer - https://teamvymo.atlassian.net/wiki/x/0IDHx',
          choices: [
            {
              value: 'html',
              name: 'Generic Html',
              description: '',
            },
            { value: 'clientHtml', name: 'Client Specific Html' },
            { value: 'script', name: 'Script' },
          ],
        });

        ctx.templateType = await prompt.run(inquirer.select, {
          message: 'Enter the App Template',
          choices: [
            {
              value: 'default',
              name: 'Default',
              description: 'No module will be added to app',
            },
          ],
        });
      },
    },
    {
      title: 'Creating App',
      task: async (ctx, task) => {
        task.output = createNewApp(
          ctx.appName,
          ctx.appOutputType,
          ctx.templateType,
        );
      },
    },

    {
      title: 'Fixing Code Style',
      task: async () => {
        await execAsync('yarn pretty');
        await execAsync('yarn lint --fix');
      },
    },

    {
      title: 'Check for Code Formatting',
      task: async (ctx, task) => {
        const { stdout } = await execAsync('yarn lint');
        task.output = stdout;
        await delay(2000);

        const { stdout: stdoutPrettier } = await execAsync(
          'yarn prettier:check',
        );
        task.output = stdoutPrettier;
        await delay(2000);

        const { stdout: stdoutTS } = await execAsync('yarn ts');
        task.output = stdoutTS;
        await delay(2000);

        const appPath = getPortalAppFolderPath(ctx.appName);
        console.log(
          createBoxedText(
            'green',
            `App ${ctx.appName} created successfully`,
            `Check the contents at ${appPath}`,
          ),
        );

        console.log('Run', chalk.green.bold('yarn start'), 'to access the app');

        if (!ctx.htmlTemplate) {
          console.log(
            'Modify the',
            chalk.yellow.bold(
              `${appPath}/index.html`,
              'file as per your requirement',
            ),
          );
        }
      },
    },
  ]);

  try {
    await tasks.run();
  } catch (e) {
    console.error(e);
  }
};

module.exports = { initializeNewapp };
