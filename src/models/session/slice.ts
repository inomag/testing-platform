import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionState } from './types';

const initialState: SessionState = {
  timeout: 0,
  isSessionAlive: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTimeout: (state, action: PayloadAction<number>) => {
      state.timeout = action.payload;
    },
    setSessionLivelinesss: (state, action: PayloadAction<boolean>) => {
      state.isSessionAlive = action.payload;
    },
  },
});

export const { setTimeout, setSessionLivelinesss } = sessionSlice.actions;

const reducer = { session: sessionSlice.reducer };

export default reducer;
