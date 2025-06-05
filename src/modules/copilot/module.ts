import { COPILOT } from 'src/modules/constants';
import { ModulesList } from 'src/modules/types';
import Copilot from './index';

const module: ModulesList = {
  [COPILOT]: {
    component: Copilot,
  },
};

export default module;
