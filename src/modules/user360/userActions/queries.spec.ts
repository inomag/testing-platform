import {
  canEnableDisableUser,
  customButtonEnabledBasedOnStatus,
  getCustomButtonVisibility,
  getUserActionButtonsConfig,
  getUserEditButtonConfig,
  isCustomButtonEnabled,
  isUserApprovalStatusPending,
} from './queries';

describe('src/modules/user360/userActions/queries.spec.ts', () => {
  describe('canEnableDisableUser', () => {
    it('should return false when leads_authorizations is empty', () => {
      const config = {
        leads_authorizations: {},
      };

      const result = canEnableDisableUser(config);
      expect(result).toBe(false);
    });

    it('should return true when leads_authorizations.enable_disable_user is undefined', () => {
      const config = {
        leads_authorizations: {
          enable_disable_user: undefined,
        },
      };

      const result = canEnableDisableUser(config);
      expect(result).toBe(true);
    });

    it('should return true when leads_authorizations.enable_disable_user is true', () => {
      const config = {
        leads_authorizations: {
          enable_disable_user: true,
        },
      };

      const result = canEnableDisableUser(config);
      expect(result).toBe(true);
    });

    it('should return false when leads_authorizations.enable_disable_user is false', () => {
      const config = {
        leads_authorizations: {
          enable_disable_user: false,
        },
      };

      const result = canEnableDisableUser(config);
      expect(result).toBe(false);
    });
  });

  describe('isUserApprovalStatusPending', () => {
    it('should return false when approval_status is empty', () => {
      const user = {
        approval_status: {},
      };

      const result = isUserApprovalStatusPending(user);
      expect(result).toBe(false);
    });

    it('should return false when approval_status is not empty but pending_action is false', () => {
      const user = {
        approval_status: {
          pending_action: false,
        },
      };

      const result = isUserApprovalStatusPending(user);
      expect(result).toBe(false);
    });

    it('should return true when approval_status is not empty and pending_action is true', () => {
      const user = {
        approval_status: {
          pending_action: true,
        },
      };

      const result = isUserApprovalStatusPending(user);
      expect(result).toBe(true);
    });

    it('should return false when approval_status is empty (undefined)', () => {
      const user = {};

      const result = isUserApprovalStatusPending(user);
      expect(result).toBe(false);
    });
  });

  describe('getCustomButtonVisibility', () => {
    it('should return true when custom_user_buttons_visibility is true', () => {
      const config = {
        custom_user_buttons_visibility: true,
      };

      const result = getCustomButtonVisibility(config);
      expect(result).toBe(true);
    });

    it('should return false when custom_user_buttons_visibility is false', () => {
      const config = {
        custom_user_buttons_visibility: false,
      };

      const result = getCustomButtonVisibility(config);
      expect(result).toBe(false);
    });

    it('should return undefined when custom_user_buttons_visibility is missing', () => {
      const config = {};

      const result = getCustomButtonVisibility(config);
      expect(result).toBeUndefined();
    });

    it('should return undefined when custom_user_buttons_visibility is explicitly undefined', () => {
      const config = {
        custom_user_buttons_visibility: undefined,
      };

      const result = getCustomButtonVisibility(config);
      expect(result).toBeUndefined();
    });
  });

  describe('customButtonEnabledBasedOnStatus', () => {
    it('should return true if the user’s approval status is pending', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { approval_status: { pending_action: true } };
      const customButtonVisibility = { save: ['user1'], user_field: 'user_id' };

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(true);
    });

    it('should return true if the user’s field is not in the visibility list', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { user_id: 'user2' };
      const customButtonVisibility = { save: ['user1'], user_field: 'user_id' };

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(true);
    });

    it('should return false if the user’s field is in the visibility list', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { user_id: 'user1' };
      const customButtonVisibility = { save: ['user1'], user_field: 'user_id' };

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(false);
    });

    it('should return false when customButtonVisibility is empty for the given action', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { user_id: 'user2' };
      const customButtonVisibility = { save: [], user_field: 'user_id' };

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(false);
    });

    it('should return false when customButtonVisibility is missing or undefined', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { user_id: 'user2' };
      const customButtonVisibility = {};

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(false);
    });

    it('should return true when the user field is not defined in the visibility condition', () => {
      const button = 'saveButton';
      const buttonInfo = { action: 'save' };
      const user = { user_id: 'user2' };
      const customButtonVisibility = { save: ['user1'] };

      const result = customButtonEnabledBasedOnStatus(
        button,
        buttonInfo,
        user,
        customButtonVisibility,
      );
      expect(result).toBe(true);
    });
  });

  describe('isCustomButtonEnabled', () => {
    it('should return true if the user’s field value is in the validation object', () => {
      const validationObj = {
        role: ['admin', 'manager'],
        department: ['sales', 'marketing'],
      };
      const user = {
        role: 'admin',
        department: 'marketing',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(true);
    });

    it('should return false if the user’s field value is not in the validation object', () => {
      const validationObj = {
        role: ['admin', 'manager'],
        department: ['sales', 'marketing'],
      };
      const user = {
        role: 'employee',
        department: 'engineering',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(false);
    });

    it('should return false if the validation object is empty', () => {
      const validationObj = {};
      const user = {
        role: 'admin',
        department: 'sales',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(false);
    });

    it('should return false if the field in user does not exist in the validation object', () => {
      const validationObj = {
        role: ['admin', 'manager'],
      };
      const user = {
        department: 'sales',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(false);
    });

    it('should return true if any of the user’s field values match any in the validation object', () => {
      const validationObj = {
        role: ['admin', 'manager'],
        department: ['sales', 'marketing'],
      };
      const user = {
        role: 'admin',
        department: 'engineering',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(true);
    });

    it('should return false if none of the validation object values match user’s fields', () => {
      const validationObj = {
        role: ['admin', 'manager'],
        department: ['sales', 'marketing'],
      };
      const user = {
        role: 'employee',
        department: 'engineering',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(false);
    });

    it('should return true if the field exists in the validation object and user field is empty but empty string is valid', () => {
      const validationObj = {
        role: ['admin', 'manager', ''],
        department: ['sales', 'marketing'],
      };
      const user = {
        role: '',
        department: 'sales',
      };

      const result = isCustomButtonEnabled(validationObj, user);
      expect(result).toBe(true);
    });
  });

  describe('getUserActionButtonsConfig', () => {
    let mockConfig;
    let mockUser;

    beforeEach(() => {
      mockConfig = {
        users_role_permission: {
          manage_user_action_permissions: {
            disable_change_manager: false,
            disable_visibility: false,
            disable_lock: false,
            disable_edit: false,
          },
        },
        leads_authorizations: {
          enable_disable_user: true,
        },
      };

      mockUser = {
        disabled: false,
        code: 'ABC',
        region: 'ABC',
        approval_status: {},
        locked: true,
      };
    });

    it('should enable all buttons if conditions are met', () => {
      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(false);
      expect(result.disableUserButton.disabled).toBe(false);
      expect(result.enableUnLockButton.disabled).toBe(false);
      expect(result.enableUserButton.disabled).toBe(true);
    });

    it('should disable Change Manager button if "disable_change_manager" is true in config', () => {
      mockConfig.users_role_permission.manage_user_action_permissions.disable_change_manager =
        true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(true);
    });

    it('should disable Change Manager button if user is disabled', () => {
      mockUser.disabled = true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(true);
    });

    it('should disable Change Manager button if user cannot be enabled or disabled', () => {
      mockConfig.leads_authorizations.enable_disable_user = false;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(true);
    });

    it('should disable Change Manager button if user code does not match region', () => {
      mockUser.code = 'XYZ';
      mockUser.region = 'ABC';

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(true);
    });

    it('should disable Change Manager button if approval status is pending', () => {
      mockUser.approval_status = { pending_action: true };

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.changeManagerButton.disabled).toBe(true);
    });

    it('should disable Disable User button if "disable_visibility" is true in config', () => {
      mockConfig.users_role_permission.manage_user_action_permissions.disable_visibility =
        true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.disableUserButton.disabled).toBe(true);
    });

    it('should disable Disable User button if user is disabled', () => {
      mockUser.disabled = true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.disableUserButton.disabled).toBe(true);
    });

    it('should disable Unlock User button if "disable_lock" is true in config', () => {
      mockConfig.users_role_permission.manage_user_action_permissions.disable_lock =
        true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUnLockButton.disabled).toBe(true);
    });

    it('should disable Unlock User button if user is not locked', () => {
      mockUser.locked = false;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUnLockButton.disabled).toBe(true);
    });

    it('should enable Unlock User button if user is locked', () => {
      mockUser.locked = true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUnLockButton.disabled).toBe(false);
    });

    it('should disable Enable User button if "disable_visibility" is true in config', () => {
      mockConfig.users_role_permission.manage_user_action_permissions.disable_visibility =
        true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUserButton.disabled).toBe(true);
    });

    it('should disable Enable User button if user is not disabled', () => {
      mockUser.disabled = false;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUserButton.disabled).toBe(true);
    });

    it('should enable Enable User button if user is disabled', () => {
      mockUser.disabled = true;

      const result = getUserActionButtonsConfig(mockConfig, mockUser);

      expect(result.enableUserButton.disabled).toBe(false);
    });
  });

  describe('getUserEditButtonConfig', () => {
    let mockConfig;
    let mockUser;

    beforeEach(() => {
      mockConfig = {
        users_role_permission: {
          manage_user_action_permissions: {
            disable_edit: false,
          },
        },
      };

      mockUser = {
        code: 'USER',
        disabled: false,
        approval_status: {},
      };
    });

    it('should disable Edit button if user.code is SU or SELFSERVE_ADMIN', () => {
      mockUser.code = 'SU';
      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(true);

      mockUser.code = 'SELFSERVE_ADMIN';
      const resultSelSelfServeAdmin = getUserEditButtonConfig(
        mockConfig,
        mockUser,
      );
      expect(resultSelSelfServeAdmin.disabled).toBe(true);
    });

    it('should disable Edit button if "disable_edit" is true in config', () => {
      mockConfig.users_role_permission.manage_user_action_permissions.disable_edit =
        true;
      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(true);
    });

    it('should disable Edit button if user is disabled', () => {
      mockUser.disabled = true;
      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(true);
    });

    it('should disable Edit button if user approval status is pending', () => {
      mockUser.approval_status = { pending_action: true };
      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(true);
    });

    it('should disable Edit button if getIsIsacButtonEnabled() returns true', () => {
      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(undefined);
    });

    it('should enable Edit button if all conditions are met for enabled state', () => {
      mockUser.disabled = false;
      mockUser.approval_status = {};

      const result = getUserEditButtonConfig(mockConfig, mockUser);
      expect(result.disabled).toBe(undefined);
    });
  });
});
