import { getCountryCallingCode } from 'react-phone-number-input/input';
import type { CountryCode } from 'libphonenumber-js';
import { formattedPhoneNumber } from './queries';

jest.mock('react-phone-number-input/input', () => ({
  getCountryCallingCode: jest.fn(),
}));

describe('formattedPhoneNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format number correctly for a matched country', () => {
    (getCountryCallingCode as jest.Mock).mockImplementation(
      (country: CountryCode) => {
        if (country === 'IN') return '91';
        if (country === 'US') return '1';
        return '';
      },
    );

    const input = '9876543210';
    const countryCallingCode = '+91';

    const result = formattedPhoneNumber(input, countryCallingCode);

    expect(result).toBe('98765 43210');
  });

  it('should default to IN if no country matches the calling code', () => {
    (getCountryCallingCode as jest.Mock).mockImplementation(
      (country: CountryCode) => {
        if (country === 'IN') return '91';
        return '000';
      },
    );

    const input = '9999999999';
    const countryCallingCode = '+999';

    const result = formattedPhoneNumber(input, countryCallingCode);

    expect(result).toBe('99999 99999');
  });
});
