import _ from 'lodash';
import { getManageUsersActionPermissions } from 'src/models/lmsConfig/queries';
import { isJsonString } from 'src/workspace/utils';

export const getUserManagementApprovalsEssentials = (action, config) => {
  const userConfig = _.get(config, 'user');
  const userManagementConfig = _.get(config, 'user_management_config');

  const userRole = _.get(userConfig, 'attributes.role', '');
  let approvalScopes = [];
  let isUserInApprovalScope: boolean = false;

  let isApprovalEnabled = false;
  let userApprovalMappings = [];
  let createUserApprovalConfig: any = {};

  if (!_.isEmpty(userManagementConfig)) {
    userApprovalMappings = _.get(
      userManagementConfig,
      'approval_config.approval_config_mappings',
      [],
    );
    createUserApprovalConfig = _.find(userApprovalMappings, { action }) || {};

    approvalScopes = _.get(createUserApprovalConfig, 'scopes', []);
    isUserInApprovalScope = _.includes(approvalScopes, userRole);

    isApprovalEnabled =
      _.get(userManagementConfig, 'approval_config.enabled', false) &&
      isUserInApprovalScope;
  }
  const isCheckForApprovalEnabled =
    _.get(createUserApprovalConfig, 'conditional_approval', false) &&
    isApprovalEnabled;

  return [isApprovalEnabled, isCheckForApprovalEnabled];
};

export const getFilteredDataForUser = (result, values, user) => {
  const filteredResult: any = {
    data: [],
  };

  _.each(result.data, (value) => {
    const valueInInputsMap = _.get(user, `inputs_map.${value.code}`);
    if (
      valueInInputsMap === values[value.code] ||
      user[value.code] === values[value.code]
    ) {
      return;
    }
    if (isJsonString(valueInInputsMap) && isJsonString(values[value.code])) {
      if (
        _.isEqual(JSON.parse(valueInInputsMap), JSON.parse(values[value.code]))
      ) {
        return;
      }
    } else if (
      isJsonString(user[value.code]) &&
      isJsonString(values[value.code])
    ) {
      if (
        _.isEqual(JSON.parse(user[value.code]), JSON.parse(values[value.code]))
      ) {
        return;
      }
    }

    const inputField = {
      code: value.code,
      name: value.name,
      type: value.type,
      value: values[value.code],
    };

    // if (inputField.type === 'multimedia' && !_.isEmpty(value)) {
    //   _.assignIn(inputField, {
    //     media_type: value.media_type,
    //   });
    // }

    // if (inputField.type === 'referral' && !_.isEmpty(value)) {
    //   _.assignIn(inputField, {
    //     data: value?.data,
    //   });
    // }

    if (inputField.code === 'reset_password') {
      // isInputPayload: custom code for now, will replace with a generic type based on which this behavior will be triggered
      filteredResult[inputField.code] = inputField.value;
    }

    filteredResult.data.push(inputField);
  });

  return filteredResult;
};

export const getExternalAuthEnabled = (config) =>
  _.get(config, 'sso_config.external_authentication_enabled', false);

export const getOtpConfig = (config) => _.get(config, 'otp_config', {});

export const disableResetPassword = (config) =>
  getManageUsersActionPermissions(config, 'disable_password_reset', false);
