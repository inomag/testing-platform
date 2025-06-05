/* eslint-disable complexity */
import _ from 'lodash';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { parseJSON } from 'src/workspace/utils';
import { getTaskCreationInputs } from './tasks';
import { getFilteredDataForUser } from './users';

export const getVymoFormTitle = (action: string) => {
  switch (action) {
    case 'create_task':
      return locale(Keys.CREATE_TASK);
    case 'edit_task':
      return locale(Keys.EDIT_TASK);
    case 'add_user':
      return locale(Keys.ADD_USER);
    case 'edit_user':
      return locale(Keys.EDIT_USER);
    case 'disableUser':
      return locale(Keys.DISABLE_USER);
    case 'enableUser':
      return locale(Keys.ENABLE_USER);
    case 'unlockUser':
      return locale(Keys.UNLOCK_USER);
    case 'changeManager':
      return locale(Keys.CHANGE_MANAGER);
    case 'update_task':
      return locale(Keys.UPDATE_TASK);
    default:
      return locale(Keys.VYMO_FORM);
  }
};

export const getConvertedValues = (inputs) => {
  const values = {};
  const keys = Object.keys(inputs);
  keys.forEach((key) => {
    values[key] = {
      value: inputs[key],
      code: key,
    };
  });
  return values;
};

export const getSubmitButtonText = (
  action,
  isApprovalEnabled,
  isConditionalApprovalEnabled,
  checkForApprovalsAPICalled,
) => {
  let buttonText = '';
  switch (action) {
    case 'changeManager':
      buttonText = locale(Keys.REASSIGN);
      break;
    default:
      buttonText = locale(Keys.SUBMIT);
  }

  if (isApprovalEnabled) {
    if (isConditionalApprovalEnabled && !checkForApprovalsAPICalled) {
      buttonText = locale(Keys.CHECK_FOR_APPROVAL);
    } else {
      buttonText = locale(Keys.SEND_FOR_APPROVAL);
    }
  }
  return buttonText;
};

export const getChangeManagerInputs = (configInputs: any = [], voId = '') => {
  const activeBranchUsers = _.map(
    _.filter(
      configInputs,
      (user: any) =>
        user.region_type !== 'territory' &&
        !user.disabled &&
        user.code !== voId &&
        (user.code === user.region || user.code === 'SU'),
    ),
    (user) => ({
      code: user.code,
      name: `${user.name} (${user.code})`,
    }),
  );
  const fields = [
    {
      code: 'manager',
      hint: locale(Keys.MANAGERS),
      type: 'code_name_spinner',
      code_name_spinner_options: activeBranchUsers,
      filterType: 'contains',
      returnCode: true,
    },
    {
      code: 'note',
      hint: locale(Keys.MANAGER_DATA_VISIBILITY_DELAY_NOTE),
      type: 'label',
      value: '',
    },
  ];
  return fields;
};

export const getFormInputs = (
  module,
  inputs,
  values,
  moduleCode,
  action,
  vo,
) => {
  if (action === 'create_task') {
    return getTaskCreationInputs(values, inputs, module, vo, moduleCode);
  }
  return inputs;
};

export const filterEmptyValues = (filteredDataInputs: any) => {
  const filteredInputs: any = [];

  _.each(_.compact(filteredDataInputs), (eachField: any) => {
    const inputType = eachField.type;
    const parsedJSON = parseJSON(eachField.value);
    if (
      (inputType === 'date' || inputType === 'datetime') &&
      eachField.value !== null
    ) {
      filteredInputs.push(eachField);
    } else if (
      inputType === 'text' ||
      inputType === 'email' ||
      inputType === 'sentence'
    ) {
      filteredInputs.push(eachField);
    } else if (eachField.value && typeof eachField.value === 'number') {
      filteredInputs.push(eachField);
    } else if (
      inputType === 'multi_select_auto_complete' &&
      parsedJSON &&
      !_.isEmpty(parsedJSON[0])
    ) {
      filteredInputs.push(eachField);
    } else if (inputType === 'location' && !_.isEmpty(parsedJSON)) {
      filteredInputs.push(eachField);
    } else if (inputType === 'meeting') {
      if (_.get(eachField, 'value.date')) {
        filteredInputs.push(eachField);
      }
    } else if (inputType === 'photo') {
      filteredInputs.push(eachField);
    } else if (
      Array.isArray(parsedJSON)
        ? parsedJSON.length > 0
        : !_.isEmpty(eachField.value)
    ) {
      filteredInputs.push(eachField);
    } else if (
      typeof eachField.value === 'boolean' &&
      !_.isNil(eachField.value)
    ) {
      filteredInputs.push(eachField);
    } else if (
      inputType === 'multi_select_check_box' &&
      Array.isArray(parsedJSON)
    ) {
      filteredInputs.push(eachField);
    }
  });

  return filteredInputs;
};

export const getFilteredData = (action: string, result: any, vo: any) => {
  if (action === 'edit_user') {
    const valuesMap = result.data?.reduce((acc, input) => {
      acc[input.code] = input.value;
      return acc;
    }, {});

    const filteredResult = getFilteredDataForUser(result, valuesMap, vo);

    filteredResult.data = filterEmptyValues(filteredResult.data);

    return filteredResult;
  }
  return result;
};
