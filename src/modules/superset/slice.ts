import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SupersetState } from './types';

const initialState: SupersetState = {
  isLoading: false,
  guestToken: null,
  error: null,
};

export const supersetSlice = createSlice({
  name: 'superset',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setGuestToken(state, action: PayloadAction<string>) {
      state.guestToken = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setIsLoading, setGuestToken, setError } = supersetSlice.actions;

const reducer = { superset: supersetSlice.reducer };

export default reducer;
