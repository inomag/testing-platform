import { RootState } from 'src/store';

export const getLmsAuthState = (state: RootState) => state.lmsAuth;

export const getLmsConfig = (state: RootState) => state.lmsAuth?.config;
