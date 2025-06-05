export type ScenarioType = {
  scenario:
    | 'loginType'
    | 'userId'
    | 'verifyUserInput'
    | 'verifyUserAuth'
    | 'userAuthentication'
    | 'setupAuth';
  type?:
    | 'OTP'
    | 'MPIN'
    | 'PASSWORD'
    | 'EMAIL'
    | 'PHONE'
    | 'INTERNAL'
    | 'EXTERNAL'
    | 'ALL';

  functionality?: 'partial' | 'full';
};

type ProviderName = 'google' | 'facebook' | 'twitter';

export type MetaData = {
  providers?: ProviderName[];
  [key: string]: any;
};

export type AuthHeaderUi = {
  title?: string;
  description?: string;
  image?: string;
};
