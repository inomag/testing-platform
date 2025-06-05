import { RootState } from 'src/store';

const getLmsConfigState = (state: RootState) => state?.lmsConfig;
export const getWorkflowActionState = (state: RootState) =>
  getLmsConfigState(state)?.workflowActionState;
export const getWorkflowActionMessage = (state: RootState) =>
  getLmsConfigState(state)?.workflowActionMessage;
