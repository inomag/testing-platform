/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setApiStatus, setErrorMessage } from 'src/models/appConfig/slice';
import { getPortalMedium } from 'src/models/stepper/queries';
import { getState } from 'src/store';
import axios from 'src/workspace/axios';
import { isWebPlatform } from 'src/workspace/utils';
import { getMetaData, getVymoUserToken } from './selectors';
import { setMetaData } from './slice';

export const sendOtp = createAsyncThunk(
  'send/otp',
  async ({ payload }: any, { dispatch }) => {
    dispatch(setApiStatus('in_progress'));
    try {
      const metaData = getMetaData(getState());
      const headers = isWebPlatform()
        ? {
            portalId: window.portalId,
            medium: getPortalMedium(),
            'x-vymo-user-token': getVymoUserToken(getState()),
          }
        : {
            client: window.portalId,
            medium: getPortalMedium(),
            'x-vymo-user-token': getVymoUserToken(getState()),
          };
      const { data: response }: any = await axios.post(
        `/portal/otp?portalId=${window.portalId ?? ''}`,
        payload,
        {
          headers,
        },
      );
      if (response?.status === 200) {
        dispatch(setApiStatus('completed'));
        const message = response?.message;
        const otpConfig = response?.otp;
        const otpConfigData = otpConfig?.metadata;
        const newMetaData = {
          requestId: otpConfig.requestId,
          phone: metaData.phone,
          countryCode: metaData.countryCode,
          client: metaData.client,
          message,
          numberOfDigits: otpConfigData?.otp_length,
          verificationAttemptsRemaining:
            response.verification_attempts_remaining,
          resendAttemptsRemaining: response.resend_attempts_remaining,
          resendOTPConfig: {
            enabled: otpConfigData.resendOTPConfig?.enabled,
            interval: otpConfigData.resendOTPConfig?.interval,
            backoff: otpConfigData.resendOTPConfig?.backoff,
          },
        };
        dispatch(setMetaData(newMetaData));
      }
      if (response?.status === 400) {
        dispatch(setApiStatus('error'));
        dispatch(setErrorMessage(response?.message));
      }
    } catch (error) {
      console.error(error);
      dispatch(setApiStatus('error'));
      dispatch(setErrorMessage('Something went wrong'));
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (payload: { api: string }, { dispatch }) => {
    try {
      dispatch(setApiStatus('in_progress'));
      await axios.get(payload.api);
      dispatch(setApiStatus('completed'));
      window.location.href = '';
    } catch (error) {
      dispatch(setApiStatus('error'));
    }
  },
);
