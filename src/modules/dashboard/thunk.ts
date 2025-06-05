/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import Logger from 'src/logger';
import { setApiStatus } from 'src/models/appConfig/slice';
import axios from 'src/workspace/axios';
import {
  setFeatureBranches,
  setFigmaComparisonReport,
  setMessage,
  setMetricByProject,
  setNextReleaseData,
  setReleaseData,
  setVmDetails,
} from './slice';

const log = new Logger('Dashboard Thunk');
export const fetchFeatureBranches = createAsyncThunk(
  'fetchFeatureBranches',
  async (_, { dispatch }) => {
    try {
      dispatch(setApiStatus('in_progress'));
      const featureUrlsResponse = await axios(`/frontend/api/featureUrls`);

      dispatch(
        setFeatureBranches({
          ...featureUrlsResponse.data,
        }),
      );

      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchDeployments = createAsyncThunk(
  'fetchDeployments',
  async ({ project }: { project: string }, { dispatch }) => {
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(
        `/frontend/api/bitbucket/deployment/${project}`,
      );
      dispatch(setApiStatus('completed'));
      dispatch(setReleaseData(response.data));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchNextReleaseBranch = createAsyncThunk(
  'fetchNextReleaseBranch',
  async (
    {
      project,
      releaseBranch,
      type,
      confirm,
    }: {
      project: string;
      releaseBranch: string;
      type: 'release' | 'patch';
      confirm: boolean;
    },
    { dispatch },
  ) => {
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios.post(
        `/frontend/api/bitbucket/branch/${project}`,
        {
          releaseBranch,
          type,
          confirm,
        },
      );
      dispatch(setApiStatus('completed'));
      if (confirm) {
        dispatch(setNextReleaseData(null));
        dispatch(fetchDeployments({ project }));
      } else {
        dispatch(setNextReleaseData(response.data));
      }
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchPipelineStatus = createAsyncThunk(
  'fetchDeployments',
  async (
    { project, pipelineId }: { project: string; pipelineId: string },
    { dispatch },
  ) => {
    try {
      dispatch(setApiStatus('in_progress'));
      await axios(`/frontend/api/bitbucket/pipeline/${project}/${pipelineId}`);
      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchMetrics = createAsyncThunk(
  'fetchMetrics',
  async ({ project }: { project: string }, { dispatch }) => {
    // frontend/api/metrics
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(`/frontend/api/metrics/${project}`);
      dispatch(setMetricByProject({ metric: response.data, project }));
      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const deleteCypressRuns = createAsyncThunk(
  'fetchMetrics',
  async (daysValue: number, { dispatch }) => {
    // frontend/api/metrics
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(`/frontend/api/delete/${daysValue}`);
      dispatch(setMessage(response.data.message));
      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const deleteVmCache = createAsyncThunk(
  'deleteVmCache',
  async (_, { dispatch }) => {
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(`/frontend/api/cacheClean`, {
        responseType: 'text',
      });

      let message = '';

      if (response.data) {
        // ✅ Process text data instead of treating it as a stream
        message += response.data;
        dispatch(setVmDetails({ cacheClean: message }));
      }

      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchVmDetails = createAsyncThunk(
  'fetchMetrics',
  async (_, { dispatch }) => {
    // frontend/api/metrics333
    // @ts-ignore
    console.log(COMPONENT_PROPS);
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(`/frontend/api/vmDetails`);
      dispatch(setVmDetails(response.data));
      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

export const fetchFigmaChecks = createAsyncThunk(
  'fetchFigmaChecks',
  async (_, { dispatch }) => {
    try {
      dispatch(setApiStatus('in_progress'));
      const response = await axios(`/frontend/api/figma`);
      dispatch(setFigmaComparisonReport(response.data));
      dispatch(setApiStatus('completed'));
    } catch (error) {
      log.error(error);
      dispatch(setApiStatus('error'));
    }
  },
);

const onActivate = ({ dispatch }) => {
  dispatch(fetchFeatureBranches());
};

export default { onActivate };
