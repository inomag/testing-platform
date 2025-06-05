import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type LmsLoginAuthState = {
  config: any;
};

const initialState: LmsLoginAuthState = {
  config: {},
};

export const lmsAuthSLice = createSlice({
  name: 'lmsAuth',
  initialState,
  reducers: {
    loadLmsConfig: (
      state,
      action: PayloadAction<LmsLoginAuthState['config']>,
    ) => {
      state.config = action.payload;
    },
  },
});

export const { loadLmsConfig } = lmsAuthSLice.actions;

const reducer = { lmsAuth: lmsAuthSLice.reducer };

export default reducer;
