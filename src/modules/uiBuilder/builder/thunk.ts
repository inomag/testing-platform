/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { renderModule } from 'src/workspace/slice';
import { getProjectTemplateByName } from '../queries';
import {
  addNotifications,
  setProjectData,
  setProjectJira,
  setPublishData,
} from '../slice';
import { UIBuilderState } from '../types';
import { getTemplates } from '../utils';

const prettier = require('prettier');

const { format } = prettier;

const TARGET_BRANCH = 'master';
const FOLDER_PATH = 'src/modules/uiBuilder/templates/selfServe';

// const { BITBUCKET_USER_NAME, BITBUCKET_APP_PASSWORD, WORKSPACE, REPO_SLUG } =
//   process.env;

const {
  BITBUCKET_USER_NAME = 'Harshit-886',
  BITBUCKET_APP_PASSWORD = 'ATBB9hqKqqfucftsNnmJtAamTHB21C241A05',
  WORKSPACE = 'vymo',
  REPO_SLUG = 'vymo-web-platform',
} = process.env;

const axiosClient = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  auth: {
    username: BITBUCKET_USER_NAME as string,
    password: BITBUCKET_APP_PASSWORD as string,
  },
});

const commitFile = async (payload: UIBuilderState['project']['selfserve']) => {
  const FILE_PATH = `${FOLDER_PATH}/${payload.code}.json`;
  const NEW_BRANCH = `templateUI/${payload.jira.id}`;
  const formData = new FormData();
  let prettifiedJson = JSON.stringify(payload, null, 2);
  try {
    prettifiedJson = await format(JSON.stringify(payload), {
      parser: 'json',
      singleQuote: false,
      printWidth: 80,
      trailingComma: 'all',
      tabWidth: 2,
      useTabs: false,
    });
    prettifiedJson = `${prettifiedJson.trim()}\n`; // Ensure newline at EOF
  } catch (e) {
    console.log(e);
  }

  const file = new File(
    [
      new Blob([prettifiedJson], {
        type: 'application/json',
      }),
    ],
    `${payload.name}.json`,
  );
  formData.append('branch', NEW_BRANCH);
  formData.append('message', `${NEW_BRANCH}: Commit from AppBuilder`);
  formData.append(FILE_PATH, file);

  return axiosClient.post(
    `https://api.bitbucket.org/2.0/repositories/${WORKSPACE}/${REPO_SLUG}/src`,
    formData,
  );
};

const checkPipelineStatus = async (PR_ID) => {
  const response = await axiosClient.get(
    `https://api.bitbucket.org/2.0/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests/${PR_ID}/statuses`,
  );

  const statuses = response.data.values;

  if (statuses.length === 0) {
    console.log('No pipeline statuses found for this PR.');
    return '';
  }

  const isFailedAny = statuses.find(({ state }) => state === 'FAILED');

  if (isFailedAny) {
    return 'FAILED';
  }

  const isProgressAny = statuses.find(({ state }) => state === 'INPROGRESS');

  if (isProgressAny) {
    return 'INPROGRESS';
  }

  const isAllCompleted = statuses.every(({ state }) => state === 'COMPLETED');

  if (isAllCompleted) {
    return 'COMPLETED';
  }

  // eslint-disable-next-line consistent-return
  return 'UNKOWN_STATUS';
};

const pipelinePolling = async (prId, dispatch) => {
  if (!prId) {
    return;
  }

  const pipelineInterval = setInterval(async () => {
    dispatch(
      addNotifications({
        id: 'liveUrl',
        variant: 'info',
        message: locale(Keys.BUILD_IN_PROGRESS),
      }),
    );
    const pipelineStatus = await checkPipelineStatus(prId);
    if (pipelineStatus === 'COMPLETED') {
      dispatch(
        addNotifications({
          id: 'liveUrl',
          variant: 'default',
          message: locale(Keys.BUILD_IS_DONE),
        }),
      );

      dispatch(
        setPublishData({
          status: 'completed',
        }),
      );
      clearInterval(pipelineInterval);
    }

    if (pipelineStatus === 'FAILED') {
      dispatch(
        addNotifications({
          id: 'liveUrl',
          variant: 'error',
          message: locale(Keys.BUILD_IS_FAILED),
        }),
      );
      dispatch(
        setPublishData({
          status: 'error',
        }),
      );
      clearInterval(pipelineInterval);
    }
  }, 20000);
};

