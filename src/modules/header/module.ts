import { HEADER } from 'src/modules/constants';
import { ModulesList } from 'src/modules/types';
import HeaderModule from './index';

const module: ModulesList = {
  [HEADER]: {
    component: HeaderModule,
  },
};

export default module;
