import { SUPER_SET } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import SuperSet from './index';

const module: ModulesList = {
  [SUPER_SET]: {
    path: '/supersetDetails',
    component: SuperSet,
  } as Module,
};

export default module;
