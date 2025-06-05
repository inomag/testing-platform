// update path accordingly
import { parsePhoneNumber } from 'react-phone-number-input/input';
import { getCountryCodeAndValueForPhone } from './queries';

jest.mock('react-phone-number-input/input', () => ({
  ...jest.requireActual('react-phone-number-input/input'),
  parsePhoneNumber: jest.fn(),
}));

describe('getCountryCodeAndValueForPhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse and return countryCallingCode and number when value is present', () => {
    (parsePhoneNumber as jest.Mock).mockReturnValue({
      countryCallingCode: '1',
      number: '+1234567890',
    });

    const result = getCountryCodeAndValueForPhone('+1234567890', {});
    expect(result).toEqual(['1', '+1234567890']);
  });

  it('should return calling code from i18n config when no value is passed', () => {
    const result = getCountryCodeAndValueForPhone('', {
      country_calling_code: '44',
    });
    expect(result).toEqual(['+44']);
  });

  it('should return null in array if no value and no i18n config', () => {
    const result = getCountryCodeAndValueForPhone('', {});
    expect(result).toEqual([null]);
  });
});
