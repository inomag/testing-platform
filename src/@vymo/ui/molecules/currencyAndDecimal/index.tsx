/* eslint-disable complexity */
import _ from 'lodash';
import React, { useCallback } from 'react';
import { Input } from 'src/@vymo/ui/atoms';
import { decimalValidation } from './constant';
import {
  convertValueFromI18nToNative,
  formatCurrency,
  reverseIntl,
} from './queries';
import { CurrencyAndDecimalInputProps } from './types';

function CurrencyAndDecimalInput({
  value,
  disabled,
  onChange,
  placeholder,
  minLength,
  maxLength,
  isCurrency,
  validations = [],
  hideValidation = false,
  'data-test-id': datatTestId,
  currencySymbol = '₹',
  currencyIso = 'INR',
  locale = 'en-US',
  viewMode = false,
  ...props
}: CurrencyAndDecimalInputProps) {
  const handleChange = useCallback(
    (newValue, event, validValue, errors) => {
      let additionalData: any = null;
      if (isCurrency) {
        additionalData = {
          meta: {
            currency_iso: currencyIso,
          },
        };
      } else {
        additionalData = {
          meta: {},
        };
      }
      onChange(newValue, event, additionalData, validValue, errors);
    },
    [currencyIso, isCurrency, onChange],
  );

  const displayModifier = useCallback(
    (newValue) =>
      formatCurrency(
        _.toString(convertValueFromI18nToNative(newValue, locale)),
        locale,
      ),
    [locale],
  );
  const displayDeModifier = useCallback(
    (newValue) => reverseIntl(newValue, locale),
    [locale],
  );

  return isCurrency ? (
    <Input
      iconLeft={currencySymbol}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
      validations={validations}
      displayModifier={displayModifier}
      displayDeModifier={displayDeModifier}
      hideValidation={hideValidation}
      data-test-id={datatTestId}
      viewMode={viewMode}
      required
      {...props}
    />
  ) : (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
      validations={[...validations, ...decimalValidation]}
      displayModifier={displayModifier}
      displayDeModifier={displayDeModifier}
      hideValidation={hideValidation}
      data-test-id={datatTestId}
      viewMode={viewMode}
      {...props}
    />
  );
}

export default CurrencyAndDecimalInput;
