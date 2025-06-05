import { getCurrentUserInfo } from '../queries';

export const getSendOtpPayload = (
  countryCode: string | undefined,
  value: string | undefined,
  locale: string | undefined,
  loginType,
  zone: string | undefined,
) => {
  const client = getCurrentUserInfo()?.client || '';
  const visitor =
    loginType === 'EMAIL'
      ? { email: value }
      : { phone: { countryCode, number: value } };

  return {
    useCase: 'agency',
    type: 'OTP',
    client,
    visitor,
    device_details: {},
    locale,
    zone,
  };
};
