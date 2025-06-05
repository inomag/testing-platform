import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/workspace/axios';
import { setSessionLivelinesss } from './slice';

export const checkLiveliness = createAsyncThunk(
  'checkLiveliness',
  async (_, { dispatch }) => {
    try {
      const response: any = await axios.get('/portal/recruitment/liveliness');
      if (response?.data?.code !== 'ACTIVE_SESSION') {
        dispatch(setSessionLivelinesss(false));
      }
    } catch (error) {
      dispatch(setSessionLivelinesss(false));
    }
  },
);
