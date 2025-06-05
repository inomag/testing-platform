import { createAsyncThunk } from '@reduxjs/toolkit';
import { getState } from 'src/store';
import axios from 'src/workspace/axios';
import { getClientConfigData, getModuleProps } from 'src/workspace/utils';
import { getProjectData } from '../selectors';
import { setRunnerApiStatus } from '../slice';

export const onSaveApplyConfig = createAsyncThunk(
  'applyConfig',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_payload, { dispatch }) => {
    const apiEndpoint = '/admin/config/apply';

    const projectData = getProjectData(getState());
    const currentDraftVersion = getModuleProps()?.getConfigLatestVersion?.();
    const { url } = projectData.templateConfig.api;

    dispatch(setRunnerApiStatus('in_progress'));

    try {
      const response = await axios.post(apiEndpoint, {
        changes: [
          {
            data: projectData.config,
            clientCode: getClientConfigData().client,
            reference: url,
          },
        ],
        version: currentDraftVersion,
        group: 'global_settings',
        component: projectData.code,
      });
      // eslint-disable-next-line no-console
      const { draftVersion, topDraftVersion, version } = response.data;
      getModuleProps()?.setConfigVersion({
        version,
        draftVersion,
        topDraftVersion,
      });
      dispatch(setRunnerApiStatus('completed'));
    } catch (responseError: any) {
      const { error } = responseError.response.data;
      dispatch(setRunnerApiStatus('error'));
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onActivate = async ({ dispatch, props }) => {
  const projectData = getProjectData(getState());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { url } = projectData.templateConfig.api;
};
const onDeactivate = () => {};

export default { onActivate, onDeactivate };
