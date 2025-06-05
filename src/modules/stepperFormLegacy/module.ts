import { STEPPER_FORM } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import StepperFormComponent from './index';

const module: ModulesList = {
  [STEPPER_FORM]: {
    path: '/stepper-form',
    component: StepperFormComponent,
  } as Module,
};

export default module;
