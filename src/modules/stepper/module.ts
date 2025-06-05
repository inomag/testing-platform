import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  PROGRESSIVE_STEPPER,
  PROGRESSIVE_STEPPER_ASSESSMENT,
  PROGRESSIVE_STEPPER_DIALOG,
  PROGRESSIVE_STEPPER_FORM,
} from 'src/modules/constants';
import { Module, ModulesList } from 'src/modules/types';
import Assessment from './assessment/index';
import ProgressiveStepperForm from './form/index';
import Stepper from './index';
import ProgressiveStepperThunk from './thunk';

const module: ModulesList = {
  [PROGRESSIVE_STEPPER]: {
    path: '/stepper/:lobCode/action/:actionCode',
    component: Stepper,
    thunk: ProgressiveStepperThunk,
    hostApp: {
      hideSideHamBurgerMenu: true,
    },
    breadCrumbs: [
      {
        path: `#/:module/leads`,
        legacy: true,
        breadcrumbName: locale(Keys.LEADS),
      },
      {
        path: `#/:module/leads/:leadId/details`,
        legacy: true,
        breadcrumbName: `leadName`,
      },
      {
        breadcrumbName: locale(Keys.UPDATE),
      },
    ],
  } as Module,

  [PROGRESSIVE_STEPPER_DIALOG]: {
    path: '/stepper/:lobCode/action/:actionCode/:isDialog',
    component: Stepper,
    thunk: ProgressiveStepperThunk,
    dialog: {
      styles: {
        m: {
          w: '90vw',
          h: 'auto',
        },
      },
      props: {
        showCloseButton: false,
      },
    },
  } as Module,

  [PROGRESSIVE_STEPPER_FORM]: {
    component: ProgressiveStepperForm,
  } as Module,

  [PROGRESSIVE_STEPPER_ASSESSMENT]: {
    component: Assessment,
  } as Module,
};

export default module;
