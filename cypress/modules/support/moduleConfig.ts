import { moduleList as copilotModuleList } from 'src/apps/copilot/modulesReducerConfig';
import { moduleList as dashboardModuleList } from 'src/apps/frontendBoard/modulesReducerConfig';
import { moduleList as onboardingModuleList } from 'src/apps/onboarding/modulesReducerConfig';
import { moduleList as recruitmentModuleList } from 'src/apps/recruitment/modulesReducerConfig';
import { moduleList as selfserveModuleList } from 'src/apps/selfserve/modulesReducerConfig';
import { moduleList as uiBuilderModuleList } from 'src/apps/uiBuilder/modulesReducerConfig';
import { moduleList as vymoWebModuleList } from 'src/apps/vymoWeb/modulesReducerConfig';

export const moduleList = {
  ...recruitmentModuleList,
  ...copilotModuleList,
  ...onboardingModuleList,
  ...dashboardModuleList,
  ...uiBuilderModuleList,
  ...selfserveModuleList,
  ...vymoWebModuleList,
};
