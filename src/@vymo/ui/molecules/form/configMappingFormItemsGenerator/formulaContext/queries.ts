import _ from 'lodash';
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import Logger from 'src/logger';
import { FormulaValidation, Validation } from '../../formItem/types';
import { nameSpaces as C } from './contextClass/constants';

const log = new Logger('Form ConfigMapping Queries');

export const camelizeObjectKeys = (obj) =>
  Object.keys(obj).reduce(
    (acc, key) => {
      const camelKey = Array.isArray(obj) ? key : _.camelCase(key);
      acc[camelKey] =
        typeof obj[key] === 'object' && obj[key] !== null
          ? camelizeObjectKeys(obj[key])
          : obj[key];
      return acc;
    },
    Array.isArray(obj) ? [] : {},
  );

export const evaluateField = (computedFunction, evaluate) => {
  const convertString = camelizeObjectKeys(computedFunction);
  try {
    evaluate.evaluate(JSON.stringify(convertString));
    return evaluate.getContext('result')?.get('output');
  } catch (error: any) {
    log.error(error.message, 'Evaluation Errors');
    return '';
  }
};

export const evaluateValidation = (computedFunction, evaluate) => {
  const validation = evaluateField(computedFunction.expression, evaluate);
  const consolidatedContext = {
    [C.NS_FORM]: evaluate.getContext(C.NS_FORM)?.context,
    [C.NS_SESSION]: evaluate.getContext(C.NS_SESSION)?.context,
    [C.NS_VO]: evaluate.getContext(C.NS_VO)?.context,
    // This is added for fallback code for hdfcbwc where it is not sending whole path.
    validation_fields: _.get(
      evaluate.getContext(C.NS_SESSION)?.context,
      'validation_fields',
      {},
    ),
  };

  // need to add referralContext here. where, referralData is ideally evaluate.getContext(C.NS_REFERRAL).context
  // if (!_.isEmpty(referralData)) {
  //   _.each(referralData, (vo) => {
  //     consolidatedContext[vo.fieldCode] = vo.value;
  //   });
  // }
  if (validation !== null && validation) {
    let errorMsg = computedFunction.error_message;
    const regex = /<(.+?)>/g;
    const matches: string[] = [];
    let match = regex.exec(errorMsg);
    while (match !== null) {
      matches.push(match[1]);
      match = regex.exec(errorMsg);
    }
    matches.forEach((matchKey) => {
      const matchedValue = _.get(consolidatedContext, matchKey, '');
      errorMsg = errorMsg.replace(new RegExp(`<${matchKey}>`), matchedValue);
    });
    return errorMsg;
  }
  return '';
};

export const getFormulaDependentInputCodes = (
  func = {},
  formulaDependentInputs: Array<string> = [],
) => {
  Object.entries(func).forEach(([key, value]: [string, any]) => {
    if (key === 'inputs') {
      func[key].forEach((input) => {
        //  get all if attribute present
        if (input?.value?.val_type) {
          formulaDependentInputs.push(input?.value?.attribute as string);
          formulaDependentInputs.push(input?.value?.vo_id as string);
        }
      });
    }
    if (_.isObject(value)) {
      getFormulaDependentInputCodes(value, formulaDependentInputs);
    }
  });
  return formulaDependentInputs.filter((inp) => inp);
};

export const getFormulaDependentInputCodesForValidations = (
  validations: Validation[] | FormulaValidation[] = [],
): string[] =>
  _.uniq(
    validations
      // @ts-ignore
      .filter((validation) => (validation as FormulaValidation).expression)
      .reduce(
        (acc, validation) => [
          ...acc,
          ...getFormulaDependentInputCodes(
            (validation as FormulaValidation).expression,
          ),
        ],
        [] as string[],
      ),
  );

export const oifVerificationRequired = (
  fieldRequired,
  touched,
  fieldVerified,
  additionalData,
  value,
): boolean => {
  if ((!fieldRequired && !value) || additionalData?.oifValid) return false;
  if (typeof fieldVerified === 'boolean' && !fieldVerified && !touched)
    return true;
  if (_.has(additionalData, 'oifValid') && !additionalData.oifValid)
    return true;
  return false;
};

export const validateLabelClick = (required, type, additionalData): boolean => {
  if (required && type === 'label' && !additionalData?.meta?.clicked) {
    return true;
  }
  return false;
};

export const phoneValidation = (
  countryCallingCode: string,
  value: string,
): string | undefined => {
  try {
    const countries = getCountries().filter(
      (country) => `+${getCountryCallingCode(country)}` === countryCallingCode,
    );

    const phoneNumber = parsePhoneNumberFromString(
      value,
      countries[0] as CountryCode,
    );
    if (!phoneNumber) return 'Invalid phone number format';
    if (!phoneNumber.isValid()) return 'Invalid phone number';
    return undefined;
  } catch (error: any) {
    return error.message;
  }
};
