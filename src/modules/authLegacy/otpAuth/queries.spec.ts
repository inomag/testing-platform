import { getSendOtpPayload } from './queries';

describe('getSendOtpPayload', () => {
  it('should return the correct payload for PHONE type', () => {
    const countryCode = '91';
    const number = '1234567890';

    const expectedPayload = {
      useCase: 'agency',
      type: 'OTP',
      client: '',
      visitor: {
        phone: {
          countryCode,
          number,
        },
      },
      device_details: {},
      locale: 'en-IN',
      zone: '+0530',
    };

    const result = getSendOtpPayload(
      countryCode,
      number,
      'en-IN',
      'PHONE',
      '+0530',
    );

    expect(result).toEqual(expectedPayload);
  });
  it('should return the correct payload for EMAIL type', () => {
    const countryCode = '91';
    const userid = 'test@test.com';
    const expectedPayload = {
      useCase: 'agency',
      type: 'OTP',
      client: '',
      visitor: {
        email: 'test@test.com',
      },
      device_details: {},
      locale: 'en-IN',
      zone: '+0530',
    };

    const result = getSendOtpPayload(
      countryCode,
      userid,
      'en-IN',
      'EMAIL',
      '+0530',
    );

    expect(result).toEqual(expectedPayload);
  });
});
