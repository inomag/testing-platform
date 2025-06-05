import { RootState } from 'src/store';

export const getOtpAuthConfig = (state: RootState) => state?.otpAuth;

export const getError = (state: RootState) =>
  state?.otpAuth?.currentState?.error;

export const getMessage = (state: RootState) =>
  state?.otpAuth?.currentState?.message;

export const getIsLoading = (state: RootState) => state?.otpAuth?.loading;

export const getOtpResendsRemaining = (state: RootState) =>
  state?.otpAuth?.otpResendsRemaining;
