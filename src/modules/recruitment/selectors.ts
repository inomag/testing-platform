import { RootState } from 'src/store';

const getInitState = (state: RootState) => state?.register;

export const getFlow = (state: RootState) => getInitState(state)?.flow;

export const getInitResponse = (state: RootState) =>
  getInitState(state)?.initResponse;

export const getApiStatus = (state: RootState) =>
  getInitState(state)?.apiState.status;

export const getApiError = (state: RootState) =>
  getInitState(state).apiState.error;
