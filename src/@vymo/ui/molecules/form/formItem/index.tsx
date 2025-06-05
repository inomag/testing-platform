/* eslint-disable complexity */
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import Tooltip from 'src/@vymo/ui/blocks/tooltip';
import classnames from 'classnames';
import { ReactComponent as Failed } from 'src/assets/icons/error.svg';
import { useFormContext } from '../formProvider';
import { FormItemProps } from './types';
import useValidator from './useValidator';
import styles from './index.module.scss';

function FormItem({
  onChange = _.noop,
  label,
  tooltip,
  code,
  validations,
  children,
  required = false,
  verified = null,
  classNames,
  isDateRange = false,
  hidden,
  'data-test-id': dataTestId,
  value,
  type,
  additionalData,
  legacy = false,
  hint,
}: React.PropsWithChildren<FormItemProps>) {
  const {
    appendFieldsAtCode,
    deleteFieldsAtCode,
    setIsLoading: setIsFormLoading,
    getFieldsPayloadData,
    isDebug,
    formValid,
    setFormValidation,
    setReferralData,
    formValue = {},
    config: { viewMode } = { viewMode: false },
    updateFieldState,
  } = useFormContext(legacy);

  const { isValid, errors, validate } = useValidator(
    label ?? '',
    value,
    code,
    required,
    verified,
    type,
    hint,
    validations,
    formValue,
  );

  useEffect(() => {
    // if value is being updated from evaluator, then update the field state as well
    if (!legacy && formValue[code]?.value !== value) {
      const { isCurrentValid, currentErrors } = validate(value, {});
      updateFieldState({
        type,
        code,
        value,
        additionalData,
        isValid: isCurrentValid && !hidden,
        errors: currentErrors,
        touched: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, formValue[code]?.value, formValue[code]?.additionalData]);

  const formItemOnChange = useCallback(
    (val: any, event, changeAdditionalData) => {
      if (isDateRange) val = event;
      const { isCurrentValid, currentErrors } = validate(
        val,
        changeAdditionalData?.oifValid || changeAdditionalData?.meta?.clicked
          ? changeAdditionalData
          : {},
      );
      if (legacy) {
        onChange(
          code,
          val,
          changeAdditionalData,
          isCurrentValid,
          currentErrors,
          true,
        );
      } else {
        updateFieldState({
          type,
          code,
          value: val,
          additionalData: changeAdditionalData,
          isValid: isCurrentValid,
          errors: currentErrors,
          touched: true,
        });
      }
    },
    [code, isDateRange, updateFieldState, validate, onChange, legacy, type],
  );

  // this will run at time of form submission through getFieldsForSubmission in file src/@vymo/ui/molecules/form/formProvider/index.tsx
  useEffect(() => {
    if (formValid === 'in_progress') {
      const { isCurrentValid } = validate(value, additionalData);

      setFormValidation({
        field: {
          code,
          validity: isCurrentValid || hidden ? 'valid' : 'not_valid',
        },
        formValidity: 'in_progress',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValid]);

  const formItemClasses = classnames(
    {
      [styles.form_item_wrapper__error]: !isValid,
    },
    classNames,
  );
  if (hidden) {
    return null;
  }

  return (
    <div
      id={`form-formItem-${code}`}
      data-test-id={`${dataTestId || 'form'}-formItem-${code}`}
      className={styles.form_item_wrapper}
    >
      <div className={styles.form_item_wrapper__label_wrapper}>
        <label
          className={classnames([styles.form_item_wrapper__label], {
            [styles.form_item_wrapper__label__required]:
              !viewMode && Boolean(required) && label,
          })}
          htmlFor={code}
        >
          {label}
          {isDebug && ` (${type})`}
        </label>
        {tooltip && <Tooltip content={tooltip} placement="top" />}
      </div>
      <div className={formItemClasses}>
        {React.Children.map(children, (child) =>
          legacy
            ? React.cloneElement(child, {
                onChange: formItemOnChange,
                id: code,
                hideValidation: true,
                'data-test-id': `${dataTestId}-formItem-${code}-element`,
              })
            : React.cloneElement(child, {
                onChange: formItemOnChange,
                id: code,
                hideValidation: true,
                'data-test-id': `formItem-${code}-element`,
                setReferralData,
                appendFieldsAtCode,
                deleteFieldsAtCode,
                setIsFormLoading,
                code,
                value,
                additionalData,
                getFieldsPayloadData,
                isDebug,
                classNames: isValid ? '' : styles.form_item_wrapper__noBorder,
              }),
        )}
      </div>
      {!isValid && (
        <div
          data-test-id={`${dataTestId || 'form'}-formItem-${code}-error`}
          className={styles.form_item__errors}
        >
          {errors.length > 0 && (
            <div className={styles.form_item__error}>
              <Failed />
              <span className={styles.form_item__error_msg}>{errors[0]}</span>
            </div>
          )}
          {/* {errors.map((error) => (
            <div key={error} className={styles.form_item__error}>
              <Failed />
              <span className={styles.form_item__error_msg}>{errors[0]}</span>
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
}

export default React.memo(FormItem);
