import appConfigSlice from 'src/models/appConfig/slice';
import authSlice from 'src/models/auth/slice';
import AuthModule from 'src/modules/auth/module';
import HeaderModule from 'src/modules/header/module';
import SampleDialog from 'src/modules/sampleDialogModal/module';
import ProgressiveStepper from 'src/modules/stepper/module';
import progressiveStepperSlice from 'src/modules/stepper/slice';

export const moduleList = {
  ...ProgressiveStepper,
  ...HeaderModule,
  ...SampleDialog,
  ...AuthModule,
};

export const reducerList = {
  ...progressiveStepperSlice,
  ...authSlice,
  ...appConfigSlice,
};
