/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setMessage,
  setOtpConfig,
  setError as setOtpFlowError,
  setOtpResendsRemaining,
} from 'src/models/authLegacy/otp/slice';
import axios from 'src/workspace/axios';
import { clearCurrentUser, getOtpConfig, updateCurrentUser } from './queries';
import {
  setAuthenticated,
  setAuthMethod,
  setError,
  setIsLoading,
  setIsOtpFlow,
  setIsOTPSent,
} from './slice';
import { AuthMethod } from './types';

export const checkAuthStatus = () => async (dispatch) => {
  try {
    // const response = await fetch('/api/auth/status');
    // const data = await response.json();
    const data = {
      isAuthenticated: false,
      authMethod: 'Phone' as AuthMethod,
    };

    if (data.isAuthenticated) {
      dispatch(setAuthenticated(true));
      // } else {
      // }
    }
    dispatch(setAuthMethod(data.authMethod));
  } catch (error) {
    console.error(error);
  }
};

export const sendOtp = createAsyncThunk(
  'send/otp',
  async ({ payload, type }: any, { dispatch }) => {
    dispatch(setIsLoading(true));
    dispatch(setIsOtpFlow(true));
    dispatch(setOtpFlowError(''));

    try {
      const { data: response }: any = await axios.post(
        `/portal/otp?portalId=${window.portalId ?? ''}`,
        payload,
      );
      if (response?.status === 200) {
        const message = response?.message;
        const otpConfig = response?.otp;
        const requestId = otpConfig?.requestId;
        updateCurrentUser({ requestId }, type === 'resend');
        const otpConfigData = getOtpConfig(otpConfig?.metadata);
        dispatch(setMessage(message));
        dispatch(setOtpConfig(otpConfigData));
        dispatch(setIsLoading(false));
        dispatch(setIsOTPSent(true));
        dispatch(setOtpResendsRemaining(response?.resend_attempts_remaining));
      }
      if (response?.status === 400) {
        dispatch(setIsLoading(false));
        dispatch(setIsOTPSent(false));
        if (response?.error_code === 'flow_not_locked') {
          dispatch(setError(response?.message));
          clearCurrentUser();
          dispatch(setIsOTPSent(false));
        } else {
          dispatch(setError(response?.message));
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(setIsLoading(false));
      dispatch(setIsOTPSent(false));
      dispatch(setError('Something went wrong'));
    }
  },
);
