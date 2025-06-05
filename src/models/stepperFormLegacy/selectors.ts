import type { RootState } from 'src/store';
import { StepperFormState } from './types';

export const getStepperFormState = (state: RootState): StepperFormState =>
  state.stepperForm;

export const getPageAttributes = (state: RootState) =>
  getStepperFormState(state).pageAttribute;

export const getCurrentStep = (state: RootState) =>
  getStepperFormState(state).currentStep;

export const getIsInitialised = (state: RootState) =>
  getStepperFormState(state).isInitialised;

export const getJourney = (state: RootState) =>
  getStepperFormState(state).journey;

export const getSections = (state: RootState) =>
  getStepperFormState(state).sections;

export const getStepperSectionData = (state: RootState) =>
  getStepperFormState(state).sectionData;

export const getApiStatusForEdit = (state: RootState) =>
  getStepperFormState(state).apiStatusForEdit;

export const getApiError = (state: RootState) =>
  getStepperFormState(state).apiError;

export const getStepperFormStatus = (state: RootState) =>
  getStepperFormState(state).stepperFormStatus;

export const getIsUserIdValidated = (state: RootState, key: string) =>
  getStepperFormState(state).userIdentification[key];

export const getInputsMap = (state: RootState) =>
  getStepperFormState(state).inputsMap;
