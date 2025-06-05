import { isNativeMobileApp, isWebPlatform } from 'src/workspace/utils';

export const getPortalMedium = () => {
  if (isWebPlatform()) {
    return 'portal';
  }
  if (isNativeMobileApp()) {
    return 'app';
  }
  return 'web';
};
