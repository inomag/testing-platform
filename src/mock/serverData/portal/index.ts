import { actionSubmit, actionValidate } from './action';
import { verifyOtp } from './authenticate';
import { esign, init } from './init';
import { sendOtp } from './otp';
import portalV3 from './v3';

export default [
  sendOtp,
  verifyOtp,
  init,
  esign,
  actionValidate,
  actionSubmit,
  ...portalV3,
];
