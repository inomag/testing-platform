/* eslint-disable no-console */
import React, { useCallback } from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  getError,
  getMessage,
  getOtpAuthConfig,
  getOtpResendsRemaining,
} from 'src/models/authLegacy/otp/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { verifyOtp } from 'src/models/authLegacy/otp/thunk';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  getLocale,
  getLoginType,
  getTimezone,
} from 'src/models/portalConfig/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { getSendOtpPayload } from 'src/modules/authLegacy/otpAuth/queries';
// eslint-disable-next-line vymo-ui/restrict-import
import {
  getCurrentUser,
  getCurrentUserInfo,
  getRequestId,
  getUserInfo,
} from 'src/modules/authLegacy/queries';
// eslint-disable-next-line vymo-ui/restrict-import
import { getIsLoading, getUid } from 'src/modules/authLegacy/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { setError, setIsOTPSent } from 'src/modules/authLegacy/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { sendOtp } from 'src/modules/authLegacy/thunk';
// eslint-disable-next-line vymo-ui/restrict-import
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import OTPInput from './input';
import { getVerifyOtpPayload } from './queries';
import { OtpProps } from './types';

// api endpoint to send and verify otp
// otp config
// resend otp config

function OTP({
  verifyEndpoint,
  resendEndpoint,
}: React.PropsWithChildren<OtpProps>) {
  const dispatch = useAppDispatch();
  console.log(verifyEndpoint, resendEndpoint);

  const otpConfig = useAppSelector(getOtpAuthConfig);
  const error = useAppSelector(getError);
  const message = useAppSelector(getMessage);
  const isLoading = useAppSelector(getIsLoading);
  const userInfo = getUserInfo(getCurrentUser());
  const uid = useAppSelector(getUid);
  const loginType = useAppSelector(getLoginType);
  const locale = useAppSelector(getLocale);
  const zone = useAppSelector(getTimezone);
  const otpResendsRemaining = useAppSelector(getOtpResendsRemaining);

  const handleOTPVerify = useCallback(
    (otp: string) => {
      // Verify OTP using API here
      if (otp.length === otpConfig.otpConfig.otpLength) {
        const client = getCurrentUserInfo()?.client || '';
        const currentUser = getCurrentUser();
        const currentUserInfo = getUserInfo(currentUser);
        const requestId = getRequestId(currentUser);
        const payload = getVerifyOtpPayload(
          otp,
          currentUserInfo,
          requestId,
          client,
          locale,
          loginType,
          zone,
        );
        dispatch(verifyOtp({ payload, uid }));
      }
    },
    [otpConfig.otpConfig.otpLength, locale, loginType, zone, dispatch, uid],
  );

  const handleResendOTP = useCallback(() => {
    const payload = getSendOtpPayload(
      userInfo?.countryCode,
      userInfo?.userid,
      locale,
      loginType,
      zone,
    );
    dispatch(sendOtp({ payload, type: 'resend' }));
  }, [
    userInfo?.countryCode,
    userInfo?.userid,
    locale,
    loginType,
    zone,
    dispatch,
  ]);

  const onBack = useCallback(() => {
    dispatch(setIsOTPSent(false));
    dispatch(setError(''));
  }, [dispatch]);

  return (
    <OTPInput
      onVerify={handleOTPVerify}
      resendTimer={otpConfig.otpConfig.resendTime}
      onResend={handleResendOTP}
      error={error}
      numOfBoxes={otpConfig.otpConfig.otpLength || 6}
      message={message}
      onBack={onBack}
      isLoading={isLoading}
      userId={
        loginType === 'PHONE'
          ? `${userInfo?.countryCode} ${userInfo?.userid}`
          : userInfo?.userid || ''
      }
      otpResendsRemaining={otpResendsRemaining}
      data-test-id="auth-module-otp"
    />
  );
}

export default React.memo(OTP);
