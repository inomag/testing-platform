import { initialiseTheme } from 'src/designTokens/themes';
import { applyV1TokensToRoot } from 'src/designTokens/themes/utils';
import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import { initialiseFeatureFlagsFromGrowthBook } from 'src/featureFlags/utils';
import { i18nInitPromise } from 'src/i18n/i18next';
import { getLoggedInUserInfo } from 'src/models/appConfig/selectors';
import { initLmsConfig } from 'src/models/auth/lmsLogin/thunk';
import { getState, store } from 'src/store';
import { isLmsWeb, isSelfServe, setCookie } from './utils';

const beforeWorkspaceInit = async (beforeAppInitFunction) => {
  initialiseTheme();
  if (window.hostApp || window.parent?.hostApp) {
    const platform =
      window.parent?.hostApp?.platform ||
      window?.hostApp?.platform ||
      'webPlatform';
    if (!['web', 'android', 'ios'].includes(platform)) {
      window.isWebPlatform = true;
    } else {
      if (window?.parent?.hostApp) {
        window.hostApp = window.parent.hostApp;
      }
      window.isWebPlatform = false;
      window.moduleProps = window?.hostApp?.moduleProps;
      // setting here visitor token for ios and android
      // either this should be part of stepper as visitorToken is valid for stepper journey
      if (window.hostApp?.visitorToken) {
        const visitorToken = window.hostApp?.visitorToken;
        setCookie('visitor_token', visitorToken as string);
      }
      if (isLmsWeb() || isSelfServe()) {
        store.dispatch(initLmsConfig());
      }
    }
  } else {
    window.isWebPlatform = true;
  }

  await i18nInitPromise();

  await beforeAppInitFunction();

  const userInfo = getLoggedInUserInfo(getState());

  const attributes = {
    clientCode: userInfo.clientCode,
    userEmail: userInfo.email,
  };

  await initialiseFeatureFlagsFromGrowthBook(attributes);
  const enableV1Tokens = getGrowthBookFeatureFlag('enable-v1-tokens');
  if (enableV1Tokens) {
    applyV1TokensToRoot();
  }
};

const afterWorkspaceInit = async (afterAppInitFunction) => {
  await afterAppInitFunction();
};

export { beforeWorkspaceInit, afterWorkspaceInit };
