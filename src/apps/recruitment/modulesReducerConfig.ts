import otpAuthSlice from 'src/models/authLegacy/otp/slice';
import portalConfigSlice from 'src/models/portalConfig/slice';
import recruitmentMetaSlice from 'src/models/recruitmentMeta/slice';
import stepperFormSlice from 'src/models/stepperFormLegacy/slice';
import AuthModule from 'src/modules/authLegacy/module';
import authSlice from 'src/modules/authLegacy/slice';
import HeaderModule from 'src/modules/header/module';
import Recruitment from 'src/modules/recruitment/module';
import registerSlice from 'src/modules/recruitment/slice';
import SampleDialog from 'src/modules/sampleDialogModal/module';
import sessionExpiryModule from 'src/modules/sessionExpiry/module';
import stepperFormModule from 'src/modules/stepperFormLegacy/module';

export const moduleList = {
  ...HeaderModule,
  ...AuthModule,
  ...Recruitment,
  ...stepperFormModule,
  ...SampleDialog,
  ...sessionExpiryModule,
};

export const reducerList = {
  ...authSlice,
  ...otpAuthSlice,
  ...registerSlice,
  ...stepperFormSlice,
  ...recruitmentMetaSlice,
  ...portalConfigSlice,
};
