import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import Button from 'src/@vymo/ui/atoms/button';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import { ReactComponent as CloudDownloadIcon } from 'src/assets/icons/cloudDownload.svg';
import { ReactComponent as Failed } from 'src/assets/icons/error.svg';
import { ReactComponent as Success } from 'src/assets/icons/successCircle.svg';
import Logger from 'src/logger';
import axios from 'src/workspace/axios';
import { useFormContext } from '../../formProvider';
import { InputFieldConfig } from '../../types';
import { DefaultOifTypeProps } from './types';
import styles from './index.module.scss';

const log = new Logger('Default Type OifWrapper');

// eslint-disable-next-line complexity
function DefaultOifType({
  children,
  code,
  oifOptions,
  onChange,
  appendFieldsAtCode,
  isElementDropdownType,
  value,
  type,
  dataTestId,
}: React.PropsWithChildren<DefaultOifTypeProps> & {
  appendFieldsAtCode: FormContextProps['appendFieldsAtCode'];
}) {
  const { url, params, label: oifLabel = '' } = oifOptions ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { formValue } = useFormContext(false);
  const ignoreEmptyValueCheck = ['label'].includes(type);
  const [onChangeData, setOnChangeData] = useState<any>([]);

  const [oifFieldsToAppend, setOifFieldsToAppend] = useState<{
    code: string;
    config: Array<InputFieldConfig>;
  }>({ code: '', config: [] });
  const [elementFieldsToAppend, setElementFieldsToAppend] = useState<{
    code: string;
    config: Array<InputFieldConfig>;
  }>({ code: '', config: [] });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOifData = useCallback(
    _.debounce(async () => {
      setOifFieldsToAppend({ code: '', config: [] });
      const requestBody = {};
      params?.forEach((param) => {
        requestBody[param.code] =
          formValue?.[param.code]?.value ?? formValue?.[param.name]?.value;
      });
      try {
        setIsLoading(true);
        const { data: response } = await axios.post(url, requestBody);
        const { inputs = [] } = response;
        setOifFieldsToAppend({ code, config: inputs });
        setIsLoading(false);
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
        setIsVerified(true);
        setErrorMessage('');
      } catch (error) {
        log.error(error);
        setErrorMessage(
          // @ts-ignore
          error?.response?.data?.error_message ??
            'Something went wrong.Please try Again',
        );
        setIsLoading(false);
      }
    }, 100),
    [formValue, params, onChange],
  );

  useEffect(() => {
    if (!isLoading) {
      appendFieldsAtCode({
        code,
        config: [...elementFieldsToAppend.config, ...oifFieldsToAppend.config],
      });
    }
  }, [
    oifFieldsToAppend,
    elementFieldsToAppend,
    appendFieldsAtCode,
    code,
    isLoading,
  ]);

  useEffect(() => {
    if (value && !isElementDropdownType) {
      fetchOifData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value && isElementDropdownType) {
      fetchOifData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFetchToggle = useCallback(
    (e: MouseEvent) => {
      fetchOifData();
      e?.stopPropagation();
    },
    [fetchOifData],
  );

  const handleChildChange = (
    updatedValue,
    event: React.ChangeEvent<any>,
    additionalData,
  ) => {
    onChange(updatedValue, event, additionalData);
  };

  const handleOnChange = (newValue, event, additionalData, isValid) => {
    setIsVerified(false);
    setErrorMessage('');

    const updatedAdditionalData =
      additionalData && typeof additionalData === 'object'
        ? { ...additionalData, oifValid: false }
        : { oifValid: false };

    setOnChangeData([newValue, event, updatedAdditionalData, isValid]);
    onChange(newValue, event, updatedAdditionalData, isValid);
  };

  return (
    <div
      className={
        styles[!isElementDropdownType && oifLabel === '' ? 'oif_wrapper' : '']
      }
    >
      {!isElementDropdownType
        ? React.cloneElement(children, {
            onChange: handleOnChange,
            appendFieldsAtCode,
            id: code,
            hideValidation: true,
            code,
            value,
            'data-test-id': dataTestId,
          })
        : React.cloneElement(children, {
            onChange: handleChildChange,
            appendFieldsAtCode: setElementFieldsToAppend,
            id: code,
            hideValidation: true,
            code,
            value,
            loading: isLoading,
            'data-test-id': dataTestId,
          })}
      {!isElementDropdownType &&
        (isLoading ? (
          <Loader fullPage visible={isLoading} />
        ) : (
          <>
            {!isVerified && (
              <Button
                size="small"
                type={oifLabel === '' ? 'outlined' : 'link'}
                className={styles.oif_wrapper__oif_button}
                onClick={handleFetchToggle}
                onMouseDown={handleFetchToggle}
                data-test-id="fetch-oif-button"
                disabled={ignoreEmptyValueCheck ? false : !value}
                iconProps={
                  oifLabel === ''
                    ? { icon: <CloudDownloadIcon />, iconPosition: 'left' }
                    : undefined
                }
              >
                {oifLabel === '' ? null : oifLabel}
              </Button>
            )}
            {isVerified && (
              <div className={styles.oif_otp_wrapper__oif_otp_verified}>
                <Success />
                <span>Verified</span>
              </div>
            )}
            {errorMessage && (
              <div className={styles.oif_otp_wrapper__error_wrapper}>
                <Failed />
                <span
                  className={styles.oif_otp_wrapper__error_wrapper__error_msg}
                >
                  {errorMessage}
                </span>
              </div>
            )}
          </>
        ))}
    </div>
  );
}

export default React.memo(DefaultOifType);
