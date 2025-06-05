import {
  UI_BUILDER,
  UI_BUILDER_HOME,
  UI_RUNNER,
  UI_SELFSERVE_HOME,
  UI_SELFSERVE_RUNNER,
} from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import BuilderModule from './builder';
import BuilderThunk from './builder/thunk';
import UIBuilderModule from './index';
import RunnerModule from './runner';
import RunnerThunk from './runner/thunk';
import SeflServeRunnerModule from './selfserveRunner';
import SeflServeHomeModule from './selfserveRunner/home';

const module: ModulesList = {
  [UI_BUILDER_HOME]: {
    path: '/home',
    component: UIBuilderModule,
  } as Module,

  [UI_BUILDER]: {
    path: '/builder/:appProjectName',
    component: BuilderModule,
    thunk: BuilderThunk,
  } as Module,

  [UI_RUNNER]: {
    path: '/runner/:appProjectName',
    component: RunnerModule,
    thunk: RunnerThunk,
  } as Module,

  [UI_SELFSERVE_HOME]: {
    path: '/runner/selfserve/',
    component: SeflServeHomeModule,
  } as Module,

  [UI_SELFSERVE_RUNNER]: {
    path: '/runner/selfserve/:appProjectName',
    component: SeflServeRunnerModule,
  } as Module,
};

export default module;
