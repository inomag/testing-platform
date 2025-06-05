import lmsLoginAuthSlice from 'src/models/auth/lmsLogin/slice';
import authSlice from 'src/models/auth/slice';
import lmsConfigSlice from 'src/models/lmsConfig/slice';
import AuthModule from 'src/modules/auth/module';
import AuthLegacyModule from 'src/modules/authLegacy/module';
import authLegacySlice from 'src/modules/authLegacy/slice';
import HeaderModule from 'src/modules/header/module';
import SampleDialog from 'src/modules/sampleDialogModal/module';
import SampleFormModule from 'src/modules/sampleForm/module';
import ProgressiveStepper from 'src/modules/stepper/module';
import progressiveStepperSlice from 'src/modules/stepper/slice';
import SuperSetDashboardModule from 'src/modules/superset/module';
import User360Module from 'src/modules/user360/module';
import User360Slice from 'src/modules/user360/slice';
import UserProfileModule from 'src/modules/userProfile/module';
import UserProfileSlice from 'src/modules/userProfile/slice';
import WorkflowFormModule from 'src/modules/workflowForm/module';
import WorkflowFormSlice from 'src/modules/workflowForm/slice';

export const moduleList = {
  ...SampleFormModule,
  ...SampleDialog,
  ...ProgressiveStepper,
  ...AuthLegacyModule,
  ...SuperSetDashboardModule,
  ...HeaderModule,
  ...AuthModule,
  ...UserProfileModule,
  ...User360Module,
  ...WorkflowFormModule,
};

export const reducerList = {
  ...lmsLoginAuthSlice,
  ...progressiveStepperSlice,
  ...authLegacySlice,
  ...authSlice,
  ...UserProfileSlice,
  ...User360Slice,
  ...WorkflowFormSlice,
  ...lmsConfigSlice,
};
