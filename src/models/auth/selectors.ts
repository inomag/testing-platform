import { RootState } from 'src/store';

const getAuthState = (state: RootState) => state?.auth;

export const getUserAuthenticated = (state: RootState) =>
  getAuthState(state)?.isAuthenticated;

export const getMetaData = (state: RootState) => getAuthState(state)?.metaData;

export const getVymoUserToken = (state: RootState) =>
  getAuthState(state)?.vymoUserToken;

export const getAuthPayload = (state: RootState) =>
  getAuthState(state)?.payload;

export const getAuthSceanioType = (state: RootState) =>
  getAuthState(state)?.authScenarioType;

export const getCTAs = (state: RootState) => getMetaData(state)?.cta || [];

export const getCurrentCta = (state: RootState) =>
  getAuthState(state)?.currentCta;

export const getIsAssistedOnboarding = (state: RootState) =>
  getAuthState(state)?.isAssistedOnboarding;

export const getAuthHeaderUi = (state: RootState) =>
  getAuthState(state)?.authHeaderUi;
