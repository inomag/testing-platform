import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { getState } from 'src/store';
import { getRequestHeaders } from '../thunk';

export const saveDraft = createAsyncThunk(
  'saveDraft',
  async (payload: { apiPath: any; payload: any }) => {
    try {
      const isUserAuthenticated = getUserAuthenticated(getState());
      axios.post(payload.apiPath, payload.payload, {
        headers: getRequestHeaders(isUserAuthenticated),
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn('Error while saving draft', error);
    }
  },
);
