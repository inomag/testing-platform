import React, { useMemo, useState } from 'react';
import { Country } from 'react-phone-number-input';
import Button from 'src/@vymo/ui/atoms/button';
import Input from 'src/@vymo/ui/atoms/input';
import Loader from 'src/@vymo/ui/atoms/loader';
import Text from 'src/@vymo/ui/atoms/text';
import Otp from 'src/@vymo/ui/molecules/otp';
import PhoneLegacy from 'src/@vymo/ui/molecules/phone/legacy';
import classnames from 'classnames';
import { getIsLoading as getIsOTPAuthLoading } from 'src/models/authLegacy/otp/selectors';
import {
  getClientCode,
  getCountry,
  getLanguage,
  getLocale,
  getLoginType,
  getPortalBranding,
  getTimezone,
} from 'src/models/portalConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setCurrentUser, setCurrentUserInfo } from '../queries';
import {
  getError,
  getIsLoading,
  getIsOtpFlow,
  getIsOtpSent,
} from '../selectors';
import { setError } from '../slice';
import { sendOtp } from '../thunk';
import { getSendOtpPayload } from './queries';
import styles from './phoneAuth.module.scss';

function OTPAuth() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const isLoading = useAppSelector(getIsLoading);
  const isOTPFlow = useAppSelector(getIsOtpFlow);
  const isOTPSent = useAppSelector(getIsOtpSent);
  const error = useAppSelector(getError);
  const portalBranding = useAppSelector(getPortalBranding);
  const loginType = useAppSelector(getLoginType);
  const client = useAppSelector(getClientCode);
  const defaultCountryCode = useAppSelector(getCountry);
  const language = useAppSelector(getLanguage);
  const locale = useAppSelector(getLocale);
  const zone = useAppSelector(getTimezone);
  const isAuthApiLoading = useAppSelector(getIsOTPAuthLoading);

  const phoneRef = React.useRef<any>(null);

  const onValueChange = (newValue, event, additionalConfig, validValue) => {
    setError('');
    setValue(newValue);
    setIsValid(validValue);
  };

  const onSubmit = () => {
    if (isValid) {
      const identifier =
        loginType === 'PHONE' ? value.split(countryCode).pop() : value;
      setCurrentUser(identifier ?? '');
      setCurrentUserInfo({
        userid: identifier,
        backOff: 0,
        countryCode,
        client,
      });
      const payload = getSendOtpPayload(
        countryCode,
        identifier,
        locale,
        loginType,
        zone,
      );
      dispatch(sendOtp({ payload, type: 'send' }));
    }
  };

  const loginComponent = useMemo(() => {
    switch (loginType) {
      case 'EMAIL':
        return (
          <Input
            data-test-id="auth-module-email"
            label="Email"
            placeholder="Enter Email"
            value={value}
            onChange={onValueChange}
            validations={[
              {
                regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,}$/,
                errorMessage: 'Invalid Email',
              },
            ]}
            hideValidation={!value}
          />
        );
      case 'PHONE':
        return (
          <PhoneLegacy
            data-test-id="auth-module-phone"
            onChange={onValueChange}
            defaultCountryCode={defaultCountryCode as Country}
            ref={phoneRef}
            label="Primary Phone Number"
            placeholder="Enter 10 digit phone number"
            value={value}
            classNames={styles.phone__input}
            onCountryChange={(val) => {
              setCountryCode(val);
            }}
            locale={language}
          />
        );
      default:
        return (
          <PhoneLegacy
            data-test-id="auth-module-phone"
            onChange={onValueChange}
            defaultCountryCode={defaultCountryCode as Country}
            ref={phoneRef}
            label="Primary Phone Number"
            placeholder="Enter 10 digit phone number"
            value={value}
            classNames={styles.phone__input}
            onCountryChange={(val) => {
              setCountryCode(val);
            }}
            locale={language}
          />
        );
    }
  }, [defaultCountryCode, language, loginType, value]);

  return (
    <div className={styles.wrapper}>
      <div className={classnames(styles.phone__auth)}>
        {isLoading || isAuthApiLoading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <div className={styles.auth__wrapper}>
            {isOTPFlow && isOTPSent ? (
              <Otp resendEndpoint="" verifyEndpoint="" />
            ) : (
              <div>
                <div className={styles.mb_5}>
                  <Text classNames={styles.header} type="h3">
                    {portalBranding?.bannerTitle}
                  </Text>
                </div>
                <div className={styles.mb_32}>
                  <Text classNames={styles.subheader} type="h5">
                    {portalBranding?.bannerDescription}
                  </Text>
                </div>
                {loginComponent}
                {error && (
                  <div data-test-id="auth-module-error">
                    <Text variant="error">{error}</Text>
                  </div>
                )}
                <div className={styles.cta__container}>
                  <Button
                    data-test-id="auth-module-submit"
                    disabled={!value || !isValid}
                    onClick={onSubmit}
                    className={styles.submit__cta}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OTPAuth;
