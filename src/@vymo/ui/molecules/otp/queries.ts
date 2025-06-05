// eslint-disable-next-line vymo-ui/restrict-import
import { UserInfo } from 'src/modules/authLegacy/types';

export const getVerifyOtpPayload = (
  otp: string,
  currentUserInfo: UserInfo | null,
  requestId: string | undefined,
  client: string,
  locale: string | undefined,
  loginType,
  zone: string | undefined,
) => {
  const visitor =
    loginType === 'EMAIL'
      ? { email: currentUserInfo?.userid }
      : {
          phone: {
            countryCode: currentUserInfo?.countryCode,
            number: currentUserInfo?.userid,
          },
        };
  return {
    otp: {
      requestId,
      value: otp,
    },
    useCase: 'agency',
    type: 'OTP',
    visitor,
    client,
    device_details: {},
    locale,
    zone,
  };
};
