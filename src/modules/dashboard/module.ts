import { DASHBOARD } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import Dashboard from './index';
import DashboardThunk from './thunk';

const module: ModulesList = {
  [DASHBOARD]: {
    path: '/dashboard/:playgroundType',
    component: Dashboard,
    thunk: DashboardThunk,
  } as Module,
};

export default module;
