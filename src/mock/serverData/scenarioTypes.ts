export type Scenario = {
  sendOtp?: {
    isError: boolean;
    isFlowLocked?: boolean;
    resendAttemptsExhausted?: boolean;
  };
  verifyOtp?: { isError: boolean; isWrongOtp: boolean; isFlowLocked?: boolean };
  getHistory?: {
    isError: boolean;
    isClearAPI?: boolean;
  };
  init?: {
    hasError: boolean;
    isAuthorized?: boolean;
    section?: string;
    emailLogin?: boolean;
    isAssistedOnboarding?: boolean;
  };
  actionSubmit?: {
    hasError: boolean;
    isAuthorized?: boolean;
  };
  actionValidate?: {
    hasError: boolean;
  };
  esign?: {};
  portalInitV3?: {
    section?: string;
  };
  userProfile?: {
    section?: string;
  };
  user360?: {
    section?: string;
  };
  frontendWebPlatform?: {
    isError: boolean;
  };
};
