import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from 'src/@vymo/ui/atoms/input';
import BoxInput from 'src/@vymo/ui/molecules/boxInput';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { setApiStatus, setErrorMessage } from 'src/models/appConfig/slice';
import { getMetaData } from 'src/models/auth/selectors';
import { setPayload } from 'src/models/auth/slice';
import { useAppSelector } from 'src/store/hooks';
import { getValueBasedOnType, validatePayload } from '../queries';
import styles from '../index.module.scss';

type Props = {
  type: 'PASSWORD' | 'MPIN';
};

function SetupAuth({ type }: Props) {
  const dispatch = useDispatch();

  const metaData = useAppSelector(getMetaData);

  const [inputValue, setInputValue] = useState<string | Array<string>>(
    type === 'PASSWORD' ? '' : Array(metaData.numberOfDigits).fill(''),
  );
  const [confirmValue, setConfirmValue] = useState<string | Array<string>>(
    type === 'PASSWORD' ? '' : Array(metaData.numberOfDigits).fill(''),
  );

  const onValueChange = useCallback(
    (newValue: string | Array<string>) => {
      const { valid, errorMessage } = validatePayload(
        'setupAuth',
        type,
        metaData.numberOfDigits,
        getValueBasedOnType(newValue),
        getValueBasedOnType(confirmValue),
      );
      setInputValue(newValue);
      dispatch(setApiStatus(undefined));
      dispatch(setErrorMessage(errorMessage));
      dispatch(
        setPayload({
          inputs: [
            {
              code: 'mpin',
              value: getValueBasedOnType(newValue),
            },
            {
              code: 'confirmMpin',
              value: getValueBasedOnType(confirmValue),
            },
          ],
          encryptPayload: true,
          valid,
        }),
      );
    },
    [confirmValue, dispatch, metaData.numberOfDigits, type],
  );

  const handleConfirmChange = useCallback(
    (newConfirmValue) => {
      const { valid, errorMessage } = validatePayload(
        'setupAuth',
        type,
        metaData.numberOfDigits,
        getValueBasedOnType(inputValue),
        getValueBasedOnType(newConfirmValue),
      );
      setConfirmValue(newConfirmValue);
      dispatch(setApiStatus(undefined));
      dispatch(setErrorMessage(errorMessage));
      dispatch(
        setPayload({
          inputs: [
            {
              code: 'mpin',
              value: getValueBasedOnType(inputValue),
            },
            {
              code: 'confirmMpin',
              value: getValueBasedOnType(newConfirmValue),
            },
          ],
          encryptPayload: true,
          valid,
        }),
      );
    },
    [dispatch, inputValue, metaData.numberOfDigits, type],
  );

  const setupAuthComponent = useMemo(() => {
    if (type === 'PASSWORD') {
      return (
        <>
          <Input
            data-test-id="auth-module-password"
            label={locale(Keys.PASSWORD)}
            type="password"
            placeholder={locale(Keys.ENTER_PASSWORD)}
            value={inputValue as string}
            onChange={onValueChange}
            required
            hideValidation={!inputValue}
          />
          <Input
            data-test-id="auth-module-confirm-password"
            label={locale(Keys.CONFIRM_PASSWORD)}
            type="password"
            placeholder={locale(Keys.CONFIRM_PASSWORD)}
            value={confirmValue as string}
            onChange={(e) => handleConfirmChange(e.target.value)}
            required
          />
        </>
      );
    }

    if (type === 'MPIN') {
      return (
        <>
          <BoxInput
            data-test-id="auth-module-mpin"
            numOfBoxes={metaData.numberOfDigits}
            value={inputValue as Array<string>}
            onChange={onValueChange}
          />
          <BoxInput
            data-test-id="auth-module-confirm-mpin"
            numOfBoxes={metaData.numberOfDigits}
            label={locale(Keys.CONFIRM_MPIN)}
            value={confirmValue as Array<string>}
            onChange={handleConfirmChange}
          />
        </>
      );
    }

    return null;
  }, [
    type,
    inputValue,
    confirmValue,
    handleConfirmChange,
    metaData.numberOfDigits,
    onValueChange,
  ]);

  return (
    <div className={styles.otp__container}>
      <div className={styles.otp__container__content}>{setupAuthComponent}</div>
    </div>
  );
}

export default SetupAuth;
