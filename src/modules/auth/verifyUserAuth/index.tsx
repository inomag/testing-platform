import React, { useCallback, useState } from 'react';
import OtpWithoutCTA from 'src/@vymo/ui/molecules/otp/input/otpWithoutCTA';
import { setApiStatus, setErrorMessage } from 'src/models/appConfig/slice';
import { getMetaData } from 'src/models/auth/selectors';
import { setPayload } from 'src/models/auth/slice';
import { sendOtp } from 'src/models/auth/thunk';
import { getLocale, getTimezone } from 'src/models/portalConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getValueBasedOnType, validatePayload } from '../queries';
import styles from '../index.module.scss';

function VerifyUserAuth() {
  const dispatch = useAppDispatch();
  const metaData = useAppSelector(getMetaData);
  const [value, setValue] = useState(Array(metaData.numberOfDigits).fill(''));
  const locale = useAppSelector(getLocale);
  const zone = useAppSelector(getTimezone);

  const onResend = () => {
    const visitor = {
      requestId: metaData.requestId,
      phone: {
        countryCode: metaData.countryCode,
        number: metaData.phone,
      },
    };
    const payload = {
      useCase: 'agency',
      type: 'OTP',
      client: metaData.client,
      visitor,
      device_details: {},
      locale,
      zone,
    };
    // TODO Swapnil: Fix this
    // @ts-ignore
    dispatch(sendOtp({ payload }));
  };

  const onValueChange = useCallback(
    (newValue) => {
      const { valid, errorMessage } = validatePayload(
        'verifyUserAuth',
        '',
        metaData.numberOfDigits,
        getValueBasedOnType(newValue),
      );
      setValue(newValue);
      dispatch(setApiStatus(undefined));
      dispatch(setErrorMessage(errorMessage));
      dispatch(
        setPayload({
          inputs: [
            {
              code: 'otp',
              value: newValue.join(''),
              requestId: metaData?.requestId,
            },
          ],
          encryptPayload: false,
          valid,
        }),
      );
    },
    [dispatch, metaData],
  );

  return (
    <div className={styles.otp__container}>
      <div className={styles.otp__container__content}>
        <OtpWithoutCTA
          data-test-id="auth-module-otp"
          onResend={onResend}
          numOfBoxes={metaData.numberOfDigits}
          resendTimer={metaData?.resendOTPConfig?.interval ?? 30000}
          error=""
          value={value}
          otpResendsRemaining={metaData.resendAttemptsRemaining}
          verificationAttemptsRemaining={metaData.verificationAttemptsRemaining}
          onChange={onValueChange}
        />
      </div>
    </div>
  );
}

export default VerifyUserAuth;
