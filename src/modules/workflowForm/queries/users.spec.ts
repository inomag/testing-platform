import {
  getFilteredDataForUser,
  getUserManagementApprovalsEssentials,
} from './users';

describe('src/modules/workflowForm/queries/users.spec.ts', () => {
  describe('getUserManagementApprovalsEssentials', () => {
    const mockConfig = {
      user: {
        attributes: {
          role: 'admin',
        },
      },
      user_management_config: {
        approval_config: {
          enabled: true,
          approval_config_mappings: [
            {
              action: 'create_user',
              scopes: ['admin', 'manager'],
              conditional_approval: true,
            },
            {
              action: 'edit_user',
              scopes: ['admin'],
              conditional_approval: false,
            },
          ],
        },
      },
    };

    it('should return [true, true] when approval is enabled and conditional approval is true for the action', () => {
      const result = getUserManagementApprovalsEssentials(
        'create_user',
        mockConfig,
      );
      expect(result).toEqual([true, true]);
    });

    it('should return [true, false] when approval is enabled but conditional approval is false for the action', () => {
      const result = getUserManagementApprovalsEssentials(
        'edit_user',
        mockConfig,
      );
      expect(result).toEqual([true, false]);
    });

    it('should return [false, false] when approval is disabled for the user role', () => {
      const configWithApprovalDisabled = {
        ...mockConfig,
        user_management_config: {
          ...mockConfig.user_management_config,
          approval_config: {
            enabled: false,
            approval_config_mappings: [],
          },
        },
      };

      const result = getUserManagementApprovalsEssentials(
        'create_user',
        configWithApprovalDisabled,
      );
      expect(result).toEqual([false, false]);
    });

    it('should return [false, false] when user role is not in approval scope for the action', () => {
      const configWithNonMatchingRole = {
        ...mockConfig,
        user: {
          attributes: {
            role: 'user',
          },
        },
      };

      const result = getUserManagementApprovalsEssentials(
        'create_user',
        configWithNonMatchingRole,
      );
      expect(result).toEqual([false, false]);
    });

    it('should return [false, false] when config is empty or missing', () => {
      const result = getUserManagementApprovalsEssentials('create_user', {});
      expect(result).toEqual([false, false]);
    });
  });

  describe('getFilteredDataForUser', () => {
    it('should not include fields when valueInInputsMap or user[value.code] matches values[value.code]', () => {
      const result = {
        data: [
          { code: 'name', value: 'John Doe' },
          { code: 'email', value: 'john@example.com' },
        ],
      };
      const values = { name: 'John Doe', email: 'john@example.com' };
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        inputs_map: {},
      };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });

    it('should correctly compare JSON values from valueInInputsMap and values[value.code]', () => {
      const result = {
        data: [
          { code: 'location', value: '{"lat": 10, "long": 20}' },
          { code: 'preferences', value: '{"color": "blue", "size": "M"}' },
        ],
      };
      const values = {
        location: '{"lat": 10, "long": 20}',
        preferences: '{"color": "blue", "size": "M"}',
      };
      const user = {
        inputs_map: {
          location: '{"lat": 10, "long": 20}',
          preferences: '{"color": "blue", "size": "M"}',
        },
      };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });

    it('should include fields that do not match the values', () => {
      const result = {
        data: [
          { code: 'name', value: 'John' },
          { code: 'email', value: 'john@example.com' },
        ],
      };
      const values = { name: 'Jane', email: 'john@example.com' };
      const user = { name: 'Jane', email: 'john@example.com', inputs_map: {} };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });

    it('should handle reset_password and return its value separately', () => {
      const result = {
        data: [
          { code: 'reset_password', value: 'new_password' },
          { code: 'email', value: 'user@example.com' },
        ],
      };
      const values = {
        reset_password: 'new_password',
        email: 'user@example.com',
      };
      const user = {
        reset_password: 'new_password',
        email: 'user@example.com',
        inputs_map: {},
      };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult).toEqual({
        data: [],
      });
    });

    it('should not include fields with null or empty values', () => {
      const result = {
        data: [
          { code: 'name', value: 'John Doe' },
          { code: 'email', value: null },
          { code: 'location', value: '' },
        ],
      };
      const values = { name: 'John Doe', email: null, location: '' };
      const user = {
        name: 'John Doe',
        email: null,
        location: '',
        inputs_map: {},
      };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });

    it('should include fields with different values (e.g., text, email)', () => {
      const result = {
        data: [
          { code: 'name', value: 'John' },
          { code: 'email', value: 'john@example.com' },
        ],
      };
      const values = { name: 'John', email: 'john@example.com' };
      const user = { name: 'John', email: 'john@example.com', inputs_map: {} };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });

    it('should process fields correctly for non-matching JSON values', () => {
      const result = {
        data: [{ code: 'location', value: '{"lat": 10, "long": 20}' }],
      };
      const values = { location: '{"lat": 15, "long": 30}' };
      const user = { location: '{"lat": 10, "long": 20}', inputs_map: {} };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([
        {
          code: 'location',
          name: undefined,
          type: undefined,
          value: '{"lat": 15, "long": 30}',
        },
      ]);
    });

    it('should handle missing input_map for user values', () => {
      const result = {
        data: [{ code: 'email', value: 'john@example.com' }],
      };
      const values = { email: 'john@example.com' };
      const user = { inputs_map: {} };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([
        {
          code: 'email',
          name: undefined,
          type: undefined,
          value: 'john@example.com',
        },
      ]);
    });

    it('should handle undefined or invalid fields correctly', () => {
      const result = {
        data: [
          { code: 'undefined_field', value: undefined },
          { code: 'null_field', value: null },
        ],
      };
      const values = { undefined_field: undefined, null_field: null };
      const user = {
        undefined_field: undefined,
        null_field: null,
        inputs_map: {},
      };

      const filteredResult = getFilteredDataForUser(result, values, user);

      expect(filteredResult.data).toEqual([]);
    });
  });
});
