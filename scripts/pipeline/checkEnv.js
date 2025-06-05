// usuage node checkEnv.js --appEnv=staging

const terminalArgs = process.argv;
const appEnv = terminalArgs
  .filter((arg) => arg.indexOf('--appEnv') > -1)?.[0]
  .split('--appEnv=')?.[1];

if (process.env.deployEnvironment && process.env.deployEnvironment !== appEnv) {
  console.log(`Environment is not ${appEnv}.`);
  process.exit(0);
}
