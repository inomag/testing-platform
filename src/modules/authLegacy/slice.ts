import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Module } from 'src/modules/types';
import { AuthMethod } from './types';

export type AuthState = {
  isAuthenticated: boolean;
  authMethod: AuthMethod | null;
  modules: Array<Module>;
  redirectPath: string;
  fullPage: boolean;
  loading: boolean;
  isOTPflow: boolean;
  isOTPSent: boolean;
  error: string;
  isFirstTimeLogin: boolean;
  uid: string;
};

const initialState: AuthState = {
  isAuthenticated: false,
  authMethod: null,
  modules: [],
  redirectPath: '',
  fullPage: false,
  loading: false,
  isOTPflow: false,
  isOTPSent: false,
  error: '',
  isFirstTimeLogin: false,
  uid: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setAuthMethod(state, action: PayloadAction<AuthMethod>) {
      state.authMethod = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setIsOtpFlow(state, action: PayloadAction<boolean>) {
      state.isOTPflow = action.payload;
    },
    setIsOTPSent(state, action: PayloadAction<boolean>) {
      state.isOTPSent = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setFirstTimeLogin(state, action: PayloadAction<boolean>) {
      state.isFirstTimeLogin = action.payload;
    },
    setUid: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setAuthMethod,
  setIsLoading,
  setIsOtpFlow,
  setIsOTPSent,
  setError,
  setUid,
} = authSlice.actions;

const reducer = { legacyAuth: authSlice.reducer };

export default reducer;
