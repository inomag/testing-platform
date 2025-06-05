import { GrowthBook } from '@growthbook/growthbook';

export const featureFlags = {
  'onboarding-enabled': true,
  'sample-enabled': false,
};

export type FeatureFlag = keyof typeof featureFlags;

let featureFlagsInit = {};

export const initialiseFeatureFlags = (featureFlagsData?) => {
  if (window.isCypressModule) {
    featureFlagsInit = featureFlagsData;
  } else {
    featureFlagsInit = JSON.parse(localStorage.getItem('flags') || '{}');
  }
};

export const getFeatureFlag = (flag: FeatureFlag) =>
  featureFlagsInit[flag] ?? false;

export type GrowthBookFeaturesFlag = {
  'portal-injectJs'?: boolean;
  'platform-multimedia-image-config'?: {
    rotate: boolean;
    zoom: boolean;
    aspect: boolean;
  };
  'podEnv-supported'?: {
    vymoWeb: Array<string>;
    selfserve: Array<string>;
    webPlatform: Array<string>;
  };
  'dashboard-admin'?: boolean;
  'enable-webInit-forAllHost'?: boolean;
  'enable-v1-tokens'?: boolean;
};

const attributes = {
  clientCode: '',
  userEmail: '',
};

export const growthbook = new GrowthBook({
  attributes,
  enableDevMode: process.env.NODE_ENV !== 'production',
});

export const getGrowthBookFeatureFlag = <
  K extends keyof GrowthBookFeaturesFlag,
>(
  featureFlag: K,
): GrowthBookFeaturesFlag[K] =>
  growthbook.getFeatureValue(featureFlag, false) as any;
