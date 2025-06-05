export type MockState =
  | 'userInput'
  | 'ntb'
  | 'etb'
  | 'userExist'
  | 'authenticated';

export const mockFlows = {
  loginFlowNtb: ['userInput', 'ntb', 'authenticated'],
  loginFlowEtb: ['userInput', 'etb', 'authenticated'],
  loginFlowUserExist: ['userInput', 'userExist', 'authenticated'],
  authenticatedFlow: ['authenticated'],
};
