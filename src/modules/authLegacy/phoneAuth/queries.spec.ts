import { getSendOtpPayload } from './queries';

describe('getSendOtpPayload Function Tests', () => {
  it('should return payload with email when loginType is EMAIL', () => {
    const result = getSendOtpPayload(
      'US',
      'test@example.com',
      'en',
      'EMAIL',
      'UTC',
    );

    expect(result).toEqual({
      useCase: 'agency',
      type: 'OTP',
      client: '',
      visitor: { email: 'test@example.com' },
      device_details: {},
      locale: 'en',
      zone: 'UTC',
    });
  });

  it('should return payload with phone when loginType is not EMAIL', () => {
    const result = getSendOtpPayload('US', '1234567890', 'en', 'PHONE', 'UTC');

    expect(result).toEqual({
      useCase: 'agency',
      type: 'OTP',
      client: '',
      visitor: { phone: { countryCode: 'US', number: '1234567890' } },
      device_details: {},
      locale: 'en',
      zone: 'UTC',
    });
  });

  it('should handle undefined values for optional parameters', () => {
    const result = getSendOtpPayload(
      undefined,
      undefined,
      undefined,
      'EMAIL',
      undefined,
    );

    expect(result).toEqual({
      useCase: 'agency',
      type: 'OTP',
      client: '',
      visitor: { email: undefined },
      device_details: {},
      locale: undefined,
      zone: undefined,
    });
  });

  it('should correctly construct visitor object based on countryCode and value for PHONE loginType', () => {
    const result = getSendOtpPayload(
      'IN',
      '9876543210',
      'en',
      'PHONE',
      'Asia/Kolkata',
    );
    expect(result.visitor).toEqual({
      phone: { countryCode: 'IN', number: '9876543210' },
    });
  });

  it('should return payload with empty countryCode when it is undefined and loginType is PHONE', () => {
    const result = getSendOtpPayload(
      undefined,
      '9876543210',
      'en',
      'PHONE',
      'UTC',
    );

    expect(result.visitor).toEqual({
      phone: { countryCode: undefined, number: '9876543210' },
    });
  });
});
