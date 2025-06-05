// this script will stop any previous running pipeline for the current branch.
const axios = require('axios');

const {
  BITBUCKET_USER_NAME,
  BITBUCKET_APP_PASSWORD,
  WORKSPACE,
  REPO_SLUG,
  BITBUCKET_BRANCH,
} = process.env;
const client = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  auth: {
    username: BITBUCKET_USER_NAME,
    password: BITBUCKET_APP_PASSWORD,
  },
});
async function main() {
  const res = await client.get(
    `/repositories/${WORKSPACE}/${REPO_SLUG}/pipelines/?target.branch=${BITBUCKET_BRANCH}&status=BUILDING&status=PENDING`,
  );
  if (res.data.values.length < 2) {
    // Skip if only one pipeline running
    return;
  }
  const pipelinesByType = {};

  Object.values(res.data.values).forEach((pipeline) => {
    const { pattern, type } = pipeline.target.selector || {};
    const pipelineCode = `${pattern}_${type}`;
    if (!(pipelineCode in pipelinesByType)) {
      pipelinesByType[pipelineCode] = [];
    }
    pipelinesByType[pipelineCode].push(pipeline);
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const pipelines of Object.values(pipelinesByType)) {
    pipelines.forEach(async (pipeline, index) => {
      if (index + 1 !== pipelines.length) {
        const { uuid } = pipeline;
        // eslint-disable-next-line no-await-in-loop
        try {
          await client.post(
            `/repositories/${WORKSPACE}/${REPO_SLUG}/pipelines/${uuid}/stopPipeline`,
          );
        } catch (e) {
          console.error(`Failed to stop pipeline ${uuid}`);
        }
      }
    });
  }
}
main();
