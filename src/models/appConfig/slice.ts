import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiStatus, AppConfigState } from './types';

const initialState: AppConfigState = {
  hide: {
    headerHamburger: false,
    selfserveSaveDiscardButtons: true,
  },
  status: {
    selfserveSave: 'not_started',
    selfserveDiscard: 'not_started',
  },
  apiStatus: undefined,
  userInfo: {},
  errorMessage: '',
  pageDirty: false,
  languageOptions: [],
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setApiStatus(state: AppConfigState, action: PayloadAction<ApiStatus>) {
      state.apiStatus = action.payload;
    },

    setErrorMessage(state: AppConfigState, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setAppHideConfig(
      state: AppConfigState,
      action: PayloadAction<{ hide: Partial<AppConfigState['hide']> }>,
    ) {
      state.hide = {
        ...state.hide,
        ...action.payload.hide,
      };
    },

    setAppStatusConfig(
      state: AppConfigState,
      action: PayloadAction<{ status: Partial<AppConfigState['status']> }>,
    ) {
      state.status = {
        ...state.status,
        ...action.payload.status,
      };
    },

    setUserInfo(
      state: AppConfigState,
      action: PayloadAction<AppConfigState['userInfo']>,
    ) {
      state.userInfo = action.payload;
    },
    setPageDirty(state: AppConfigState, action: PayloadAction<boolean>) {
      state.pageDirty = action.payload;
    },
    setLanguageOptions(
      state: AppConfigState,
      action: PayloadAction<AppConfigState['languageOptions']>,
    ) {
      state.languageOptions = action.payload;
    },
  },
});

export const {
  setErrorMessage,
  setAppHideConfig,
  setAppStatusConfig,
  setUserInfo,
  setApiStatus,
  setPageDirty,
  setLanguageOptions,
} = appConfigSlice.actions;

const reducer = { appConfig: appConfigSlice.reducer };

export default reducer;
