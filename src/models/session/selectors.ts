import { RootState } from 'src/store';

export const getGlobalForms = (state: RootState) => state?.session;

export const getSessionTimeout = (state: RootState) => state?.session?.timeout;

export const getSessionLiveliness = (state: RootState) =>
  state?.session?.isSessionAlive;
