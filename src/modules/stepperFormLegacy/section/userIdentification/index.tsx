import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Chip from 'src/@vymo/ui/atoms/chip';
import Input from 'src/@vymo/ui/atoms/input';
import { IconPosition } from 'src/@vymo/ui/atoms/input/types';
import Text from 'src/@vymo/ui/atoms/text';
import Aadhar from 'src/@vymo/ui/molecules/identification/aadhar';
import Pan from 'src/@vymo/ui/molecules/identification/pan';
import classNames from 'classnames';
import { ReactComponent as CheckIcon } from 'src/assets/icons/check.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  getApiError,
  getApiStatusForEdit,
  getIsUserIdValidated,
} from 'src/models/stepperFormLegacy/selectors';
import { setApiError } from 'src/models/stepperFormLegacy/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { API_STATUS, USER_IDENTIFICATION_TYPE } from '../../constants';
import { UserIdentificationProps } from '../../types';
import { getInput, getUserIdentificationAttributes } from './queries';
import styles from './index.module.scss';

function UserIdentification({
  section,
  value,
  handleIdentificationChange,
  handleEditButton,
  closeEditModal,
  handleSubmit,
}: UserIdentificationProps) {
  const { type, label, code, readOnly, required } =
    getUserIdentificationAttributes(section);
  const [isValidValue, setIsValidValue] = useState<boolean>(true);
  const isValidated = useAppSelector((state) =>
    getIsUserIdValidated(state, code),
  );
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(value);
  const apiErrorMessage = useAppSelector(getApiError);
  const apiStatusForEdit = useAppSelector(getApiStatusForEdit);
  const isEditModal = !!closeEditModal;

  const handleChange = useCallback(
    (newValue, event, additionalData, isValid) => {
      if (apiErrorMessage) {
        dispatch(setApiError(''));
      }
      setInputValue(newValue);
      if (!isEditModal) {
        handleIdentificationChange(newValue);
      }
      setIsValidValue(isValid);
    },
    [apiErrorMessage, dispatch, handleIdentificationChange, isEditModal],
  );

  const handleValidate = useCallback(() => {
    if (inputValue && isValidValue) {
      const input = getInput(section);
      if (isEditModal) {
        handleSubmit(section, { input, value: inputValue, isEdit: true });
      } else {
        handleSubmit(section, { input, value });
      }
    }
  }, [inputValue, isValidValue, section, isEditModal, handleSubmit, value]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!inputValue) {
      setIsValidValue(false);
    }
  }, [inputValue]);

  useEffect(() => {
    if (apiStatusForEdit.status === API_STATUS.SUCCESS) {
      setInputValue(value);
    }
  }, [apiStatusForEdit, value]);

  const apiErrorText = useMemo(() => {
    if (
      isEditModal &&
      apiStatusForEdit.status === API_STATUS.VALIDATION_ERROR
    ) {
      return <Text variant="error">{apiStatusForEdit.error}</Text>;
    }
    if (apiErrorMessage) {
      return <Text variant="error">{apiErrorMessage}</Text>;
    }
    return null;
  }, [apiErrorMessage, apiStatusForEdit, isEditModal]);

  const identificationProps = useMemo(() => {
    if (isValidated && !isEditModal) {
      return {
        onChange: handleChange,
        value: inputValue,
        subMessage: apiErrorText,
        icon: (
          <Chip
            type="success"
            label="Validated"
            iconProps={{ icon: <CheckIcon />, iconPosition: 'left' }}
          />
        ),
        readOnly,
        iconPosition: 'right' as IconPosition,
      };
    }
    return {
      onChange: handleChange,
      value: inputValue,
      subMessage: apiErrorText,
    };
  }, [
    isValidated,
    isEditModal,
    handleChange,
    inputValue,
    apiErrorText,
    readOnly,
  ]);

  const identificationLabel = useMemo(
    () => (
      <div className={styles['identification-container__label']}>
        <div
          className={classNames({
            [styles['identification-container__required']]: required,
          })}
        >
          {label}
        </div>
        {isValidated && !isEditModal && (
          <Button
            type="text"
            className={styles['identification-container__btn']}
            onClick={handleEditButton}
            data-test-id="edit-pan-btn"
          >
            {locale(Keys.EDIT)}
          </Button>
        )}
      </div>
    ),
    [handleEditButton, isEditModal, isValidated, label, required],
  );

  useEffect(() => {
    if (closeEditModal && apiStatusForEdit.status === API_STATUS.SUCCESS) {
      closeEditModal();
    }
  }, [apiStatusForEdit, closeEditModal]);

  const identificationInput = useMemo(() => {
    switch (type) {
      case USER_IDENTIFICATION_TYPE.PAN:
        return <Pan {...identificationProps} />;
      case USER_IDENTIFICATION_TYPE.AADHAAR:
        return <Aadhar {...identificationProps} />;
      default:
        return <Input {...identificationProps} />;
    }
  }, [identificationProps, type]);

  return (
    <div className={styles['identification-container']}>
      <div>
        <Text>{identificationLabel}</Text>
        {identificationInput}
        {type !== USER_IDENTIFICATION_TYPE.AADHAAR &&
          type !== USER_IDENTIFICATION_TYPE.PAN && (
            <>
              <Text>
                {locale(Keys.USE)}
                <Button
                  className={styles['identification-container__link']}
                  type="link"
                  linkProps={{
                    href: 'https://pdb.nipr.com/html/NPNsearch.htm',
                    target: '_blank',
                  }}
                >
                  {locale(Keys.NPN_LOOKUP_TOOL)}
                </Button>
                {locale(Keys.HELP_IF_UNKNOWN_NPN)}
              </Text>
              <br />
            </>
          )}
        {!isValidated || isEditModal ? (
          <Button
            disabled={!isValidValue}
            className={styles.validate__button}
            onClick={handleValidate}
            data-test-id="validate-pan-btn"
          >
            {apiErrorText ? locale(Keys.RETRY) : locale(Keys.VALIDATE)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default UserIdentification;
