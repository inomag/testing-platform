import { createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  clearCurrentUser,
  setIsFirstTimeLogin,
} from 'src/modules/authLegacy/queries';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  setAuthenticated,
  setError,
  setIsOtpFlow,
  setIsOTPSent,
} from 'src/modules/authLegacy/slice';
import axios from 'src/workspace/axios';
import {
  setLoading,
  setMessage,
  setError as setOtpError,
  setVerified,
} from './slice';

export const verifyOtp = createAsyncThunk(
  'verify/otp',
  async (arg: { payload: any; uid: string }, { dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setOtpError(''));
    const { payload, uid } = arg;
    try {
      const { data: response }: any = await axios.post(
        `/portal/authenticate?portalId=${window.portalId ?? ''}`,
        payload,
        {
          headers: {
            uid,
          },
        },
      );
      if (response?.status === 400) {
        dispatch(setLoading(false));
        if (response?.error_code === 'flow_not_locked') {
          dispatch(setError(response?.message));
          clearCurrentUser();
          dispatch(setIsOTPSent(false));
        } else if (response?.error_code) {
          dispatch(setOtpError(response?.message));
        }
      }
      if (response?.status === 200) {
        dispatch(setVerified(true));
        dispatch(setLoading(false));
        dispatch(setMessage(response?.message));
        setIsFirstTimeLogin(response?.first_time_login);
        dispatch(setAuthenticated(true));
        dispatch(setIsOtpFlow(false));
        dispatch(setIsOTPSent(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError('Something went wrong'));
    }
  },
);
