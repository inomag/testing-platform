// Ensure environment variables are read.

const inquirer = require('inquirer');
const { initializeNewapp } = require('./initializeNewApp');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Select the Option',
      default: 'all',
      choices: [{ code: 'newApp', name: 'Initailize New App' }],
    },
  ])
  .then((answer) => {
    switch (answer.option) {
      case 'Initailize New App':
        initializeNewapp();
        break;

      default:
        break;
    }
  });
