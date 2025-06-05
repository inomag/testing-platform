import _ from 'lodash';
import type { Option } from 'src/@vymo/ui/atoms/select/types';
import { SifgProps } from './types';

export const getSifgValueForSelect = (
  value,
  options: Array<Option>,
  outputType: SifgProps['outputType'] = {},
) => {
  if (outputType.returnCode) {
    return value;
  }

  if (outputType.json) {
    try {
      const objectValue = JSON.parse(value);
      if (_.isObject(objectValue)) {
        if (Array.isArray(objectValue)) {
          return objectValue.map(({ code: objCode }) => objCode);
        }
        //  @ts-ignore
        return objectValue.code;
      }
    } catch (error) {
      /* empty */
    }
  }

  return options.find(({ name }) => name === value)?.code;
};

// this function can become generic and can be part of form layer
// outputType can be make generic
export const getValueBasedOnOutputType = (
  options,
  isMulti,
  outputType: SifgProps['outputType'] = {},
) => {
  if (!isMulti) {
    const { code, name } = options[0];
    let updatedValue = name;
    if (outputType.json) {
      updatedValue = JSON.stringify({ code, name });
    } else if (outputType.returnCode) {
      updatedValue = code;
    }
    return updatedValue;
  }

  let updatedValue = options.map(({ code, name }) => ({ code, name }));
  if (outputType.json) {
    updatedValue = JSON.stringify(updatedValue);
  } else if (outputType.returnCode) {
    updatedValue = updatedValue.map(({ code }) => code);
  } else {
    updatedValue = updatedValue.map(({ name }) => name);
  }
  return updatedValue;
};
