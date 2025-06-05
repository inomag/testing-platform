import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type LmsConfigState = {
  workflowActionState: 'initial' | 'loading' | 'success' | 'error' | null;
  workflowActionMessage: string | null;
};

const initialState: LmsConfigState = {
  workflowActionState: null,
  workflowActionMessage: null,
};

export const lmsConfigSlice = createSlice({
  name: 'lmsConfig',
  initialState,
  reducers: {
    setWorkflowActionState: (
      state,
      action: PayloadAction<LmsConfigState['workflowActionState']>,
    ) => {
      state.workflowActionState = action.payload;
    },
    setWorkflowActionMessage: (
      state,
      action: PayloadAction<LmsConfigState['workflowActionMessage']>,
    ) => {
      if (action.payload) {
        state.workflowActionMessage = action.payload;
      }
    },
  },
});

export const { setWorkflowActionState, setWorkflowActionMessage } =
  lmsConfigSlice.actions;

const reducer = { lmsConfig: lmsConfigSlice.reducer };

export default reducer;
