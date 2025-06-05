import { FormConfigType } from 'src/@vymo/ui/molecules/form';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type WorkflowFormState = {
  inputs: NonNullable<FormConfigType>['data'];
  allInputs: NonNullable<FormConfigType>['data'];
  inputsMap: Record<string, any>;
  vo: any;
  conditionalApprovers: any;
  status: { loading: boolean; error: any };
};

const initialState: WorkflowFormState = {
  inputs: [],
  allInputs: [],
  inputsMap: {},
  vo: {},
  conditionalApprovers: [],
  status: {
    loading: false,
    error: '',
  },
};

const workflowFormSlice = createSlice({
  name: 'workflowForm',
  initialState,
  reducers: {
    setFormLoading: (state: WorkflowFormState) => {
      state.status = { loading: true, error: '' };
    },

    setFormError: (
      state: WorkflowFormState,
      action: PayloadAction<{ error: any }>,
    ) => {
      state.status = {
        loading: false,
        error: action.payload.error,
      };
    },
    setFormInputs: (
      state: WorkflowFormState,
      action: PayloadAction<{ response }>,
    ) => {
      state.inputs = action.payload.response;
      state.status = { loading: false, error: '' };
    },
    setAllInputs: (
      state: WorkflowFormState,
      action: PayloadAction<{ response }>,
    ) => {
      state.allInputs = action.payload.response;
      state.status = { loading: false, error: '' };
    },
    setFormInputsMap: (
      state: WorkflowFormState,
      action: PayloadAction<{ response }>,
    ) => {
      state.inputsMap = action.payload.response;
    },
    setFormVo: (
      state: WorkflowFormState,
      action: PayloadAction<{ response }>,
    ) => {
      state.vo = action.payload.response;
    },
    setConditionalApproverFields: (
      state: WorkflowFormState,
      action: PayloadAction<{ conditionalApprovers: any }>,
    ) => {
      state.conditionalApprovers = action.payload.conditionalApprovers;
      state.status = { loading: false, error: '' };
    },
  },
});

export const {
  setFormLoading,
  setFormError,
  setFormInputs,
  setFormInputsMap,
  setAllInputs,
  setFormVo,
  setConditionalApproverFields,
} = workflowFormSlice.actions;
const reducer = {
  workflowForm: workflowFormSlice.reducer,
};
export default reducer;
