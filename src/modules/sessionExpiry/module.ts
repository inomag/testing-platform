import { SESSION_EXPIRY } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import RecruitmentExpiryComponent from './index.recruitment';

const module: ModulesList = {
  [SESSION_EXPIRY]: {
    path: '/',
    component: RecruitmentExpiryComponent,
  } as Module,
};

export default module;