// Helper to check for open PRs
const checkOpenPR = async (NEW_BRANCH: string) => {
  const prCheckResponse = await axiosClient.get(
    `/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests?q=source.branch.name="${NEW_BRANCH}" AND state="OPEN"`,
  );
  return prCheckResponse.data.values;
};

const createPullRequest = async (
  payload: UIBuilderState['project']['selfserve'],
  NEW_BRANCH: string,
) =>
  axiosClient.post(`/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests`, {
    title: `feat: ${payload.name}`,
    source: {
      branch: {
        name: NEW_BRANCH,
      },
    },
    destination: {
      branch: {
        name: TARGET_BRANCH,
      },
    },
    description: `This PR adds a new feature ${payload.name} from APP Builder`,
  });

export const publishBranch = createAsyncThunk(
  'publishBranch',
  async (payload: UIBuilderState['project']['selfserve'], { dispatch }) => {
    const NEW_BRANCH = `templateUI/${payload.jira.id}`;
    try {
      dispatch(
        setPublishData({
          status: 'in_progress',
        }),
      );

      const commitResponse = await commitFile(payload);
      console.log('Commit created:', commitResponse.data.hash);

      dispatch(
        addNotifications({
          id: `${Math.random()}`,
          variant: 'default',
          message: locale(Keys.COMMIT_DONE_AT, {
            date: new Date().toLocaleString(),
          }),
        }),
      );

      const existingPR = await checkOpenPR(NEW_BRANCH);
      let prLink = '';
      let prId = '';
      if (existingPR.length > 0) {
        const pr = existingPR[0];
        prLink = pr.links.html.href;
        prId = pr.id;
      } else {
        console.log('Creating a pull request...');
        const prResponse = await createPullRequest(payload, NEW_BRANCH);
        prLink = prResponse.data.links.html.href;
        prId = prResponse.data.id;
        dispatch(
          addNotifications({
            id: 'prCreated',
            variant: 'success',
            message: locale(Keys.PULL_REQUEST_CREATED, { prLink }),
          }),
        );
      }

      pipelinePolling(prId, dispatch);
      dispatch(
        setPublishData({
          pr: prLink,
          prId,
          status: 'completed',
          commitsSync: 0,
        }),
      );
    } catch (e: any) {
      let error = e.message;
      if (e?.response?.data?.error) {
        error = e.response.data.error.message;
      }
      dispatch(
        setPublishData({
          status: 'error',
        }),
      );
      dispatch(
        addNotifications({
          id: 'commit',
          variant: 'error',
          message: locale(Keys.GENERIC_ERROR_MESSAGE, { error }),
        }),
      );
    }
  },
);

export const validateJiraId = createAsyncThunk(
  'publishCommit',
  async (jiraId: string, { dispatch }) => {
    const apiEndpoint = `http://4.240.91.27:3000/frontendBoard/api/validateJira/${jiraId}`;
    dispatch(setProjectJira({ id: jiraId, validated: 'in_progress' }));
    try {
      const response = await axios.get(apiEndpoint);

      console.log(
        `Jira ID ${jiraId} is valid. Issue Summary: ${response.data}`,
      );

      const NEW_BRANCH = `templateUI/${jiraId}`;

      await axiosClient.post(
        `/repositories/${WORKSPACE}/${REPO_SLUG}/refs/branches`,
        {
          name: NEW_BRANCH,
          target: {
            hash: TARGET_BRANCH,
          },
        },
      );

      dispatch(
        setPublishData({
          status: 'not_started',
          branch: NEW_BRANCH,
        }),
      );

      dispatch(setProjectJira({ id: jiraId, validated: 'completed' }));
    } catch (responseError: any) {
      const { error } = responseError.response.data;
      dispatch(
        setProjectJira({
          id: jiraId,
          validated: 'error',
          error: error?.message ?? error,
        }),
      );
    }
  },
);

const onActivate = async ({ dispatch, props }) => {
  const { appProjectName } = props;
  if (appProjectName) {
    const templates = await getTemplates();
    const selectedTemplateData = getProjectTemplateByName(
      templates,
      appProjectName,
    );
    if (selectedTemplateData && selectedTemplateData.isDraft) {
      dispatch(setProjectData(selectedTemplateData));
      pipelinePolling(selectedTemplateData.publish.prId, dispatch);
    } else {
      dispatch(
        renderModule({
          id: 'UI_BUILDER_HOME',
          props: {},
        }),
      );
    }
  }
};

const onDeactivate = () => {};

export default { onActivate, onDeactivate };
