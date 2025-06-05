import { RECRUITMENT } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import Recruitment from './index';

const module: ModulesList = {
  [RECRUITMENT]: {
    path: '/',
    component: Recruitment,
  } as Module,
};

export default module;
