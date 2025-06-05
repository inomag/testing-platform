export type AuthMethod = 'Email' | 'Phone';

export type AuthProps = {
  code?: string;
  lastPage?: string;
};

export interface Session {
  isAuthenticated: boolean;
}

export type UserInfo = {
  requestId?: string;
  backOff?: number;
  userid?: string;
  countryCode?: string;
  session?: Session;
  firstTimeLogin?: boolean;
  client?: string;
};

interface ResendOTPConfig {
  enabled: boolean;
  interval: number;
  backoff: number;
  max_tries: number;
}
export type OtpConfig = {
  otp_length: number;
  ttl: number;
  resendOTPConfig: ResendOTPConfig;
};

export type OtpConfigResult = {
  enabled: boolean;
  currentAttemp: number;
  attempRemaining: number;
  resendTime: number;
  otpLength: number;
};
