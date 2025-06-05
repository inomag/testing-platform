import type { RootState } from 'src/store';
import { PortalBranding, PortalConfigState } from './types';

export const getPortalConfigState = (state: RootState): PortalConfigState =>
  state.portalConfig;

export const getIsInitialised = (state: RootState) =>
  getPortalConfigState(state).initialised;

export const getClientCode = (state: RootState) =>
  getPortalConfigState(state).client;

export const getPortalBranding = (
  state: RootState,
): PortalBranding | undefined =>
  getPortalConfigState(state)?.portalConfig?.branding;

export const getPortalI18nSettings = (state: RootState) =>
  getPortalConfigState(state)?.portalConfig?.i18nSettings;

export const getCountry = (state: RootState) =>
  getPortalI18nSettings(state)?.country;

export const getLanguage = (state: RootState) =>
  getPortalI18nSettings(state)?.language;

export const getLoginType = (state: RootState) =>
  (getPortalConfigState(state)?.portalConfig?.loginType?.toUpperCase() as
    | 'PHONE'
    | 'EMAIL') || 'PHONE';

export const getLocale = (state: RootState) =>
  getPortalI18nSettings(state)?.locale;

export const getTimezone = (state: RootState) =>
  getPortalI18nSettings(state)?.timezone;

export const getOtpConfig = (state: RootState) =>
  getPortalConfigState(state)?.portalConfig?.otpPolicy;
