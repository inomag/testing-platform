/* eslint-disable complexity */
import { findLastIndex } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Input from 'src/@vymo/ui/atoms/input';
import Text from 'src/@vymo/ui/atoms/text';
import Banner from 'src/@vymo/ui/blocks/banner';
import { ReactComponent as CheckIcon } from 'src/assets/icons/checkIcon.svg';
import { convertSecondsToMinutes, getInputFromChildren } from './queries';
import { OTPWithoutCTAInputProps } from './types';
import styles from './index.module.scss';

function OTPWithoutCTAInput({
  onResend,
  numOfBoxes,
  resendTimer,
  error,
  message,
  otpResendsRemaining,
  verificationAttemptsRemaining = 5,
  onChange,
  'data-test-id': dataTestId,
  value: otpValue,
}: OTPWithoutCTAInputProps) {
  const [timeToResend, setTimeToResend] = useState<number>(resendTimer);
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(!!message);

  const inputRefs = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = useCallback(() => {
    setIsResendEnabled(false);
    setTimeToResend(resendTimer);
    let timeRemaining = resendTimer;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      timeRemaining -= 1000;
      setTimeToResend(timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsResendEnabled(true);
      }
    }, 1000);
  }, [resendTimer]);

  useEffect(() => {
    if (otpResendsRemaining > 0 && verificationAttemptsRemaining > 0) {
      startResendTimer();
    } else {
      setTimeToResend(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [otpResendsRemaining, startResendTimer, verificationAttemptsRemaining]);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
    }
  }, [message]);

  useEffect(() => {
    if (
      isResendEnabled &&
      (otpResendsRemaining === 0 || verificationAttemptsRemaining === 0)
    ) {
      setIsResendEnabled(false);
    }
  }, [otpResendsRemaining, isResendEnabled, verificationAttemptsRemaining]);

  const handleInputChange = useCallback(
    (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(
        (event?.currentTarget as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );
      const otpCopy = [...otpValue];

      if (value === '' && index > 0 && event.type !== 'blur') {
        const lastIndex = Math.max(
          0,
          findLastIndex(otpValue, (item) => item !== '', index) - 1,
        );
        const prevInput = getInputFromChildren(inputRefs, lastIndex);
        prevInput?.focus();
        prevInput?.select();
      }

      if (!/^[0-9]*$/.test(value)) {
        return;
      }

      let nextInput;
      if (index < numOfBoxes - 1 && value !== '' && event.type !== 'blur') {
        nextInput = getInputFromChildren(inputRefs, index + 1);
        nextInput?.focus();
      }

      if (value.length > 1) {
        for (let i = index; i < index + value.length; i++) {
          if (i < numOfBoxes) {
            otpCopy[i] = value[i - index];
            const input = getInputFromChildren(inputRefs, i);
            if (input) {
              input.value = value[i - index];
            }
          }
        }
      } else {
        otpCopy[index] = value;
      }
      onChange(otpCopy);
    },
    [numOfBoxes, otpValue, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const index = parseInt(
        (event?.target as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );
      if (event?.key === 'Backspace' && otpValue[index] === '') {
        // Move focus to previous input on backspace if current input is empty
        event.preventDefault();
        if (index > 0) {
          const prevInput = getInputFromChildren(inputRefs, index - 1);
          prevInput?.focus();
          prevInput?.select();
        }
      }
      if (event?.key === 'ArrowRight' && index < otpValue.length - 1) {
        event.preventDefault();
        const nextInput = getInputFromChildren(inputRefs, index + 1);
        nextInput?.focus();
        nextInput?.select();
      }
      if (event?.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        const prevInput = getInputFromChildren(inputRefs, index - 1);
        prevInput?.focus();
        prevInput?.select();
      }
    },
    [otpValue],
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pasteData = event.clipboardData
        .getData('Text')
        .slice(0, numOfBoxes);
      const otpCopy = [...otpValue];
      const index = parseInt(
        (event?.currentTarget as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );

      // Distribute the pasted data across input fields
      pasteData.split('').forEach((char, i) => {
        if (index + i < numOfBoxes) {
          otpCopy[index + i] = char;
          const nextInput = getInputFromChildren(inputRefs, index + i);
          nextInput?.focus();
        }
      });

      onChange(otpCopy);
      event.preventDefault();
    },
    [numOfBoxes, otpValue, onChange],
  );

  const handleResendClick = useCallback(() => {
    startResendTimer();
    onChange(Array(numOfBoxes).fill(''));
    onResend();
  }, [onResend, startResendTimer, numOfBoxes, onChange]);

  const displayModifier = useCallback((value: string) => {
    if (!/^[0-9]*$/.test(value)) {
      return '';
    }
    return value;
  }, []);

  return (
    <>
      <Text
        classNames={[styles.enter_otp_text, styles.enter_otp_text__required]}
      >
        Enter OTP
      </Text>
      <div
        ref={inputRefs as any}
        className={styles.box__container}
        data-test-id={dataTestId}
      >
        {Array.from({ length: numOfBoxes }, (_, i) => (
          <Input
            key={i}
            classNames={`${styles.otp__box} ${error ? styles.error : ''}`}
            type="tel"
            secureValue
            showSecureValueIcon={false}
            value={otpValue[i]}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            data-test-id={`${dataTestId}-input-${i}`}
            data-index={i}
            clearInputIcon={false}
            maxLength={1}
            displayModifier={displayModifier}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {showMessage && message && (
        <Banner
          data-test-id="banner-test"
          closeable
          message={
            <span className={styles.otp__success__wrapper}>
              <CheckIcon />
              <Text
                data-test-id={`${dataTestId}-success`}
                classNames={styles.otp__success__color}
                variant="success"
              >
                {message}
              </Text>
            </span>
          }
          variant="success"
          classNames={styles.otp__success__alert}
          duration={6000}
          banner
        />
      )}
      {error && (
        <Text
          data-test-id={`${dataTestId}-error`}
          classNames={styles.otp__error}
        >
          {error}
        </Text>
      )}
      <div className={styles.resend__wrapper}>
        <Button
          data-test-id={`${dataTestId}-resend`}
          disabled={!isResendEnabled}
          type="text"
          onClick={handleResendClick}
          className={styles.resend__wrapper__cta}
        >
          Resend OTP
        </Button>
        <Text classNames={styles.resend__wrapper__text}>
          {timeToResend > 0
            ? ` in ${convertSecondsToMinutes(Math.floor(timeToResend / 1000))}`
            : ''}
        </Text>
      </div>
    </>
  );
}

export default React.memo(OTPWithoutCTAInput);
