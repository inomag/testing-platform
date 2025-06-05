import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type OtpAuthState = {
  loading: boolean;
  otpConfig: {
    currentAttemp: number;
    attempRemaining: number;
    resendTime: number;
    otpLength: number;
    enabled: boolean;
  };
  currentState: {
    otp: string;
    isVerified: boolean;
    error: string;
    message: string;
  };
  otpResendsRemaining: number;
};

const initialState: OtpAuthState = {
  loading: false,
  otpConfig: {
    currentAttemp: 1,
    attempRemaining: 1,
    resendTime: 60000,
    otpLength: 6,
    enabled: true,
  },
  currentState: {
    otp: '',
    isVerified: false,
    error: '',
    message: '',
  },
  otpResendsRemaining: 0,
};

export const otpAuthSlice = createSlice({
  name: 'otpAuth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.currentState.otp = action.payload;
    },
    setOtpConfig: (state, action: PayloadAction<any>) => {
      state.otpConfig = action.payload;
    },
    setCurrentOtpAuthState: (state, action: PayloadAction<any>) => {
      state.currentState = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.currentState.error = action.payload;
    },
    setVerified: (state, action: PayloadAction<any>) => {
      state.currentState.isVerified = action.payload;
    },
    setMessage: (state, action: PayloadAction<any>) => {
      state.currentState.message = action.payload;
    },
    setOtpResendsRemaining: (state, action: PayloadAction<number>) => {
      state.otpResendsRemaining = action.payload;
    },
  },
});

export const {
  setLoading,
  setOtp,
  setOtpConfig,
  setError,
  setVerified,
  setMessage,
  setOtpResendsRemaining,
} = otpAuthSlice.actions;

const reducer = { otpAuth: otpAuthSlice.reducer };

export default reducer;
