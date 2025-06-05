import { RootState } from 'src/store';
import { getCurrentStepComponent } from '../selectors';

export const getAssessmentConfig = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.meta?.assessmentConfig || {};
