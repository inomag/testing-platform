import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line vymo-ui/restrict-import
import { UserIdValidatedProp } from 'src/modules/stepperFormLegacy/types';
import {
  ApiStatus,
  Journey,
  Section,
  StepperFormState,
  UpdateFormActionPayload,
} from './types';

// TODO: stepper form status can be ready/not-ready
const initialState: StepperFormState = {
  pageAttribute: {
    title: '',
    description: '',
  },
  sections: [],
  sectionData: {},
  journey: [],
  currentStep: 0,
  isInitialised: false,
  apiError: '',
  apiStatusForEdit: {
    status: '',
    error: '',
  },
  stepperFormStatus: '',
  userIdentification: {},
  inputsMap: {},
};

export const stepperFormSlice = createSlice({
  name: 'stepperForm',
  initialState,
  reducers: {
    setPageAttribute(
      state: StepperFormState,
      action: PayloadAction<{ title: string; description: string }>,
    ) {
      state.pageAttribute = action.payload;
    },
    setSections(state: StepperFormState, action: PayloadAction<Section[]>) {
      state.sections = action.payload;
    },
    setIsInitialised(state: StepperFormState, action: PayloadAction<boolean>) {
      state.isInitialised = action.payload;
    },
    setJourney(state: StepperFormState, action: PayloadAction<Journey>) {
      state.journey = action.payload;
    },
    initializeStepperForm(state, action: PayloadAction<any>) {
      state.pageAttribute = action.payload.pageAttribute;
      state.sections = action.payload.sections;
      state.journey = action.payload.journey;
      state.currentStep = action.payload.currentStep;
      state.sectionData = action.payload.sectionData;
      state.isInitialised = true; // TODO: remove
      state.inputsMap = action.payload.inputsMap;
    },
    updateStepperForm(state, action: PayloadAction<UpdateFormActionPayload>) {
      const { section, value } = action.payload;
      state.sectionData[section] = value;
    },
    setApiError(state, action: PayloadAction<string>) {
      state.apiError = action.payload;
    },
    setApiStatusForEdit(
      state,
      action: PayloadAction<{ status: ApiStatus; error?: string }>,
    ) {
      state.apiStatusForEdit = action.payload;
    },
    setIsUserIdValidated(state, action: PayloadAction<UserIdValidatedProp>) {
      const { code, value } = action.payload;
      state.userIdentification[`${code}`] = value;
    },
    resetStepperFormStatus(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPageAttribute,
  setSections,
  setJourney,
  setIsInitialised,
  initializeStepperForm,
  updateStepperForm,
  setApiError,
  setApiStatusForEdit,
  setIsUserIdValidated,
  resetStepperFormStatus,
} = stepperFormSlice.actions;

const reducer = { stepperForm: stepperFormSlice.reducer };

export default reducer;
