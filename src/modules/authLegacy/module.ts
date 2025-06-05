import { LEGACY_AUTH } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import AuthModule from './index';

const module: ModulesList = {
  [LEGACY_AUTH]: {
    path: '/auth',
    component: AuthModule,
  } as Module,
};

export default module;
