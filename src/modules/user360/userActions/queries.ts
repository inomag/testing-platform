/* eslint-disable complexity */
import _ from 'lodash';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  getIsIsacButtonEnabled,
  getManageUsersActionPermissions,
} from 'src/models/lmsConfig/queries';

const disableChangeManagerManageUsers = (config) =>
  getManageUsersActionPermissions(config, 'disable_change_manager', false);

const disableVisiblityManageUsers = (config) =>
  getManageUsersActionPermissions(config, 'disable_visibility', false);

const disableLockManageUsers = (config) =>
  getManageUsersActionPermissions(config, 'disable_lock', false);

const disableEditManageUsers = (config) =>
  getManageUsersActionPermissions(config, 'disable_edit', false);

export const canEnableDisableUser = (config) => {
  const { leads_authorizations: leadsAuthorizations } = config;
  const enableDisablePermission =
    !_.isEmpty(leadsAuthorizations) && leadsAuthorizations.enable_disable_user;
  if (typeof enableDisablePermission === 'undefined') {
    return true;
  }
  return enableDisablePermission;
};

export const isUserApprovalStatusPending = (user) =>
  !_.isEmpty(user.approval_status) && user.approval_status.pending_action;

export const getUserOptionConfigs = (config) => {
  const { user_option_configs: userOptionConfigs } = config;
  return userOptionConfigs;
};

export const getCustomButtonVisibility = (config) => {
  const { custom_user_buttons_visibility: customButtonVisibility } = config;
  return customButtonVisibility;
};

export const customButtonEnabledBasedOnStatus = (
  button,
  buttonInfo,
  user,
  customButtonVisibility,
) => {
  const isConditionsValid = customButtonVisibility?.[buttonInfo.action]?.length
    ? !_.includes(
        customButtonVisibility[buttonInfo.action],
        _.get(user, customButtonVisibility.user_field, ''),
      )
    : false;

  return isConditionsValid || isUserApprovalStatusPending(user);
};

export const isCustomButtonEnabled = (validationObj, user) =>
  _.some(validationObj, (value, key) => value.includes(_.get(user, key, '')));

export const getUserActionButtonsConfig = (config, user: any = {}) => {
  const actionButtonsConfig = {
    changeManagerButton: {
      name: locale(Keys.CHANGE_MANAGER),
      key: 'changeManager',
      disabled:
        disableChangeManagerManageUsers(config) ||
        user.disabled ||
        !canEnableDisableUser(config) ||
        user.code !== user.region ||
        isUserApprovalStatusPending(user),
    },
    disableUserButton: {
      name: locale(Keys.DISABLE_USER),
      key: 'disableUser',
      disabled:
        disableVisiblityManageUsers(config) ||
        user.disabled ||
        !canEnableDisableUser(config) ||
        isUserApprovalStatusPending(user),
    },
    enableUnLockButton: {
      name: locale(Keys.UNLOCK_USER),
      key: 'unlockUser',
      disabled:
        disableLockManageUsers(config) ||
        user.disabled ||
        !_.get(user, 'locked', false) ||
        !canEnableDisableUser(config) ||
        isUserApprovalStatusPending(user),
    },
    enableUserButton: {
      name: locale(Keys.ENABLE_USER),
      key: 'enableUser',
      disabled:
        disableVisiblityManageUsers(config) ||
        !user.disabled ||
        !canEnableDisableUser(config) ||
        isUserApprovalStatusPending(user),
    },
  };

  return actionButtonsConfig;
};

export const getUserEditButtonConfig = (config, user: any = {}) => ({
  name: locale(Keys.EDIT),
  icon: 'add',
  disabled:
    ['SU', 'SELFSERVE_ADMIN'].includes(user?.code) ||
    disableEditManageUsers(config) ||
    user.disabled ||
    isUserApprovalStatusPending(user) ||
    getIsIsacButtonEnabled(),
});
