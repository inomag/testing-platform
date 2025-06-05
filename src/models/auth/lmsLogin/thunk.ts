import { createAsyncThunk } from '@reduxjs/toolkit';
import Logger from 'src/logger';
import { setAxiosInstanceAuthToken } from 'src/workspace/axios';
import { getClientConfigData } from 'src/workspace/utils';
import { loadLmsConfig } from './slice';

const log = new Logger('lmsLogin Thunk');

export const initLmsConfig = createAsyncThunk(
  'lmsLogin/config',
  (arg, { dispatch }) => {
    const configData = getClientConfigData();
    if (configData) {
      if (!configData.auth_token) {
        return;
      }
      dispatch(loadLmsConfig(configData));
      setAxiosInstanceAuthToken(configData.auth_token);
    } else {
      log.error('Config is not present in localstorage');
    }
  },
);
