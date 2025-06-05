import { SAMPLE_DIALOG } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import SampleDialog from './index';

const module: ModulesList = {
  [SAMPLE_DIALOG]: {
    path: 'sampleDialog/:header',
    component: SampleDialog,
    syncParamsToProps: true,
  } as Module,
};

export default module;
