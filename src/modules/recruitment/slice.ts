import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { API_STATUS } from './constants';

type Keys = keyof typeof API_STATUS;
type Values = (typeof API_STATUS)[Keys];
export interface RegisterUserState {
  op: string;
  flow: string;
  initResponse: any;
  registration: RegisterFormState;
  apiState: {
    status: Values | null;
    error?: string;
  };
}

export interface RegisterFormState {
  currentStep: number;
  submitted: boolean;
  isInitialised: boolean;
  userIdValidatedFlag: boolean;
}

const initialState: RegisterUserState = {
  op: '',
  flow: '',
  initResponse: null,
  registration: {
    currentStep: 0,
    submitted: false,
    isInitialised: false,
    userIdValidatedFlag: false,
  },
  apiState: {
    status: null,
    error: '',
  },
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setOp(state: RegisterUserState, action: PayloadAction<string>) {
      state.op = action.payload;
    },
    setFlow(state: RegisterUserState, action: PayloadAction<string>) {
      state.flow = action.payload;
    },
    setInitResponse(state: RegisterUserState, action: PayloadAction<any>) {
      state.initResponse = action.payload;
    },
    setApiStatus(
      state: RegisterUserState,
      action: PayloadAction<Values | null>,
    ) {
      state.apiState.status = action.payload;
      if (action.payload === API_STATUS.UNAUTHORIZED) {
        state = {
          ...initialState,
          apiState: { status: API_STATUS.UNAUTHORIZED, error: '' },
        };
      }
    },
    setApiError(state: RegisterUserState, action: PayloadAction<string>) {
      state.apiState.error = action.payload;
    },
    updateCurrentStep(state, action: PayloadAction<number>) {
      state.registration.currentStep = action.payload;
    },
    updateSubmitted(state, action: PayloadAction<boolean>) {
      state.registration.submitted = action.payload;
    },
    initializeStepperFlag(state) {
      state.registration.isInitialised = true;
    },
    resetState(state: RegisterUserState) {
      Object.assign(state, { ...initialState, apiState: state.apiState });
    },
  },
});

export const {
  setFlow,
  setOp,
  setInitResponse,
  setApiStatus,
  setApiError,
  resetState,
} = registerSlice.actions;

const reducer = { register: registerSlice.reducer };

export default reducer;
