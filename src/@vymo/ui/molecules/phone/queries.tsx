import { getCountryCallingCode } from 'react-phone-number-input/input';
import { AsYouType, getCountries } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

export const formattedPhoneNumber = (
  input: string,
  countryCallingCode: string,
) => {
  const cleanCallingCode = countryCallingCode.replace(/^\+/, '');
  const countries = getCountries();
  const matchedCountry = countries.find(
    (country) => getCountryCallingCode(country) === cleanCallingCode,
  );

  const formatter = new AsYouType((matchedCountry || 'IN') as CountryCode);
  return formatter.input(input);
};
