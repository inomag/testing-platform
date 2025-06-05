import _ from 'lodash';
import { getClientConfigData } from 'src/workspace/utils';

export const getCurrentModule = (moduleCode: string) => {
  const config = getClientConfigData();
  if (moduleCode === 'user') {
    return {
      ...(config.user_config || {}),
    };
  }
  const currentModule =
    _.find(config.lead_modules, (module: any) => module.code === moduleCode) ||
    {};
  return currentModule;
};

export const getCurrentModuleFromStartState = (startState: string) => {
  const config = getClientConfigData();
  const currentModule = _.find(
    config.lead_modules,
    (module: any) => module.start_state === startState,
  );
  return currentModule;
};

export const getCurrentUser = () => {
  const config = getClientConfigData();
  const { user = {} } = config;
  return user;
};

export const getIsIsacButtonEnabled = () => {
  const config = getClientConfigData();
  const { isacButtonEnabled } = config;
  return isacButtonEnabled;
};

export const getUserOptionsConfig = () => {
  const config = getClientConfigData();
  const { user_option_configs: userOptionConfigs } = config;
  return userOptionConfigs || {};
};

export const isUserManagementApprovalEnabled = () => {
  const config = getClientConfigData();
  const userManagementConfig = _.get(config, 'user_management_config', {});
  return _.get(userManagementConfig, 'approval_config.enabled', false);
};

export const getFeaturesConfig = () => {
  const config = getClientConfigData();
  const { features_config: featuresConfig } = config;
  return featuresConfig || [];
};

export const getModuleRolePermissions = (moduleCode: string) => {
  const config = getClientConfigData();
  return _.get(
    config,
    `leads_authorizations.module_role_permissions${moduleCode}`,
    {},
  );
};

export const getLeadsAuthorizations = () => {
  const config = getClientConfigData();
  return _.get(config, 'leads_authorizations', {});
};

export const getManageUsersActionPermissions = (
  config,
  action,
  defaultValue,
) => {
  const { users_role_permission: usersRolePermission } = config;
  const manageUserActionPermissions = _.get(
    usersRolePermission,
    'manage_user_action_permissions',
    {},
  );
  return _.get(manageUserActionPermissions, action, defaultValue);
};
