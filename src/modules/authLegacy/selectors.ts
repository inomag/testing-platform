import { RootState } from 'src/store';

const getAuthState = (state: RootState) => state?.legacyAuth;

export const getIsLoading = (state: RootState) => state?.legacyAuth?.loading;

export const getIsOtpFlow = (state: RootState) => state?.legacyAuth?.isOTPflow;

export const getIsOtpSent = (state: RootState) => state?.legacyAuth?.isOTPSent;

export const getError = (state: RootState) => state?.legacyAuth?.error;

export const getIsAuthenticated = (state: RootState) =>
  getAuthState(state)?.isAuthenticated;

export const getUid = (state: RootState) => getAuthState(state)?.uid;
