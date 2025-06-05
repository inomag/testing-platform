import { RootState } from 'src/store';
import { getCurrentStepComponent } from '../selectors';

export const getMetaData = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.meta || {};
