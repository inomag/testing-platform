/* eslint-disable complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import Button from 'src/@vymo/ui/atoms/button';
import Modal, { Body, Footer, Header } from 'src/@vymo/ui/blocks/modal';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import OtpWithoutCTA from 'src/@vymo/ui/molecules/otp/input/otpWithoutCTA';
import { ReactComponent as Failed } from 'src/assets/icons/error.svg';
import { ReactComponent as Success } from 'src/assets/icons/successCircle.svg';
import Logger from 'src/logger';
// eslint-disable-next-line vymo-ui/restrict-import
import { getOtpConfig } from 'src/models/portalConfig/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { OtpConfig } from 'src/models/portalConfig/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { useAppSelector } from 'src/store/hooks';
import axios from 'src/workspace/axios';
import { useFormContext } from '../../formProvider';
import { InputFieldConfig } from '../../types';
import { OTPAndDPPTypeOifProps } from './types';
import styles from './index.module.scss';

const log = new Logger('OTP and DPP OifWrapper');

const defaultOTPConfig = {
  numberOfDigits: 6,
  verificationAttemptsRemaining: 3,
  resendAttemptsRemaining: 5,
  resendOTPConfig: {
    enabled: true,
    interval: 60000,
    backoff: 0,
  },
};

function OTPAndDPPTypeOif({
  children,
  code,
  oifOptions,
  onChange,
  appendFieldsAtCode,
  value,
  label,
  customPayload,
  verified: verifiedFromProps = false,
  dataTestId,
}: React.PropsWithChildren<OTPAndDPPTypeOifProps> & {
  appendFieldsAtCode: FormContextProps['appendFieldsAtCode'];
}) {
  const {
    type: oifType,
    label: oifLabel,
    dppIntegrationEventHandler,
  } = oifOptions ?? {};

  const otpConfig = useAppSelector(getOtpConfig) ?? defaultOTPConfig;

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    data: { message: '', requestId: '', type: '' },
  });
  const [otp, setOtp] = useState(Array(otpConfig?.numberOfDigits).fill(''));
  const [otpMeta, setOtpMeta] = useState(otpConfig as OtpConfig);
  const [isVerifyEnabled, setIsVerifyEnabled] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(verifiedFromProps);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isValueValid, setIsValueValid] = useState<boolean>(false);
  const [onChangeData, setOnChangeData] = useState<any>([]);
  const [oifFieldsToAppend, setOifFieldsToAppend] = useState<{
    code: string;
    config: Array<InputFieldConfig>;
  }>({ code: '', config: [] });

  useEffect(() => {
    if (!isLoading) {
      appendFieldsAtCode({
        code,
        config: [...oifFieldsToAppend.config],
      });
    }
  }, [oifFieldsToAppend, appendFieldsAtCode, code, isLoading]);

  const { formValue } = useFormContext(false);

  useEffect(() => {
    setIsValueValid(formValue[code]?.isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerOTP = useCallback(
    async (triggerType) => {
      const requestBody = {
        payload: {
          code,
          value,
          action: triggerType,
          ...(triggerType === 'resend_otp' && {
            requestId: modal?.data?.requestId,
          }),
        },
        voInfo: customPayload?.oifFieldVerifyVoPayload,
      };
      try {
        setIsLoading(true);
        const { data: response } = await axios.post(
          `/input/field-verify/${oifType}`,
          requestBody,
        );
        const {
          verificationAttemptsRemaining,
          resendAttemptsRemaining,
          message,
          otp: otpResponse,
        } = response;
        setOtpMeta({
          ...otpMeta,
          verificationAttemptsRemaining,
          resendAttemptsRemaining,
        });
        setModal({
          visible: true,
          data: { requestId: otpResponse.requestId, message, type: 'success' },
        });
        setOtp(Array(otpMeta?.numberOfDigits).fill(''));
        setIsLoading(false);
      } catch (error) {
        log.error(error);
        setIsLoading(false);
        setModal({
          visible: true,
          data: {
            requestId:
              // @ts-ignore
              error?.response?.data?.otp?.requestId ?? modal?.data?.requestId,
            // we are adding this for resend exhaust case and user close the modal but still has verification attempts remaining attempts remaining
            message:
              // @ts-ignore
              error?.response?.data?.error ??
              'Something went wrong.Please try Again',
            type: 'error',
          },
        });
        setOtpMeta({
          ...otpMeta,
          verificationAttemptsRemaining:
            // @ts-ignore
            error?.response?.data?.verificationAttemptsRemaining ??
            otpMeta?.verificationAttemptsRemaining,
          resendAttemptsRemaining:
            // @ts-ignore
            error?.response?.data?.resendAttemptsRemaining ??
            otpMeta?.resendAttemptsRemaining,
        });
      }
    },
    [
      code,
      customPayload?.oifFieldVerifyVoPayload,
      modal?.data?.requestId,
      oifType,
      otpMeta,
      value,
    ],
  );

  const verifyOtp = useCallback(async () => {
    const requestBody = {
      payload: {
        code,
        value,
        otp: otp.join(''),
        action: 'verify_otp',
        requestId: modal?.data?.requestId,
      },
      voInfo: customPayload?.oifFieldVerifyVoPayload,
    };
    try {
      setIsLoading(true);
      await axios.post(`/input/field-verify/${oifType}`, requestBody);
      setModal({
        visible: false,
        data: { message: '', requestId: '', type: '' },
      });
      setOtp(Array(otpMeta?.numberOfDigits).fill(''));
      const onChangeDataCopy =
        onChangeData.length === 0
          ? [
              value,
              null,
              formValue?.[code]?.additionalData,
              formValue?.[code]?.isValid,
            ]
          : (onChangeData as Parameters<typeof onChange>);
      onChangeDataCopy[2] = { ...onChangeData[2], oifValid: true };
      onChange(...(onChangeDataCopy as Parameters<typeof onChange>));
      setVerified(true);
      setIsLoading(false);
    } catch (error) {
      log.error(error);
      setModal({
        visible: true,
        data: {
          requestId: modal?.data?.requestId,
          message:
            // @ts-ignore
            error?.response?.data?.error ??
            'Something went wrong.Please try Again',
          type: 'error',
        },
      });
      setOtpMeta({
        ...otpMeta,
        verificationAttemptsRemaining:
          // @ts-ignore
          error?.response?.data?.verificationAttemptsRemaining ??
          otpMeta?.verificationAttemptsRemaining,
        resendAttemptsRemaining:
          // @ts-ignore
          error?.response?.data?.resendAttemptsRemaining ??
          otpMeta?.resendAttemptsRemaining,
      });
      setIsLoading(false);
    }
  }, [
    code,
    customPayload?.oifFieldVerifyVoPayload,
    formValue,
    modal?.data?.requestId,
    oifType,
    onChange,
    onChangeData,
    otp,
    otpMeta,
    value,
  ]);

  const fetchDppData = useCallback(async () => {
    const requestBody = {
      payload: {
        code,
        value,
        dppIntegrationEventHandler,
      },
      voInfo: customPayload?.oifFieldVerifyVoPayload,
    };
    try {
      setIsLoading(true);
      setErrorMessage('');
      const { data: response } = await axios.post(
        `/input/field-verify/${oifType}`,
        requestBody,
      );
      const { inputs = [] } = response;
      setOifFieldsToAppend({ code, config: inputs });
      const onChangeDataCopy =
        onChangeData.length === 0
          ? [
              value,
              null,
              formValue?.[code]?.additionalData,
              formValue?.[code]?.isValid,
            ]
          : (onChangeData as Parameters<typeof onChange>);
      onChangeDataCopy[2] = { ...onChangeData[2], oifValid: true };
      onChange(...(onChangeDataCopy as Parameters<typeof onChange>));
      setVerified(true);
      setIsLoading(false);
    } catch (error) {
      log.error(error);
      setErrorMessage(
        // @ts-ignore
        error?.response?.data?.error ?? 'Something went wrong.Please try Again',
      );
      setIsLoading(false);
    }
  }, [
    code,
    customPayload?.oifFieldVerifyVoPayload,
    dppIntegrationEventHandler,
    formValue,
    oifType,
    onChange,
    onChangeData,
    value,
  ]);

  const sendOTP = useCallback(async () => {
    triggerOTP('send_otp');
  }, [triggerOTP]);

  const onResend = useCallback(async () => {
    triggerOTP('resend_otp');
  }, [triggerOTP]);

  const handleOnChange = (...args: Parameters<typeof onChange>) => {
    setVerified(false);
    setErrorMessage('');
    setIsValueValid(args[3] ?? false);

    if (args[2] && typeof args[2] === 'object') {
      args[2] = {
        ...args[2],
        oifValid: false, // Adding `verified` key
      };
    } else {
      args[2] = {
        oifValid: false, // Adding `verified` key
      };
    }
    setOnChangeData([...args]);
    onChange(...args);
  };

  const otpOnChange = (otpValue) => {
    setOtp(otpValue);
    setIsVerifyEnabled(
      !otpValue.includes('') &&
        !isLoading &&
        otpValue.join('').length === otpMeta?.numberOfDigits,
    );
  };

  return (
    <>
      {oifType === 'dpp' && (
        <Loader visible={isLoading} fullPage className={styles.oif_loaader} />
      )}
      <div className={styles.oif_otp_wrapper}>
        {React.cloneElement(children, {
          onChange: handleOnChange,
          appendFieldsAtCode,
          id: code,
          hideValidation: true,
          code,
          value,
          loading: isLoading,
          'data-test-id': dataTestId,
        })}
        {!verified && oifType === 'otp' && (
          <Button
            size="small"
            type="link"
            onClick={sendOTP}
            data-test-id="fetch-oif-button"
            disabled={!value || !isValueValid || isLoading}
          >
            {oifLabel ?? 'Verify'}
          </Button>
        )}
        {errorMessage && oifType === 'dpp' && (
          <div className={styles.oif_otp_wrapper__error_wrapper}>
            <Failed />
            <span className={styles.oif_otp_wrapper__error_wrapper__error_msg}>
              {errorMessage}
            </span>
          </div>
        )}
        {!verified && oifType === 'dpp' && (
          <Button
            size="small"
            type="link"
            onClick={fetchDppData}
            data-test-id="fetch-oif-button"
            disabled={!value || !isValueValid || isLoading}
          >
            {oifLabel ?? 'Fetch'}
          </Button>
        )}
        {verified && (
          <div className={styles.oif_otp_wrapper__oif_otp_verified}>
            <Success />
            <span>Verified</span>
          </div>
        )}
      </div>
      <Modal
        classNames={styles.oif_otp_modal}
        open={modal.visible}
        onClose={() =>
          setModal({
            visible: false,
            data: { message: '', requestId: '', type: '' },
          })
        }
      >
        <Header>
          <div className={styles.oif_otp_modal__heading}>
            Verify Your {label}
          </div>
        </Header>
        <Body>
          <p>We have sent an OTP to {value}</p>
          <OtpWithoutCTA
            data-test-id="oif-otp-input"
            error=""
            onResend={onResend}
            numOfBoxes={otpMeta?.numberOfDigits ?? 6}
            message=""
            resendTimer={otpMeta?.resendOTPConfig?.interval ?? 30000}
            otpResendsRemaining={otpMeta?.resendAttemptsRemaining ?? 3}
            verificationAttemptsRemaining={
              otpMeta?.verificationAttemptsRemaining
            }
            onChange={otpOnChange}
            value={otp}
          />
          {modal.data.message && (
            <div
              className={
                modal.data.type === 'success'
                  ? styles.oif_otp_modal__success_msg
                  : styles.oif_otp_modal__error_msg
              }
            >
              {modal?.data?.message}
            </div>
          )}
        </Body>
        <Footer>
          <Button
            className={styles.oif_otp_modal__button}
            type="primary"
            onClick={verifyOtp}
            disabled={
              !isVerifyEnabled || otpMeta?.verificationAttemptsRemaining === 0
            }
            size="medium"
          >
            Continue
          </Button>
        </Footer>
      </Modal>
    </>
  );
}

export default React.memo(OTPAndDPPTypeOif);
