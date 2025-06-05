import React, { useCallback, useEffect, useState } from 'react';
import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';
import { Input, Tag, Text } from 'src/@vymo/ui/atoms';
import { List, Popup } from 'src/@vymo/ui/blocks';
import type { CountryCode } from 'libphonenumber-js';
import {
  getClientConfigData,
  getLocaleCountryCode,
  getPortalConfigData,
} from 'src/workspace/utils';
import { getLabelsByLocale } from './legacy/queries';
import { formattedPhoneNumber } from './queries';
import { Props } from './types';
import styles from './index.module.scss';

function Phone({
  disabled,
  value,
  countryCallingCode,
  countryCodesFilter = [],
  onChange,
  'data-test-id': dataTestId,
  viewMode = false,
  locale = getPortalConfigData()?.i18nSettings?.language ||
    getClientConfigData()?.i18n_config?.language ||
    'en',
  ...props
}: React.PropsWithChildren<Props>) {
  const availableCountries = getCountries().filter((country) =>
    countryCodesFilter.includes(country),
  );

  const [phoneValue, setPhoneValue] = useState<string>(value as string);

  const selectedCountryCallingCode =
    countryCallingCode ||
    `+${getCountryCallingCode(getLocaleCountryCode() as CountryCode)}` ||
    '+1';

  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(
    availableCountries.findIndex(
      (country) =>
        getCountryCallingCode(country) === selectedCountryCallingCode,
    ),
  );

  const [selectedPhoneCountryCallingCode, setSelectedPhoneCountryCallingCode] =
    useState(selectedCountryCallingCode);

  const [labelsByLocale, setLabelsByLocale] = useState<any>({});

  useEffect(() => {
    getLabelsByLocale(locale).then((labels) => setLabelsByLocale(labels));
  }, [locale]);

  useEffect(() => {
    setPhoneValue(value);
  }, [value]);

  useEffect(() => {
    if (phoneValue) {
      const cleanedPhoneValue = phoneValue?.replace(/\D/g, '');
      let formatted;
      if (phoneValue.length > 4) {
        formatted = formattedPhoneNumber(
          cleanedPhoneValue,
          selectedPhoneCountryCallingCode,
        );
      }
      setPhoneValue(formatted);
      onChange(phoneValue, '', selectedPhoneCountryCallingCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhoneCountryCallingCode, phoneValue]);

  const onChangePhone = useCallback(
    (event) => {
      const input = event.target.value;
      let formatted;
      if (input.length > 4) {
        formatted = formattedPhoneNumber(
          input,
          selectedPhoneCountryCallingCode,
        );
      }
      setPhoneValue(formatted);

      onChange(formatted ?? input, event, selectedPhoneCountryCallingCode);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, selectedPhoneCountryCallingCode],
  );

  const onCountryCodeClick = useCallback(
    (index) => {
      setSelectedPhoneIndex(index);
      setSelectedPhoneCountryCallingCode(
        `+${getCountryCallingCode(availableCountries[index])}`,
      );
    },
    [availableCountries],
  );

  return (
    <Input
      classNames={styles.phone}
      variant="custom"
      data-test-id={dataTestId}
      disabled={disabled}
      clearInputIcon={false}
      renderInputBase={
        <>
          <div className={styles.phone__countryCode}>
            {availableCountries.length > 1 ? (
              <Popup
                className={styles.phone__countryCode__popup}
                placement="bottom"
                closeTrigger="click"
                content={
                  <List
                    onItemClick={onCountryCodeClick}
                    selectedIndex={selectedPhoneIndex}
                    showSelected
                    scrollBehaviour="instant"
                  >
                    {availableCountries.map((country) => (
                      <List.Item
                        key={country}
                        className={styles.phone__countryCode__popup__item}
                      >
                        <Text type="label"> {labelsByLocale[country]}</Text>
                        <Text type="sublabel">
                          +{getCountryCallingCode(country)}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                }
              >
                <Tag
                  bold={false}
                  data-test-id={`${dataTestId}-select-code`}
                  className={styles.phone__countryCode__tag}
                >
                  {selectedPhoneCountryCallingCode}
                </Tag>
              </Popup>
            ) : (
              <Tag bold={false} className={styles.phone__countryCode__tag}>
                {selectedPhoneCountryCallingCode}
              </Tag>
            )}
          </div>

          <input
            {...props}
            type="tel"
            className={styles.phone__input}
            onChange={onChangePhone}
            value={phoneValue}
            disabled={disabled}
          />
        </>
      }
      viewMode={viewMode}
    />
  );
}

export default Phone;
