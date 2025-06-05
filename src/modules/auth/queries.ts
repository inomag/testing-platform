import { createMachine } from 'xstate';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';

// new user -> user id(phone/email) -> mode of user verification(otp)  -> setup mpin/password
// new user -> user id(email) -> link verification on the email  -> setup mpin/password
// exisiting user -> user id(user id will come from first step) -> mode of authencation(mpin/otp/password)
// social login (third party) => user id will come from Oauth2 and create entry in backend->

// type of login -> internal, external(oauth 2)
// internal --> user id -> -> phone/email || external -> cookies

// internal -> userId ->
// userId -> email/pan/phone
// userAuthentication ->otp/mpin/password
// verifyUserInput -> phone/email
// verifyUserAuth -> otp
// setupAuth -> mpin/password

export const getAuthMachine = (scenario, config = {}) =>
  createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgDYHsoBLAOwBUBPABzAGJT0wAnE5XAbQAYBdRUK-LCLoi+EnxAAPRAFoAjAA4AnNk4BmOUoBMANjmcFAdgVqtAFgA0ICokMrDAVjU6Xi5wdMBfT1bRY8hKSUNPQkjCxs7HK8SCACQiJiEtII8sqqGtp6BsamltaIago62EbFmjoKmpyGcmbevhg4BMTk1HRgkuGsHDwS8cKi4rEpMqYOqpycOoacco5yrlY2COPYZnoKCmZmWkpmTgoODSB+OKiwzACSELQAogByZHcASgD6AKoAyq9vVwAiXBi-EEgySI0QZhM2C0amcTh002UZjky0QlTU2Ac6ihjkMLkqOhOZ2wF2ut0ez3e31+AKiwLioMSw1AKQOclUR10NU4Zjs6h0aIQWimWPUDiU2zxDi2CmJTWwADdmEQAGYUD6XJi0ABCAEEAMIAaSB-SZQ2SiE0HL5EsWvMluyUQtMnBhTgcDjMc1qBg28v8yqYao1WtoADVXlcAGJXO6AvqxAbMy0Ia3rRxKe1mR17IU7DlTNQOFxaRwo3THHynBVkph6ppgMJEADGyGZusNJsTIISFohqUUKnUml0+jKeSFJY5jmLxicalqOiUAfOWobWCbIjbHejAHkXgBxPdkN56j5kAASpqT5vBrNkQ4yo+yE-M+cX2EXRx0u1Mzk0KtGn8S50FQKgN0wTtjRvXswRZKRIQcQsuURWY+SUAV8xRSZi10PZYWLFcThIfAIDgCQzjNPt70Q1IdgmKFsTUThkJ2FEHCFGRDGwQwNjhOE5DkBwyzmVcAlaYIwGo+DUzGLQFGwGYtE9RFFgI-IViKN0lD0TDkURHRYXEusbhklMB3xEolEcLZFyUSVtE0yFP0qEUlAlZdDC0ORxKDENNWYcz+wfBANmwBzhOcFj-z4wwPzdIyuTmHQNBMPiTPXRtmx3ELGRohDRjUGz1iOdRWLqAtOIKBAZjMJSFOxDZdNqL1xNA8DIOC2iUlMDktBUrNdNS-YfOcsKcOYkSjO0OEJW8bwgA */
    id: 'auth',
    type: 'compound',
    initial: scenario ?? 'loginType',
    context: config ?? {
      isUserExisiting: false,
      isUserIdAvailable: true,
    },
    states: {
      loginType: {
        on: {
          internal: [
            {
              guard: ({ context }) => !context.isUserIdAvailable,
              target: 'userId',
            },
            {
              guard: ({ context }) => context.isUserIdAvailable,
              target: 'userAuthentication',
            },
          ],
          external: [
            {
              // guard: ({ context }) => context.yearSelectionAllowed,
              target: '',
            },
          ],
        },
      },
      userId: {
        on: {
          ENTER_USER_ID: [
            {
              guard: ({ context }) => context.isUserExisiting,
              target: 'userAuthentication',
            },
            {
              guard: ({ context }) => !context.isUserExisiting,
              target: 'verifyUserInput',
            },
          ],
        },
      },
      verifyUserInput: {
        on: {
          BACK: 'userId',
          VERIFIED: 'verifyUserAuth',
        },
      },
      verifyUserAuth: {
        on: {
          BACK: 'userId',
          VERIFIED: 'setupAuth',
        },
      },
      userAuthentication: {
        on: {
          BACK: 'userId',
          FORGOT_AUTH: 'verifyUserInput',
        },
      },
      setupAuth: {
        on: {
          BACK: 'userId',
        },
      },
    },
  });

const validateSetupAuthPayload = (type, value, confirmValue, length) => {
  if (type === 'MPIN') {
    if (value.length !== length) {
      return {
        valid: false,
        errorMessage: locale(Keys.MPIN_DIGITS, { length }),
      };
    }
    if (confirmValue.length !== length) {
      return {
        valid: false,
        errorMessage: locale(Keys.CONFIM_MPIN_DIGITS, { length }),
      };
    }
    if (confirmValue.length === value.length && confirmValue !== value) {
      return {
        valid: false,
        errorMessage: locale(Keys.MPIN_MISMATCH_ERROR),
      };
    }
    return { valid: true, errorMessage: '' };
  }
  if (confirmValue.length === value.length && confirmValue !== value) {
    return {
      valid: false,
      errorMessage: locale(Keys.PASSWORD_MISMATCH_ERROR),
    };
  }
  return { valid: true, errorMessage: '' };
};

const validateUserAuthenticationPayload = (type, value, length) => {
  if (type === 'MPIN') {
    if (value.length !== length) {
      return {
        valid: false,
        errorMessage: locale(Keys.MPIN_DIGITS, { length }),
      };
    }
    return { valid: true, errorMessage: '' };
  }
  return { valid: true, errorMessage: '' };
};

const validateVerifyUserAuthnPayload = (value, length) => {
  if (value.length !== length) {
    return { valid: false, errorMessage: locale(Keys.OTP_DIGITS, { length }) };
  }
  return { valid: true, errorMessage: '' };
};

export const validatePayload = (
  scenario,
  type,
  length,
  value,
  confirmValue = '',
) => {
  switch (scenario) {
    case 'userId':
    case 'verifyInput':
    case 'verifyUserAuth':
      return validateVerifyUserAuthnPayload(value, length);
    case 'userAuthentication':
      return validateUserAuthenticationPayload(type, value, length);
    case 'setupAuth':
      return validateSetupAuthPayload(type, value, confirmValue, length);
    default:
      return { valid: true, errorMessage: '' };
  }
};

export const getValueBasedOnType = (value) =>
  Array.isArray(value) ? value.join('') : value;
