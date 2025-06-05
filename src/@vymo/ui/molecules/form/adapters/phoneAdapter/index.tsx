import _ from 'lodash';
import React from 'react';
import { Input } from 'src/@vymo/ui/atoms';
import Phone from 'src/@vymo/ui/molecules/phone';
import {
  getClientConfigData,
  getLocaleCountryCode,
  getPortalConfigData,
} from 'src/workspace/utils';
import { FormContextProps } from '../../formProvider/types';
import { getI18nCountryCallingCode } from './queries';

function PhoneAdapter({
  value,
  onChange,
  placeholder,
  countryCodes,
  enableCountryCodeV2,
  showDisabledIcon,
  i18nConfig = getPortalConfigData()?.i18nSettings ||
    getClientConfigData()?.i18n_config,
  viewMode = false,
  ...props
}: any & FormContextProps) {
  if (
    enableCountryCodeV2 === 'none' ||
    !enableCountryCodeV2 ||
    (enableCountryCodeV2 === 'i18n' && !i18nConfig?.country_calling_code)
  ) {
    return (
      <Input
        {..._.omit(props, 'label')}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="tel"
        showDisabledIcon={showDisabledIcon}
        viewMode={viewMode}
      />
    );
  }

  const i18nCountryCallingCode = getI18nCountryCallingCode(i18nConfig);

  countryCodes =
    enableCountryCodeV2 === 'i18n'
      ? [
          {
            label: i18nCountryCallingCode,
            value: i18nCountryCallingCode,
          },
        ]
      : countryCodes;

  const handleChange = (newValue: string, _event: any, additionalData) => {
    onChange?.(newValue, _event, {
      meta: {
        country_code: additionalData,
      },
    });
  };

  const phoneProps = countryCodes
    ? _.omit(props, ['label', 'minLength', 'maxLength'])
    : _.omit(props, ['label']);

  return (
    <Phone
      {...phoneProps}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      countryCodesFilter={countryCodes}
      countryCallingCode={i18nCountryCallingCode}
      selectedCountryCode={getLocaleCountryCode()}
      viewMode={viewMode}
    />
  );
}

export default PhoneAdapter;
