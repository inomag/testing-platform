import { setUserInfo } from 'src/models/appConfig/slice';
import {
  setAuthHeaderUi,
  setAuthScenarioType,
  setIsAuthenticated,
  setMetaData,
} from 'src/models/auth/slice';
import { store } from 'src/store';
import axios from 'src/workspace/axios';

const beforeAppInit = async () => {
  try {
    const userInfoResponse = await axios.get('/frontend/api/user');
    if (userInfoResponse.status === 200) {
      const userInfo = userInfoResponse.data;
      store.dispatch(setIsAuthenticated(true));
      store.dispatch(setUserInfo(userInfo.user));
    }
  } catch (error: any) {
    const userInfoResponse = error.response;
    if (userInfoResponse.status === 401) {
      store.dispatch(setIsAuthenticated(false));
      store.dispatch(
        setAuthScenarioType({
          scenario: 'loginType',
          type: 'EXTERNAL',
        }),
      );
      store.dispatch(setMetaData({ providers: ['google'] }));
      store.dispatch(
        setAuthHeaderUi({
          title: 'Welcome to Vymo Frontend Board',
          description: 'Please login to continue',
          image: '/frontendBanner.webp',
        }),
      );
    }
  }
};

const afterAppInit = async () => {};

export { beforeAppInit, afterAppInit };
