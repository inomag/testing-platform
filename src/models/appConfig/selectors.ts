import type { RootState } from 'src/store';
import { AppConfigState } from './types';

export const getAppConfigState = (state: RootState): AppConfigState =>
  state.appConfig;

export const getAppHideConfig = (state: RootState) =>
  getAppConfigState(state).hide;

export const getAppStatusConfig = (state: RootState) =>
  getAppConfigState(state).status;
export const getLoggedInUserInfo = (state: RootState) =>
  getAppConfigState(state).userInfo;

export const getLanguageOptions = (state: RootState) =>
  getAppConfigState(state).languageOptions;

export const getApiStatus = (state: RootState) =>
  getAppConfigState(state)?.apiStatus;

export const getIsAppApiLoading = (state: RootState) =>
  getApiStatus(state) === 'in_progress';

export const getErrorMessage = (state: RootState) =>
  getApiStatus(state) === 'error' && getAppConfigState(state)?.errorMessage;

export const getPageDirty = (state: RootState) =>
  getAppConfigState(state).pageDirty;
