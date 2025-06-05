import { SAMPLE_FORM, SAMPLE_FORM_PACKAGE } from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import SampleFormModule from './index';
import SampleFormThunk from './thunk';
import SampleFormPackageModule from './vymoUILibTest';

const module: ModulesList = {
  [SAMPLE_FORM]: {
    path: '/',
    component: SampleFormModule,
    thunk: SampleFormThunk,
  } as Module,

  [SAMPLE_FORM_PACKAGE]: {
    path: '/sampleFormPackage/:lastPage',
    component: SampleFormPackageModule,
    thunk: SampleFormThunk,
  } as Module,
};

export default module;
