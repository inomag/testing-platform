import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Input from 'src/@vymo/ui/atoms/input';
import BoxInput from 'src/@vymo/ui/molecules/boxInput';
import OtpWithoutCTA from 'src/@vymo/ui/molecules/otp/input/otpWithoutCTA';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { setApiStatus, setErrorMessage } from 'src/models/appConfig/slice';
import { getMetaData } from 'src/models/auth/selectors';
import { setCurrentCta, setPayload } from 'src/models/auth/slice';
import { getLocale, getTimezone } from 'src/models/portalConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getValueBasedOnType, validatePayload } from '../queries';
import styles from '../index.module.scss';

function UserAuthentication(props) {
  const { type } = props;
  const dispatch = useAppDispatch();

  const onContinue = useCallback(
    (cta) => {
      dispatch(setApiStatus('cta_clicked'));
      dispatch(setCurrentCta(cta));
    },
    [dispatch],
  );
  const metaData = useAppSelector(getMetaData);

  const cta = metaData?.forgotMpinConfig?.cta;
  const [value, setValue] = useState<string | Array<string>>(
    type === 'PASSWORD' ? '' : Array(metaData.numberOfDigits).fill(''),
  );

  const localeValue = useAppSelector(getLocale);
  const zone = useAppSelector(getTimezone);

  const onResend = useCallback(() => {
    const visitor = {
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
      localeValue,
      zone,
    };
    // TODO Swapnil: Fix this
    // @ts-ignore
    dispatch(sendOtp({ payload }));
  }, [
    localeValue,
    metaData.client,
    metaData.countryCode,
    metaData.phone,
    zone,
    dispatch,
  ]);

  const onValueChange = useCallback(
    (newValue) => {
      const { valid, errorMessage } = validatePayload(
        'userAuthentication',
        type,
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
              code: 'mpin',
              value: newValue.join(''),
            },
          ],
          encryptPayload: true,
          valid,
        }),
      );
    },
    [dispatch, metaData.numberOfDigits, type],
  );

  const authComponent = useMemo(() => {
    switch (type) {
      case 'PASSWORD':
        return (
          <Input
            data-test-id="auth-module-email"
            label={locale(Keys.PASSWORD)}
            placeholder={locale(Keys.ENTER_PASSWORD)}
            value={value as string}
            onChange={onValueChange}
            required
            hideValidation={!value}
          />
        );
      case 'OTP':
        return (
          <OtpWithoutCTA
            data-test-id="auth-module-otp"
            onResend={onResend}
            numOfBoxes={metaData.numberOfDigits}
            resendTimer={metaData?.resendOTPConfig?.interval ?? 3000}
            error=""
            value={value as Array<string>}
            otpResendsRemaining={metaData.resendAttemptsRemaining}
            verificationAttemptsRemaining={
              metaData.verificationAttemptsRemaining
            }
            onChange={onValueChange}
          />
        );
      case 'MPIN':
        return (
          <BoxInput
            data-test-id="auth-module-mpin"
            numOfBoxes={metaData.numberOfDigits}
            value={value as Array<string>}
            onChange={onValueChange}
          />
        );
      default:
        return (
          <Input
            data-test-id="auth-module-email"
            label={locale(Keys.PASSWORD)}
            type="password"
            placeholder={locale(Keys.ENTER_PASSWORD)}
            value={value as string}
            onChange={onValueChange}
            required
            hideValidation={!value}
          />
        );
    }
  }, [
    type,
    value,
    onValueChange,
    onResend,
    metaData.numberOfDigits,
    metaData?.resendOTPConfig?.interval,
    metaData.resendAttemptsRemaining,
    metaData.verificationAttemptsRemaining,
  ]);

  return (
    <div className={styles.auth__wrapper}>
      <div>{authComponent}</div>
      {cta && (
        <Button
          data-cta={
            cta.type === 'action'
              ? cta.action
              : cta?.actionResponse?.template?.code
          }
          data-test-id={`cta-${
            cta.type === 'action'
              ? cta.action
              : cta?.actionResponse?.template?.code
          }`}
          type="text"
          onClick={() => onContinue(cta)}
        >
          {cta.title}
        </Button>
      )}
    </div>
  );
}

export default UserAuthentication;
