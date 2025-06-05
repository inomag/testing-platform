const { execSync } = require('child_process');
const path = require('path');
const { getArtifactFile, postOrUpdateComment } = require('./api');

const { getAffectedModulesAndApps } = require('../depcruise');

const { BITBUCKET_PR_ID, BITBUCKET_BRANCH } = process.env;

const STAGING_URL = 'https://staging.lms.getvymo.com';
const coverageUrl = `${STAGING_URL}/web-platform/branch/${BITBUCKET_BRANCH}/coverage/index.html`;

async function main() {
  const regex = /\n/g;
  const coverageSummary = execSync('npx nyc report --reporter text-summary')
    .toString()
    .replace(regex, ' \n\n');

  const {
    appsAffected: appsToCompile,
    modulesAffected,
    atomsAffected,
    blocksAffected,
    moleculesAffected,
    componentsAffected,
  } = await getAffectedModulesAndApps();

  const affectedDesignLang = [
    ...atomsAffected,
    ...blocksAffected,
    ...moleculesAffected,
    ...componentsAffected,
  ]
    // eslint-disable-next-line no-shadow
    .filter((path) => !path.includes('integration')) // filter the integration (Cypress) files
    .join('\n\n');

  const rawData = `*This comment is auto-generated* -- ${new Date().toLocaleString()} \n
**APPs Affected** \n
${appsToCompile} \n
**Modules Affected** \n
${modulesAffected.join('\n\n')} \n
**Design Language Affected** \n
${affectedDesignLang} \n

${
  affectedDesignLang.length > 0
    ? '![#c5f015](https://placehold.co/15x15/c5f015/c5f015.png) ![@vymo/ui](http://4.240.91.27:4873/-/web/detail/@vymo/ui) will be published'
    : ''
}

[**Coverage Report**](${coverageUrl}) 
${`\`\`\`${coverageSummary}\`\`\``}
`;

  const commentFilePath = path.join(
    __dirname,
    `commentId_${BITBUCKET_PR_ID}.txt`,
  );

  const bodyData = { content: { raw: rawData } };
  const commentID = await getArtifactFile();
  await postOrUpdateComment(commentID, commentFilePath, bodyData);
}

main();
