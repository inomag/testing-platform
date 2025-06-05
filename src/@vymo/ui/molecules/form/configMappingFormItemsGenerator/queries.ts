import _ from 'lodash';
import { REGEX_DECIMAL } from 'src/@vymo/ui/molecules/currencyAndDecimal/constant';
import { DEFAULT_I18N_CONFIG } from '../constants';
import { Validation } from '../formItem/types';
import { REGEX_AADHAR, REGEX_EMAIL, REGEX_PAN } from './constant';
import { Options } from './types';

export const isDropdownType = (type) => {
  if (type) {
    return [
      'sifg',
      'dropdown',
      'code_name_spinner',
      'saved-list-sifg',
      'static-sifg',
    ].includes(type);
  }
  return false;
};

// hack will be applied in generic way at top
export const toCamelCaseKeys = (data) => {
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      data[index] = toCamelCaseKeys(item);
    });
  } else if (_.isObject(data)) {
    Object.keys(data).forEach((key) => {
      const camelKey = _.camelCase(key);
      const value = data[key];
      if (camelKey !== key) {
        delete data[key];
        data[camelKey] = value;
      } else {
        data[key] = value;
      }
    });
  }
  return data;
};

export const getMetaValue = (oldKeys, config) => {
  if (!config) return null;

  const keyValue = oldKeys.reduce((acc, oldKey) => {
    const val = _.get(config, oldKey, null);
    delete config[oldKey];

    if (_.isObject(val)) {
      return val;
    }
    return acc || val;
  }, null);

  return keyValue;
};

export const isOptionValid = (option): boolean =>
  !(
    ['none', '', 'select'].includes(_.toLower(option.code)?.trim()) ||
    ['select'].includes(_.toLower(option.name)?.trim())
  );

// TODO Pratik fix the types
export const getFieldOptions = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  options: Options = [],
  type,
): Options | {} => {
  if (type === 'sifg') {
    return options
      ? {
          ...options,
          // @ts-ignore
          selection: {
            // @ts-ignore
            ...options.selection,
            code_name_spinner_options: getFieldOptions(
              // @ts-ignore
              options.selection?.code_name_spinner_options,
              'codeNameSpinner',
            ),
          },
        }
      : {};
  }

  let optionList: Options = options || [];
  if (type === 'spinner') {
    optionList = optionList.map(
      (value: { code: string; name: string } | string) => ({
        name: value,
        code: value,
      }),
    ) as Options;
  }

  return Array.isArray(optionList)
    ? optionList?.filter(isOptionValid)
    : optionList;
};

export const getDurationValue = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  options: Array<{ code: string; name: string }> = [],
  type,
) => {
  if (type === 'meeting') {
    return options
      .filter(({ code }) => !Number.isNaN(parseInt(code, 10)))
      .map(({ code }) => parseInt(code, 10));
  }
  return undefined;
};

export const getMinMaxValidations = (hint, minLength, maxLength) => {
  const minMaxValidations: Validation[] = [];
  if (minLength) {
    minMaxValidations.push({
      regex: new RegExp(`^.{${minLength},}$`),
      errorMessage: `${hint} must be at least ${minLength} digits long`,
    });
  }
  if (maxLength) {
    minMaxValidations.push({
      regex: new RegExp(`^.{0,${maxLength}}$`),
      errorMessage: `${hint} must be at most ${maxLength} digits long`,
    });
  }
  return minMaxValidations;
};

export const getPhoneValidation = (
  additionalConfigData,
  hint,
  minLength,
  maxLength,
) => {
  if (!_.isEmpty(additionalConfigData)) {
    return [];
  }
  return getMinMaxValidations(hint, minLength, maxLength);
};

export const getLabelByType = (type, label, value) => {
  if (type === 'label' && value) {
    return null;
  }
  return label;
};

export const getValidationByTypeAndFieldRegex = (
  type,
  hint,
  regex,
  regexHint,
  minLength,
  maxLength,
  additionalConfigData: {},
) => {
  const validation: Validation[] = [];
  switch (type) {
    case 'email':
      validation.push({
        regex: REGEX_EMAIL,
        errorMessage: `${hint} is not valid`,
      });
      break;
    case 'decimal':
      validation.push({
        regex: REGEX_DECIMAL,
        errorMessage: `${hint} is not a valid decimal number`,
      });
      break;
    case 'pan':
      validation.push({
        regex: REGEX_PAN,
        errorMessage: `${hint} is not valid`,
      });
      break;
    case 'aadhar':
      validation.push({
        regex: REGEX_AADHAR,
        errorMessage: `${hint} is not valid`,
      });
      break;

    case 'phone':
      validation.push(
        ...getPhoneValidation(additionalConfigData, hint, minLength, maxLength),
      );
      break;

    default:
      break;
  }
  if (type !== 'phone') {
    validation.push(...getMinMaxValidations(hint, minLength, maxLength));
  }

  if (regex && regexHint && _.isEmpty(additionalConfigData)) {
    validation.push({
      regex: new RegExp(regex),
      errorMessage: regexHint,
    });
  }
  return validation;
};

export const getAdditionalDataByType = (
  value,
  field,
  path,
  clientConfig?,
  existingAdditionalData?,
) => {
  if (!(path in field) || _.isEmpty(_.get(field, path))) {
    return existingAdditionalData;
  }

  const handlers = {
    sifg: () => {
      const selectionOptions =
        field?.options?.selection?.code_name_spinner_options || [];
      const evaluatedCode = selectionOptions.find(
        (option) => option?.name === value || option?.code === value,
      )?.code;
      return { data: { code: evaluatedCode } };
    },

    referral: () => {
      const parsedValue = typeof value === 'string' ? JSON.parse(value) : {};
      return { data: { code: parsedValue?.code } };
    },

    aif: () => ({ meta: { elements: value } }),

    meeting: () => {
      const i18nConfig =
        clientConfig?.i18n_config ||
        clientConfig?.i18nSettings ||
        DEFAULT_I18N_CONFIG;
      return { meta: { currency_iso: i18nConfig.currency_iso } };
    },
  };

  return handlers[field.type] ? handlers[field.type]() : null;
};
