import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { USER_PROFILE } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import UserProfile from './index';
import UserProfileThunk from './thunk';

const module: ModulesList = {
  [USER_PROFILE]: {
    path: '/userProfile',
    component: UserProfile,
    thunk: UserProfileThunk,
    hostApp: {
      hideSideHamBurgerMenu: true,
    },
    breadCrumbs: [
      {
        path: '#/home/dashboard',
        legacy: true,
        breadcrumbName: locale(Keys.HOME),
      },
      {
        breadcrumbName: locale(Keys.USER_PROFILE),
      },
    ],
  } as Module,
};
export default module;
