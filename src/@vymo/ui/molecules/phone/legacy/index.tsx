import { noop } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';
import PhoneInputWithoutCountrySelect from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import Text from 'src/@vymo/ui/atoms/text';
import classnames from 'classnames';
import { getLabelsByLocale } from './queries';
import { PhoneInputProps } from './types';
import styles from './index.module.scss';

const PhoneLegacy = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<PhoneInputProps>
>(
  (
    {
      label = '',
      defaultCountryCode = 'IN',
      required = false,
      onChange = () => {},
      classNames,
      subMessage = undefined,
      placeholder = 'Enter Phone Number',
      value = '',
      'data-test-id': dataTestId,
      readOnly = false,
      countries,
      locale = 'en',
      showCountrySelect = true,
      onCountryChange = noop,
    },
    ref,
  ) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(subMessage);
    const [countryCode, setCountryCode] = useState<Country>();
    const [labelsByLocale, setLabelsByLocale] = useState<any>();

    const isValidCountryCode = useMemo(
      () => getCountries().includes(defaultCountryCode),
      [defaultCountryCode],
    );

    useEffect(() => {
      if (isValidCountryCode) {
        onCountryChange(`+${getCountryCallingCode(defaultCountryCode)}`);
      }
    }, [defaultCountryCode, isValidCountryCode, onCountryChange]);

    useEffect(() => {
      getLabelsByLocale(locale).then((labels) => setLabelsByLocale(labels));
    }, [locale]);

    useEffect(() => {
      if (value && value.charAt(0) !== '+' && isValidCountryCode) {
        setPhone(`+${getCountryCallingCode(defaultCountryCode)}${value}`);
      } else {
        setPhone(value);
      }
      if (!countryCode && isValidCountryCode) {
        setCountryCode(defaultCountryCode);
      }
    }, [countryCode, defaultCountryCode, isValidCountryCode, value]);

    const handlePhoneInputChange = useCallback(
      (phoneValue) => {
        setPhone(phoneValue);
        onChange(
          phoneValue,
          null,
          null,
          phoneValue && isValidPhoneNumber(phoneValue),
        );
        if (phoneValue && !isValidPhoneNumber(phoneValue)) {
          setError('Please enter a valid phone number.');
        } else if (!phoneValue && required) {
          setError('This field is required');
        } else {
          setError('');
        }
      },
      [onChange, required],
    );

    const handleCountyCodeChange = useCallback(
      (code: Country) => {
        if (code) {
          onCountryChange(`+${getCountryCallingCode(code)}`);
        }
        setCountryCode(code);
      },
      [onCountryChange],
    );

    const phoneInputClasses = classnames([styles.phone__input], classNames);

    useEffect(() => {
      document.documentElement.style.setProperty(
        '--PhoneInputCountryFlag-height',
        '1.2em',
      );
      document.documentElement.style.setProperty(
        '--PhoneInputCountryFlag-borderColor--focus',
        `${getComputedStyle(document.documentElement).getPropertyValue(
          '--brand-primary',
        )}`,
      );
    }, [countryCode, onChange, phone, ref]);
    return (
      <div className={styles.phone__wrapper}>
        {label && <Text>{label}</Text>}
        {showCountrySelect ? (
          <PhoneInput
            title=""
            labels={labelsByLocale}
            countries={countries}
            defaultCountry={countryCode ?? defaultCountryCode}
            addInternationalOption={false}
            disabled={readOnly}
            placeholder={placeholder}
            value={phone}
            onChange={handlePhoneInputChange}
            onCountryChange={handleCountyCodeChange}
            className={phoneInputClasses}
            required={required}
            data-test-id={dataTestId}
          />
        ) : (
          <PhoneInputWithoutCountrySelect
            disabled={readOnly}
            placeholder={placeholder}
            value={phone}
            onChange={handlePhoneInputChange}
            className={phoneInputClasses}
            required={required}
            data-test-id={dataTestId}
          />
        )}

        {error && (
          <div
            data-test-id={`${dataTestId}-subMessage`}
            className={styles.phone__sub_message}
          >
            {error}
          </div>
        )}
      </div>
    );
  },
);

export default PhoneLegacy;
