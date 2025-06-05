import { getVerifyOtpPayload } from './queries';

describe('getVerifyOtpPayload', () => {
  it('should return the correct payload', () => {
    const otp = '123456';
    const currentUserInfo = {
      countryCode: '+91',
      userid: '1234567890',
    };
    const requestId = '123';
    const expectedPayload = {
      otp: {
        requestId,
        value: otp,
      },
      useCase: 'agency',
      type: 'OTP',
      visitor: {
        phone: {
          countryCode: currentUserInfo.countryCode,
          number: currentUserInfo.userid,
        },
      },
      client: 'hdfctwl',
      device_details: {},
      locale: 'en-IN',
      zone: '+0530',
    };
    const result = getVerifyOtpPayload(
      otp,
      currentUserInfo,
      requestId,
      'hdfctwl',
      'en-IN',
      'PHONE',
      '+0530',
    );
    expect(result).toEqual(expectedPayload);
  });
  it('should return the correct payload for EMAIL type', () => {
    const otp = '123456';
    const currentUserInfo = {
      userid: 'test@test.com',
    };
    const requestId = '123';
    const expectedPayload = {
      otp: {
        requestId,
        value: otp,
      },
      useCase: 'agency',
      type: 'OTP',
      visitor: {
        email: 'test@test.com',
      },
      client: 'hdfctwl',
      device_details: {},
      locale: 'en-IN',
      zone: '+0530',
    };
    const result = getVerifyOtpPayload(
      otp,
      currentUserInfo,
      requestId,
      'hdfctwl',
      'en-IN',
      'EMAIL',
      '+0530',
    );
    expect(result).toEqual(expectedPayload);
  });
});
