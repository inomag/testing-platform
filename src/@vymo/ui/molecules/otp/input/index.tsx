/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable complexity */
import React, { useCallback, useEffect, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import OtpWithoutCTA from './otpWithoutCTA';
import { OTPInputProps } from './types';
import styles from './index.module.scss';

function OTPInput({
  onVerify,
  onResend,
  onBack = () => {},
  numOfBoxes,
  error,
  resendTimer,
  message,
  isLoading = false,
  userId = '',
  otpResendsRemaining,
  verificationAttemptsRemaining,
  'data-test-id': dataTestId,
}: OTPInputProps) {
  const [isVerifyEnabled, setIsVerifyEnabled] = useState<boolean>(false);
  const [otp, setOtp] = useState(Array(numOfBoxes).fill(''));

  useEffect(() => {
    if (!otp.includes('') && isLoading === false) {
      setIsVerifyEnabled(true);
    }
  }, [isLoading]);

  const handleVerifyClick = useCallback(() => {
    const otpValue = otp.join('');
    onVerify(otpValue);
  }, [otp, onVerify]);

  const onChange = (otpValue) => {
    setOtp(otpValue);
    setIsVerifyEnabled(!otpValue.includes('') && !isLoading);
  };

  return (
    <div className={styles.otp__container}>
      {/* :TODO: implement i18 */}
      <div>
        <div className={styles.mb_8}>
          <Text classNames={styles.header}>Validate with OTP</Text>
        </div>
        <div className={styles.mb_32}>
          <Text classNames={styles.subheader}>We sent an OTP to {userId}</Text>
        </div>
        <OtpWithoutCTA
          data-test-id={dataTestId}
          onResend={onResend}
          numOfBoxes={numOfBoxes}
          message={message}
          error={error}
          resendTimer={resendTimer}
          otpResendsRemaining={otpResendsRemaining}
          verificationAttemptsRemaining={verificationAttemptsRemaining}
          onChange={onChange}
          value={otp}
        />
      </div>

      <div className={styles.otp__actions}>
        <Button
          data-test-id={`${dataTestId}-back`}
          type="outlined"
          onClick={onBack}
          className={styles.cta__action}
        >
          Back
        </Button>
        <Button
          data-test-id={`${dataTestId}-continue`}
          disabled={!isVerifyEnabled}
          type="primary"
          onClick={handleVerifyClick}
          className={styles.cta__action}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default React.memo(OTPInput);
