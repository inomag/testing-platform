import { createAsyncThunk } from '@reduxjs/toolkit';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import axios from 'src/workspace/axios';
import { setError, setGuestToken, setIsLoading } from './slice';
import { GuestTokenPayload } from './types';

export const getGuestTokenApi = createAsyncThunk(
  'get/guest-token',
  async (params: GuestTokenPayload, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));

      const response: any = await axios.get('/report-builder/v1/guest-token', {
        params,
      });

      dispatch(setGuestToken(response.data.guest_token));
      dispatch(setIsLoading(false));
    } catch (error: any) {
      // eslint-disable-next-line
      console.error(error);
      dispatch(setIsLoading(false));
      dispatch(
        setError(error?.message || locale(Keys.ERROR_GUEST_TOKEN_FETCH_FAILED)),
      );
    }
  },
);
