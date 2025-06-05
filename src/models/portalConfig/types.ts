export interface PortalBranding {
  logo: Logo;
  logoBackgroundColor: string;
  banner: Array<Logo>;
  theme: Theme;
  loader: string;
  email: string;
  phone: string;
  bannerTitle: string;
  bannerDescription: string;
}

interface Theme {
  background: string;
  primary: string;
  secondary: string;
  tertiary: string;
  font: string;
  heading: string;
  error: string;
  warning: string;
  info: string;
  success: string;
}

interface Logo {
  url: string;
  height: number;
  width: number;
}

interface Dateincurryear {
  dateTimeFormat: string;
  relativeFormat: boolean;
}

interface Clientdatetimeconfig {
  date_in_curr_year: Dateincurryear;
  date: Dateincurryear;
  meeting_date_time_in_curr_year: Dateincurryear;
  meeting_date_not_in_curr_year: Dateincurryear;
  date_range: Dateincurryear;
  date_in_chart: Dateincurryear;
  time_range: Dateincurryear;
  month_day_in_cal: Dateincurryear;
  month_year_in_cal: Dateincurryear;
  date_time_with_seconds: Dateincurryear;
  day_month_date: Dateincurryear;
  time: Dateincurryear;
}

export interface I18nSettings {
  locale: string;
  language: string;
  country: string;
  currency: string;
  currency_iso: string;
  quantity: string;
  country_calling_code: string;
  client_date_time_config: Clientdatetimeconfig;
  multiLanguageSupported: boolean;
  supportedLanguages: any[];
  timezone: string;
  iana_timezone: string;
}

export interface OtpConfig {
  numberOfDigits: number;
  verificationAttemptsRemaining: number;
  resendAttemptsRemaining: number;
  resendOTPConfig: {
    enabled: boolean;
    interval: number;
    backoff: number;
  };
}

export interface PortalConfig {
  branding: PortalBranding;
  i18nSettings: I18nSettings;
  loginType: 'PHONE' | 'EMAIL';
  otpPolicy: OtpConfig;
}
export interface PortalConfigState {
  initialised: boolean;
  client: string;
  portalConfig: PortalConfig | null;
}

export interface PortalConfigPayload {
  client: string;
  portalConfig: PortalConfig | null;
}
