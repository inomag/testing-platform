import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import { setUserInfo } from 'src/models/appConfig/slice';
import { initLmsConfig } from 'src/models/auth/lmsLogin/thunk';
import { setIsAuthenticated } from 'src/models/auth/slice';
import { store } from 'src/store';
import { setAxiosInstanceAuthToken } from 'src/workspace/axios';
import { getClientConfigData, getModuleProps } from 'src/workspace/utils';

const beforeAppInit = async () => {
  // This logic is just to set authentication state in platform
  const isLoggedIn = getModuleProps()?.isLoggedIn?.();
  const isPortalLoggedIn = getModuleProps()?.isPortalLoggedIn?.();

  if (
    getModuleProps()?.scenario === 'login' &&
    !getGrowthBookFeatureFlag('enable-webInit-forAllHost') &&
    ![
      'abcapital-preprod.lms.getvymo.com',
      'abcapital.lms.getvymo.com',
      'abc-staging.lms.getvymo.com',
      'abcapital-staging.lms.getvymo.com',
      'test-prod-aci-preprod-abc.lms.getvymo.com',
    ].includes(window.location.hostname)
  ) {
    getModuleProps()?.setLegacyLogin?.();
  }

  if (isLoggedIn || isPortalLoggedIn) {
    store.dispatch(initLmsConfig());
    store.dispatch(setIsAuthenticated(true));

    const configData = getClientConfigData();
    store.dispatch(
      setUserInfo({ clientCode: configData?.client, email: configData?.email }),
    );
  } else {
    setAxiosInstanceAuthToken('');
    store.dispatch(setIsAuthenticated(false));
  }
};

const afterAppInit = async () => {};

export { beforeAppInit, afterAppInit };
