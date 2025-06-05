import { parsePhoneNumber } from 'react-phone-number-input/input';

export const getI18nCountryCallingCode = (i18nConfig: {
  country_calling_code;
}) => {
  if (i18nConfig?.country_calling_code) {
    return i18nConfig?.country_calling_code?.startsWith('+')
      ? i18nConfig?.country_calling_code
      : `+${i18nConfig?.country_calling_code}`;
  }
  return null;
};

export const getCountryCodeAndValueForPhone = (
  value: string,
  i18nConfig: any,
) => {
  if (value) {
    const phoneNumber = parsePhoneNumber(value);
    return [phoneNumber?.countryCallingCode, phoneNumber?.number];
  }

  return [getI18nCountryCallingCode(i18nConfig)];
};
