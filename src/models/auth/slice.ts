import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AuthHeaderUi, MetaData, ScenarioType } from './types';

export type AuthState = {
  isAuthenticated: boolean;
  metaData: MetaData;
  authScenarioType: ScenarioType;
  vymoUserToken: string | undefined;
  payload: any;
  currentCta: any;
  isAssistedOnboarding: boolean;
  authHeaderUi?: AuthHeaderUi;
};

const initialState: AuthState = {
  isAuthenticated: false,
  authScenarioType: { scenario: 'loginType', functionality: 'full' },
  metaData: {},
  vymoUserToken: undefined,
  payload: {},
  currentCta: {},
  isAssistedOnboarding: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated(state: AuthState, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setAuthScenarioType(state: AuthState, action: PayloadAction<ScenarioType>) {
      state.authScenarioType = { ...state.authScenarioType, ...action.payload };
    },
    setMetaData(state: AuthState, action: PayloadAction<MetaData>) {
      state.metaData = action.payload;
    },

    setAuthHeaderUi(state: AuthState, action: PayloadAction<AuthHeaderUi>) {
      state.authHeaderUi = { ...state.authHeaderUi, ...action.payload };
    },
    setVymoUserToken(
      state: AuthState,
      action: PayloadAction<string | undefined>,
    ) {
      state.vymoUserToken = action.payload;
    },
    setPayload(state: AuthState, action: PayloadAction<any>) {
      state.payload = action.payload;
    },
    setCurrentCta(state: AuthState, action: PayloadAction<any>) {
      state.currentCta = action.payload;
    },
    setIsAssistedOnboarding(state: AuthState, action: PayloadAction<boolean>) {
      state.isAssistedOnboarding = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setMetaData,
  setAuthScenarioType,
  setVymoUserToken,
  setPayload,
  setCurrentCta,
  setIsAssistedOnboarding,
  setAuthHeaderUi,
} = authSlice.actions;

const reducer = { auth: authSlice.reducer };

export default reducer;
