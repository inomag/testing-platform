import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAppTheme } from 'src/designTokens/themes/utils';
// eslint-disable-next-line vymo-ui/restrict-import
import { deleteItem } from 'src/indexDb/db';
import { setPortalConfig } from 'src/models/portalConfig/slice';
import { setTimeout } from 'src/models/session/slice';
import {
  resetStepperFormStatus,
  setIsInitialised,
} from 'src/models/stepperFormLegacy/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { setAuthenticated } from 'src/modules/authLegacy/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { API_STATUS } from 'src/modules/recruitment/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  resetState as resetRecruitmentState,
  setApiError,
  setApiStatus,
  setFlow,
  setInitResponse,
} from 'src/modules/recruitment/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { InitPayload } from 'src/modules/recruitment/types';
import axios from 'src/workspace/axios';
import {
  resetState as resetRecruitmentMetaState,
  setIsAssistedOnboarding,
} from './slice';

export const logoutAPI = createAsyncThunk('logout', async (_, { dispatch }) => {
  try {
    dispatch(setApiStatus(API_STATUS.PENDING));
    dispatch(setAuthenticated(false));
    await deleteItem('autosave');
    await axios.get('/portal/recruitment/logout');
    dispatch(setApiStatus(API_STATUS.UNAUTHORIZED));
    dispatch(resetRecruitmentState());
  } catch (error) {
    dispatch(setApiStatus(API_STATUS.SERVER_ERROR));
  }
});

export const resetState = createAsyncThunk('reset', async (_, { dispatch }) => {
  dispatch(resetRecruitmentState());
  dispatch(resetRecruitmentMetaState());
});

export const initAPI = createAsyncThunk(
  'init',
  async ({ payload }: InitPayload, { dispatch }) => {
    try {
      const { queryParam, headers } = payload;
      dispatch(resetState());
      dispatch(resetStepperFormStatus());
      dispatch(setApiStatus(API_STATUS.PENDING));
      dispatch(setIsInitialised(false));
      const url = `/portal/recruitment/init?${queryParam ?? ''}`;
      // @ts-ignore
      const response: any = await axios.get(url, { headers });
      dispatch(setApiStatus(API_STATUS.SUCCESS));
      if (response?.headers['x-vymo-portal-session-interval']) {
        dispatch(
          setTimeout(response?.headers['x-vymo-portal-session-interval']),
        ); // set timeout in milliseconds for session
      }
      if (response.data.message === 'success') {
        const responseData = response.data;
        const {
          result: {
            page: {
              component: { type },
            },
            isAssistedOnboarding,
          },
          client,
          portalConfig,
        } = responseData;
        dispatch(setFlow(type));
        dispatch(setInitResponse(response.data));
        dispatch(setAuthenticated(true));
        dispatch(setPortalConfig({ client, portalConfig }));
        dispatch(setIsAssistedOnboarding(isAssistedOnboarding));
        updateAppTheme(portalConfig?.branding?.theme);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        dispatch(setApiStatus(API_STATUS.UNAUTHORIZED));
        dispatch(resetState());
        dispatch(setPortalConfig(error.response.data));
        updateAppTheme(error.response.data?.portalConfig?.branding?.theme);
      } else if (
        error.response.status === 500 ||
        error.response.status === 404 ||
        error.response.status === 502
      ) {
        dispatch(setApiStatus(API_STATUS.SERVER_ERROR));
      } else if (error.response.status === 400) {
        dispatch(setApiStatus(API_STATUS.BAD_REQUEST));
        dispatch(setApiError(error.response.data.error));
      } else {
        dispatch(setApiStatus(API_STATUS.VALIDATION_ERROR));
        dispatch(setApiError(error.response.data.error));
      }
      dispatch(setAuthenticated(error.response?.status !== 401));
    }
  },
);
