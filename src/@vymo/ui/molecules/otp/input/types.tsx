export type OTPInputProps = {
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  numOfBoxes: number;
  error: string;
  resendTimer: number;
  message?: string;
  isLoading: boolean;
  userId: string;
  'data-test-id'?: string;
  otpResendsRemaining: number;
  verificationAttemptsRemaining?: number;
};

export type OTPWithoutCTAInputProps = {
  onResend: () => void;
  numOfBoxes: number;
  error: string;
  resendTimer: number;
  message?: string;
  otpResendsRemaining: number;
  verificationAttemptsRemaining?: number;
  'data-test-id'?: string;
  onChange: (arg1) => void;
  value: string[];
};
