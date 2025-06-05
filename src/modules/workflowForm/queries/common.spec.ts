import i18next from 'i18next';
import en from 'src/i18n/translations/en';
import {
  filterEmptyValues,
  getChangeManagerInputs,
  getConvertedValues,
  getFilteredData,
  getFormInputs,
  getSubmitButtonText,
  getVymoFormTitle,
} from './common';

describe('src/modules/workflowForm/queries/common.spec.ts', () => {
  beforeAll(async () => {
    await i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
      },
    });
  });

  describe('getVymoFormTitle', () => {
    it('should return "Create Task" for "create_task" action', () => {
      const result = getVymoFormTitle('create_task');
      expect(result).toBe('Create Task');
    });

    it('should return "Edit Task" for "edit_task" action', () => {
      const result = getVymoFormTitle('edit_task');
      expect(result).toBe('Edit Task');
    });

    it('should return "Add User" for "add_user" action', () => {
      const result = getVymoFormTitle('add_user');
      expect(result).toBe('Add User');
    });

    it('should return "Edit User" for "edit_user" action', () => {
      const result = getVymoFormTitle('edit_user');
      expect(result).toBe('Edit User');
    });

    it('should return "Disable User" for "disableUser" action', () => {
      const result = getVymoFormTitle('disableUser');
      expect(result).toBe('Disable User');
    });

    it('should return "Enable User" for "enableUser" action', () => {
      const result = getVymoFormTitle('enableUser');
      expect(result).toBe('Enable User');
    });

    it('should return "Unlock User" for "unlockUser" action', () => {
      const result = getVymoFormTitle('unlockUser');
      expect(result).toBe('Unlock User');
    });

    it('should return "Change Manager" for "changeManager" action', () => {
      const result = getVymoFormTitle('changeManager');
      expect(result).toBe('Change Manager');
    });

    it('should return "Vymo Form" for an unknown action', () => {
      const result = getVymoFormTitle('unknown_action');
      expect(result).toBe('Vymo Form');
    });
  });

  describe('getConvertedValues', () => {
    it('should convert inputs into the correct structure', () => {
      const inputs = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
      };

      const expectedOutput = {
        name: { value: 'John Doe', code: 'name' },
        email: { value: 'john.doe@example.com', code: 'email' },
        age: { value: 30, code: 'age' },
      };

      const result = getConvertedValues(inputs);
      expect(result).toEqual(expectedOutput);
    });

    it('should return an empty object if no inputs are provided', () => {
      const inputs = {};
      const result = getConvertedValues(inputs);
      expect(result).toEqual({});
    });

    it('should handle an object with a single key-value pair', () => {
      const inputs = { username: 'johndoe' };
      const expectedOutput = {
        username: { value: 'johndoe', code: 'username' },
      };

      const result = getConvertedValues(inputs);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle mixed data types correctly', () => {
      const inputs = {
        active: true,
        balance: 100.5,
        lastLogin: '2025-03-06',
      };

      const expectedOutput = {
        active: { value: true, code: 'active' },
        balance: { value: 100.5, code: 'balance' },
        lastLogin: { value: '2025-03-06', code: 'lastLogin' },
      };

      const result = getConvertedValues(inputs);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle nested objects as values', () => {
      const inputs = {
        user: { name: 'John Doe', age: 30 },
        email: 'john.doe@example.com',
      };

      const expectedOutput = {
        user: { value: { name: 'John Doe', age: 30 }, code: 'user' },
        email: { value: 'john.doe@example.com', code: 'email' },
      };

      const result = getConvertedValues(inputs);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('getSubmitButtonText', () => {
    it('should return "Reassign" for "changeManager" action', () => {
      const result = getSubmitButtonText('changeManager', false, false, false);
      expect(result).toBe('Reassign');
    });

    it('should return "Send For Approval" when approval is enabled but conditional approval is disabled', () => {
      const result = getSubmitButtonText('someAction', true, false, false);
      expect(result).toBe('Send For Approval');
    });

    it('should return "Check For Approval" when conditional approval is enabled and API call has not been made', () => {
      const result = getSubmitButtonText('someAction', true, true, false);
      expect(result).toBe('Check For Approval');
    });

    it('should return "Send For Approval" when conditional approval is enabled and API call has been made', () => {
      const result = getSubmitButtonText('someAction', true, true, true);
      expect(result).toBe('Send For Approval');
    });

    it('should return "Check For Approval" when conditional approval is enabled and API call has not been made (generic action)', () => {
      const result = getSubmitButtonText('genericAction', true, true, false);
      expect(result).toBe('Check For Approval');
    });

    it('should return "Send For Approval" when approval is enabled but conditional approval is disabled and API call has been made', () => {
      const result = getSubmitButtonText('anotherAction', true, false, true);
      expect(result).toBe('Send For Approval');
    });

    it('should return "Submit" when approval is not enabled', () => {
      const result = getSubmitButtonText('someAction', false, false, false);
      expect(result).toBe('Submit');
    });

    it('should return "Send For Approval" when approval is enabled and action is not "changeManager"', () => {
      const result = getSubmitButtonText('editTask', true, false, false);
      expect(result).toBe('Send For Approval');
    });

    it('should return "Reassign" for "changeManager" action when approval is enabled and conditional approval is enabled', () => {
      const result = getSubmitButtonText('changeManager', true, true, false);
      expect(result).toBe('Check For Approval');
    });

    it('should return "Reassign" for "changeManager" action when approval is enabled but conditional approval is disabled', () => {
      const result = getSubmitButtonText('changeManager', true, false, false);
      expect(result).toBe('Send For Approval');
    });
  });

  describe('getChangeManagerInputs', () => {
    it('should return an empty activeBranchUsers list when configInputs is empty', () => {
      const result = getChangeManagerInputs([], 'someVoId');
      expect(result[0].code_name_spinner_options).toEqual([]);
      expect(result[1]).toEqual({
        code: 'note',
        hint: 'Note: It could take some time for the new Manager to have visibility to all data belonging to their team members',
        type: 'label',
        value: '',
      });
    });

    it('should return an empty activeBranchUsers list when no users match the filter criteria', () => {
      const configInputs = [
        {
          code: 'user1',
          region_type: 'territory',
          disabled: false,
          region: 'region1',
          name: 'User One',
        },
        {
          code: 'user2',
          region_type: 'territory',
          disabled: false,
          region: 'region2',
          name: 'User Two',
        },
      ];
      const result = getChangeManagerInputs(configInputs, 'someVoId');
      expect(result[0].code_name_spinner_options).toEqual([]);
    });

    it('should return only valid users who match the filter criteria', () => {
      const configInputs = [
        {
          code: 'user1',
          region_type: 'region',
          disabled: false,
          region: 'SU',
          name: 'User One',
        },
        {
          code: 'user2',
          region_type: 'region',
          disabled: false,
          region: 'user2',
          name: 'User Two',
        },
        {
          code: 'user3',
          region_type: 'region',
          disabled: true,
          region: 'SU',
          name: 'User Three',
        },
      ];
      const result = getChangeManagerInputs(configInputs, 'user3');
      expect(result[0].code_name_spinner_options).toEqual([
        { code: 'user2', name: 'User Two (user2)' },
      ]);
    });

    it('should exclude the user with the same code as voId from the activeBranchUsers list', () => {
      const configInputs = [
        {
          code: 'user1',
          region_type: 'region',
          disabled: false,
          region: 'SU',
          name: 'User One',
        },
        {
          code: 'user2',
          region_type: 'region',
          disabled: false,
          region: 'user2',
          name: 'User Two',
        },
      ];
      const result = getChangeManagerInputs(configInputs, 'user1');
      expect(result[0].code_name_spinner_options).toEqual([
        { code: 'user2', name: 'User Two (user2)' },
      ]);
    });

    it('should return an empty activeBranchUsers list when all users are excluded', () => {
      const configInputs = [
        {
          code: 'user1',
          region_type: 'territory',
          disabled: true,
          region: 'region1',
          name: 'User One',
        },
        {
          code: 'user2',
          region_type: 'territory',
          disabled: true,
          region: 'region2',
          name: 'User Two',
        },
      ];
      const result = getChangeManagerInputs(configInputs, 'user3');
      expect(result[0].code_name_spinner_options).toEqual([]);
    });

    it('should return all valid users when voId is empty', () => {
      const configInputs = [
        {
          code: 'user1',
          region_type: 'region',
          disabled: false,
          region: 'SU',
          name: 'User One',
        },
        {
          code: 'user2',
          region_type: 'region',
          disabled: false,
          region: 'user2',
          name: 'User Two',
        },
      ];
      const result = getChangeManagerInputs(configInputs, '');
      expect(result[0].code_name_spinner_options).toEqual([
        { code: 'user2', name: 'User Two (user2)' },
      ]);
    });
  });

  describe('getFormInputs', () => {
    const mockModule = {
      tasks: [
        {
          code: 'task1',
          can_log: true,
          can_schedule: true,
          log_inputs: { __default: ['input1'] },
          create_inputs: { __default: ['input2'] },
        },
        {
          code: 'task2',
          can_log: false,
          can_schedule: true,
          log_inputs: { __default: [] },
          create_inputs: { __default: ['input3'] },
        },
      ],
      name: 'Module1',
      start_state: 'start_state_value',
    };

    const mockVo = {
      code: 'vo1',
      name: 'VO1',
      data: {
        participants: [{ code: 'user1', name: 'User One' }],
      },
    };

    const mockConfigInputs = [
      { ssKey: 'input1', type: 'referral' },
      { ssKey: 'input2', type: 'text' },
      { ssKey: 'input3', type: 'date' },
    ];

    const mockValues = {
      type: { value: 'log' },
      activity: { value: 'task1' },
    };

    it('should return task creation inputs when action is "create_task"', () => {
      const result = getFormInputs(
        mockModule,
        mockConfigInputs,
        mockValues,
        'moduleCode',
        'create_task',
        mockVo,
      );
      expect(result).toEqual([
        {
          code: 'type',
          code_name_spinner_options: [
            { code: 'schedule', name: 'Schedule Activity' },
            { code: 'log', name: 'Log Activity' },
          ],
          hint: 'Select Type',
          required: true,
          returnCode: true,
          type: 'code_name_spinner',
        },
        { json: true, ssKey: 'input1', type: 'referral' },
      ]);
    });

    it('should return the provided inputs when action is not "create_task"', () => {
      const result = getFormInputs(
        mockModule,
        mockConfigInputs,
        mockValues,
        'moduleCode',
        'edit_task',
        mockVo,
      );
      expect(result).toEqual(mockConfigInputs);
    });
  });

  describe('filterEmptyValues', () => {
    it('should return fields with non-empty values', () => {
      const mockData = [
        { type: 'text', value: 'Hello' },
        { type: 'date', value: '2023-03-12' },
        { type: 'number', value: 123 },
        { type: 'location', value: '{"lat": 12, "long": 34}' },
        { type: 'meeting', value: { date: '2023-03-12' } },
        { type: 'photo', value: 'image.jpg' },
        { type: 'multi_select_check_box', value: ['Option 1'] },
      ];

      // parseJSON.mockReturnValue({});

      const result = filterEmptyValues(mockData);

      expect(result).toEqual(mockData);
    });

    it('should exclude fields with empty values or null', () => {
      const mockData = [
        { type: 'text', value: '' },
        { type: 'date', value: null },
        { type: 'number', value: null },
        { type: 'location', value: '{}' },
        { type: 'meeting', value: {} },
        { type: 'photo', value: '' },
        { type: 'multi_select_check_box', value: [] },
        { type: 'multi_select_auto_complete', value: '[]' },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([
        { type: 'text', value: '' },
        { type: 'location', value: '{}' },
        { type: 'photo', value: '' },
        { type: 'multi_select_check_box', value: [] },
      ]);
    });

    it('should handle multi_select_auto_complete with valid parsedJSON', () => {
      const mockData = [
        {
          type: 'multi_select_auto_complete',
          value: '[{"id": 1, "name": "Option 1"}]',
        },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual(mockData);
    });

    it('should exclude multi_select_auto_complete if parsedJSON is empty', () => {
      const mockData = [{ type: 'multi_select_auto_complete', value: '[]' }];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([]);
    });

    it('should handle location with valid parsedJSON', () => {
      const mockData = [{ type: 'location', value: '{"lat": 12, "long": 34}' }];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([
        { type: 'location', value: '{"lat": 12, "long": 34}' },
      ]);
    });

    it('should exclude location if parsedJSON is empty', () => {
      const mockData = [{ type: 'location', value: '{}' }];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([{ type: 'location', value: '{}' }]);
    });

    it('should handle boolean values correctly', () => {
      const mockData = [
        { type: 'text', value: 'Test' },
        { type: 'boolean', value: true },
        { type: 'boolean', value: false },
        { type: 'boolean', value: null },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([
        { type: 'text', value: 'Test' },
        { type: 'boolean', value: true },
        { type: 'boolean', value: false },
      ]);
    });

    it('should exclude values with null or undefined in multi_select_check_box', () => {
      const mockData = [
        { type: 'multi_select_check_box', value: [] },
        { type: 'multi_select_check_box', value: ['Option 1'] },
        { type: 'multi_select_check_box', value: null },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([
        { type: 'multi_select_check_box', value: [] },
        { type: 'multi_select_check_box', value: ['Option 1'] },
      ]);
    });

    it('should return fields with valid non-empty array values', () => {
      const mockData = [
        {
          type: 'multi_select_auto_complete',
          value: '[{"id": 1, "name": "Option 1"}]',
        },
        { type: 'multi_select_check_box', value: ['Option 1', 'Option 2'] },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual(mockData);
    });

    it('should exclude invalid types', () => {
      const mockData = [
        { type: 'text', value: 'Some text' },
        { type: 'unknown', value: 'Some value' },
      ];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([
        { type: 'text', value: 'Some text' },
        { type: 'unknown', value: 'Some value' },
      ]);
    });

    it('should handle edge case of empty data input', () => {
      const mockData = [];

      const result = filterEmptyValues(mockData);

      expect(result).toEqual([]);
    });
  });

  describe('getFilteredData', () => {
    it('should call getFilteredDataForUser when action is "edit_user"', () => {
      const result = { data: [{ code: 'name', value: 'John Doe' }] };
      const vo = { name: 'John Doe' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({ data: [] });
    });

    it('should return the original result when action is not "edit_user"', () => {
      const result = { data: [{ code: 'name', value: 'John Doe' }] };
      const vo = { name: 'John Doe' };
      const action = 'some_other_action';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual(result);
    });

    it('should handle empty result data', () => {
      const result = { data: [] };
      const vo = {};
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({ data: [] });
    });

    it('should correctly handle mismatched values in getFilteredDataForUser', () => {
      const result = { data: [{ code: 'name', value: 'John' }] };
      const vo = { name: 'Jane' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({
        data: [{ code: 'name', value: 'John' }],
      });
    });

    it('should return reset_password field when its value matches', () => {
      const result = {
        data: [
          { code: 'reset_password', value: 'new_password' },
          { code: 'email', value: 'user@example.com' },
        ],
      };
      const vo = { reset_password: 'new_password', email: 'user@example.com' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({
        data: [],
      });
    });

    it('should exclude fields from filteredData based on mismatch with user inputs', () => {
      const result = { data: [{ code: 'name', value: 'John Doe' }] };
      const vo = { name: 'Jane Doe' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({
        data: [
          {
            code: 'name',
            name: undefined,
            type: undefined,
            value: 'John Doe',
          },
        ],
      });
    });

    it('should return correct result when a value is parsed as JSON and matches', () => {
      const result = {
        data: [{ code: 'location', value: '{"lat": 10, "long": 20}' }],
      };
      const vo = { location: '{"lat": 10, "long": 20}' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({
        data: [],
      });
    });

    it('should exclude values from filteredData that do not match JSON values correctly', () => {
      const result = {
        data: [{ code: 'location', value: '{"lat": 10, "long": 20}' }],
      };
      const vo = { location: '{"lat": 10, "long": 25}' };
      const action = 'edit_user';

      const resultData = getFilteredData(action, result, vo);

      expect(resultData).toEqual({
        data: [
          {
            code: 'location',
            name: undefined,
            type: undefined,
            value: '{"lat": 10, "long": 20}',
          },
        ],
      });
    });
  });
});
