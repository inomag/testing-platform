import { RootState } from 'src/store';
import { getUIBuilder } from '../selectors';

export const getRunnerData = (state: RootState) => getUIBuilder(state)?.runner;

export const getRunnerPayloadData = (state: RootState) =>
  getUIBuilder(state)?.project.selfserve.config ?? {};

export const getRunnerApiStatus = (state: RootState) =>
  getRunnerData(state)?.status;
