import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { USER_360 } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import User360 from './index';
import User360Thunk from './thunk';

const module: ModulesList = {
  [USER_360]: {
    path: '/user/:userCode',
    component: User360,
    thunk: User360Thunk,
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
        path: '#/manage-users',
        legacy: true,
        breadcrumbName: locale(Keys.USERS_LIST),
      },
      {
        breadcrumbName: locale(Keys.USER),
      },
    ],
  } as Module,
};

export default module;
