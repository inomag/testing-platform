import localStorageService from 'src/localStorage';
import { OtpConfig, OtpConfigResult, UserInfo } from './types';

export const getUserInfo = (phoneNumber: string | null): UserInfo | null => {
  const userInfo = localStorageService.get<UserInfo>(phoneNumber);
  return userInfo ?? null;
};

export const getRequestId = (user: string | null): string | undefined => {
  const userInfo = getUserInfo(user);
  return userInfo?.requestId;
};

export const setCurrentUser = (phoneNumber: string): void => {
  localStorageService.set('currUser', phoneNumber);
};

export const getCurrentUser = (): string | null =>
  localStorageService.get<string>('currUser');

export const getCurrentUserInfo = (): UserInfo | null => {
  const currentUser = getCurrentUser();
  return currentUser ? getUserInfo(currentUser) : null;
};

export const updateCurrentUser = (
  data: UserInfo,
  shouldIncrementBackoff = false,
): void => {
  const currentUserInfo = getCurrentUserInfo();
  let backOff = currentUserInfo?.backOff ?? 0;
  if (shouldIncrementBackoff) {
    backOff++;
  }
  const currentUser = getCurrentUser();
  if (currentUser) {
    localStorageService.set(currentUser, {
      ...currentUserInfo,
      ...data,
      backOff,
    });
  }
};

export const setCurrentUserInfo = (userInfo: UserInfo): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    localStorageService.set(currentUser, userInfo);
  }
};

export const clearCurrentUser = (): void => {
  localStorageService.delete('currUser');
};

export const getOtpConfig = (otpConfig: OtpConfig): OtpConfigResult => {
  const currentUserInfo = getCurrentUserInfo();
  const backOff = currentUserInfo?.backOff;
  const resendTime =
    backOff && typeof backOff === 'number'
      ? otpConfig.resendOTPConfig.interval * backOff
      : otpConfig.resendOTPConfig.interval;
  const config: OtpConfigResult = {
    enabled: otpConfig?.resendOTPConfig.enabled,
    currentAttemp: 1,
    attempRemaining: 1,
    resendTime,
    otpLength: otpConfig?.otp_length || 6,
  };
  return config;
};

export const setIsFirstTimeLogin = (isFirstTimeLogin: boolean): void => {
  const currentUserInfo = getCurrentUserInfo();
  if (currentUserInfo) {
    currentUserInfo.firstTimeLogin = isFirstTimeLogin;
    updateCurrentUser(currentUserInfo);
  }
};

export const isFirstTimeLogin = (): boolean =>
  Boolean(getCurrentUserInfo()?.firstTimeLogin);
