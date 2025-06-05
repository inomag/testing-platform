import i18next from 'i18next';
import en from 'src/i18n/translations/en';
import { getClientConfigData } from 'src/workspace/utils';
import {
  getApprovalAcceptRejectInputFields,
  getCustomOption,
  getTaskNextStateInputs,
  getTaskNextStates,
  getTaskUpdateInputs,
  getVoUpdateAction,
} from './voUpdate';

jest.mock('src/workspace/utils', () => ({
  getClientConfigData: jest.fn(),
}));

describe('src/modules/workflowForm/queries/voUpdate.spec.ts', () => {
  const baseMockConfigData = {
    lead_modules: [
      {
        start_state: 'startState1',
        code: 'module1',
        tasks: [
          {
            code: 'task1',
            actions_enabled: ['complete', 'reschedule', 'reassign', 'edit'],
          },
          {
            code: 'task2',
            actions_enabled: ['complete', 'reschedule'],
          },
        ],
      },
      {
        start_state: 'startState2',
        code: 'module2',
        tasks: [
          {
            code: 'task3',
            actions_enabled: ['complete', 'cancel'],
          },
        ],
      },
    ],
    features_config: {
      google_integration: {
        module_first_update_types: 'google_integration_update',
      },
    },
    leads_authorizations: {
      reassign: true,
      module_role_permissions: {
        module1: {
          reassign: true,
        },
        module2: {
          reassign: false,
        },
      },
    },
    user_management_config: {
      approval_config: {
        approval_config_mappings: [
          {
            action: 'visibility_change',
            approval_config_code: 'configCode1',
          },
        ],
      },
    },
    approval_setting: {
      configCode1: {
        approve_inputs: { __default: ['input1', 'input2'] },
        reject_inputs: { __default: ['input3', 'input4'] },
      },
    },
    user_config: {
      approval_config_mapping: [
        {
          taskCode: 'task1',
          action: 'schedule_activity',
          approval_config_code: 'configCode1',
        },
      ],
      tasks: [
        {
          code: 'task1',
          actions_enabled: ['complete', 'reschedule', 'reassign', 'edit'],
          edit_inputs: {
            __default: ['input1', 'input2'],
          },
          complete_inputs: {
            __default: ['input1', 'input2'],
          },
        },
      ],
    },
    tasks: [
      {
        code: 'task1',
        participation_check: true,
        participants: {
          enabled: true,
          scope: ['manager', 'subordinate'],
          filters: {},
        },
        follow_up_inputs: {
          __default: ['input1', 'input2'],
        },
        reassign_scopes: ['subordinates'],
        complete_inputs: {
          __default: ['input1', 'input2'],
        },
      },
    ],
  };

  beforeAll(async () => {
    await i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
      },
    });
  });

  describe('getVoUpdateAction', () => {
    it('should return "COMPLETE" for "complete_inputs" state', () => {
      const state = 'complete_inputs';
      const result = getVoUpdateAction(state);
      expect(result).toBe('COMPLETE');
    });

    it('should return "RESCHEDULE" for "reschedule_inputs" state', () => {
      const state = 'reschedule_inputs';
      const result = getVoUpdateAction(state);
      expect(result).toBe('RESCHEDULE');
    });

    it('should return "REASSIGN" for "reassign_inputs" state', () => {
      const state = 'reassign_inputs';
      const result = getVoUpdateAction(state);
      expect(result).toBe('REASSIGN');
    });

    it('should return "EDIT" for "edit_inputs" state', () => {
      const state = 'edit_inputs';
      const result = getVoUpdateAction(state);
      expect(result).toBe('EDIT');
    });

    it('should return "CANCEL" for "cancel_inputs" state', () => {
      const state = 'cancel_inputs';
      const result = getVoUpdateAction(state);
      expect(result).toBe('CANCEL');
    });

    it('should return an empty string for invalid state', () => {
      const state = 'invalid_state';
      const result = getVoUpdateAction(state);
      expect(result).toBe('');
    });

    it('should return an empty string for undefined state', () => {
      const state = undefined;
      const result = getVoUpdateAction(state);
      expect(result).toBe('');
    });

    it('should return an empty string for null state', () => {
      const state = null;
      const result = getVoUpdateAction(state);
      expect(result).toBe('');
    });

    it('should return an empty string for an empty string state', () => {
      const state = '';
      const result = getVoUpdateAction(state);
      expect(result).toBe('');
    });
  });

  describe('getCustomOption', () => {
    it('should return the correct structure with self, managers, direct_reports, peers, and subordinates', () => {
      const user = { code: 'user123', name: 'John Doe' };
      const result = getCustomOption(user);

      expect(result).toEqual({
        self: { code: 'user123', name: 'John Doe' },
        managers: { code: 'managers', name: 'My Manager' },
        direct_reports: { code: 'direct_reports', name: 'My Direct Reports' },
        peers: { code: 'peers', name: 'My Peers' },
        subordinates: { code: 'subordinates', name: 'All Subordinates' },
      });
    });

    it('should handle empty user object correctly', () => {
      const user = { code: '', name: '' };
      const result = getCustomOption(user);

      expect(result).toEqual({
        self: { code: '', name: '' },
        managers: { code: 'managers', name: 'My Manager' },
        direct_reports: { code: 'direct_reports', name: 'My Direct Reports' },
        peers: { code: 'peers', name: 'My Peers' },
        subordinates: { code: 'subordinates', name: 'All Subordinates' },
      });
    });

    it('should handle user object with undefined values', () => {
      const user = { code: undefined, name: undefined };
      const result = getCustomOption(user);

      expect(result).toEqual({
        self: { code: undefined, name: undefined },
        managers: { code: 'managers', name: 'My Manager' },
        direct_reports: { code: 'direct_reports', name: 'My Direct Reports' },
        peers: { code: 'peers', name: 'My Peers' },
        subordinates: { code: 'subordinates', name: 'All Subordinates' },
      });
    });

    it('should not include super_managers in the result', () => {
      const user = { code: 'user123', name: 'John Doe' };
      const result = getCustomOption(user);

      expect(result).not.toHaveProperty('super_managers');
    });

    it('should return the correct result when user has different code and name', () => {
      const user = { code: 'user456', name: 'Jane Smith' };
      const result = getCustomOption(user);

      expect(result).toEqual({
        self: { code: 'user456', name: 'Jane Smith' },
        managers: { code: 'managers', name: 'My Manager' },
        direct_reports: { code: 'direct_reports', name: 'My Direct Reports' },
        peers: { code: 'peers', name: 'My Peers' },
        subordinates: { code: 'subordinates', name: 'All Subordinates' },
      });
    });
  });

  describe('getTaskNextStates', () => {
    const baseMockActivity = {
      category: 'activity_category',
      state: 'IN_PROGRESS',
      data: {
        task: { code: 'task1' },
        vo: { start_state: 'startState1' },
      },
    };

    it('should return the correct next states based on task actions', () => {
      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);
      const result = getTaskNextStates(baseMockActivity);
      expect(result).toEqual([
        { code: 'complete_inputs', name: 'Complete', type: 'COMPLETE' },
        { code: 'reschedule_inputs', name: 'Reschedule', type: 'RESCHEDULE' },
        { code: 'reassign_inputs', name: 'Reassign', type: 'REASSIGN' },
        { code: 'edit_inputs', name: 'Edit', type: 'EDIT' },
      ]);
    });

    it('should return an empty array for a task with no actions enabled', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        lead_modules: [
          {
            ...baseMockConfigData.lead_modules[0],
            tasks: [
              {
                code: 'task1',
                actions_enabled: [],
              },
            ],
          },
        ],
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        data: { task: { code: 'task1' }, vo: { start_state: 'startState1' } },
      });

      expect(result).toEqual([]);
    });

    it('should return next states for a task that can be edited after completion', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        lead_modules: [
          {
            ...baseMockConfigData.lead_modules[0],
            tasks: [
              {
                code: 'task1',
                actions_enabled: ['edit_on_completion'],
              },
            ],
          },
        ],
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        state: 'COMPLETED',
      });

      expect(result).toEqual([
        { code: 'edit_inputs', name: 'Edit', type: 'EDIT' },
      ]);
    });

    it('should return cancel action if cancel is enabled for the task', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        lead_modules: [
          {
            ...baseMockConfigData.lead_modules[0],
            tasks: [
              {
                code: 'task2',
                actions_enabled: ['cancel'],
              },
            ],
          },
        ],
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        data: { task: { code: 'task2' }, vo: { start_state: 'startState1' } },
      });

      expect(result).toEqual([
        { code: 'cancel_inputs', name: 'Cancel', type: 'CANCEL' },
      ]);
    });

    it('should not include reassign if reassign is not allowed for the module', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        leads_authorizations: {
          ...baseMockConfigData.leads_authorizations,
          reassign: false,
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        data: { task: { code: 'task1' }, vo: { start_state: 'startState1' } },
      });

      expect(result).toEqual([
        { code: 'complete_inputs', name: 'Complete', type: 'COMPLETE' },
        { code: 'reschedule_inputs', name: 'Reschedule', type: 'RESCHEDULE' },
        { code: 'edit_inputs', name: 'Edit', type: 'EDIT' },
      ]);
    });

    it('should return the correct next states for a Google Calendar task when start_state is missing', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        lead_modules: [
          ...baseMockConfigData.lead_modules,
          {
            start_state: 'google_integration_update',
            code: 'module2',
            tasks: [
              {
                code: 'task2',
                actions_enabled: ['complete', 'reschedule'],
              },
            ],
          },
        ],
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        data: {
          task: { code: 'task2', type: 'google_calendar' },
          vo: { start_state: '' },
        },
      });

      expect(result).toEqual([
        { code: 'complete_inputs', name: 'Complete', type: 'COMPLETE' },
        { code: 'reschedule_inputs', name: 'Reschedule', type: 'RESCHEDULE' },
      ]);
    });

    it('should return the correct next states for USER_CALENDAR_ITEM category with user module', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        user_config: {
          tasks: [
            {
              code: 'task1',
              actions_enabled: ['complete', 'reschedule', 'reassign', 'edit'],
            },
          ],
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getTaskNextStates({
        ...baseMockActivity,
        category: 'USER_CALENDAR_ITEM',
      });

      expect(result).toEqual([
        { code: 'complete_inputs', name: 'Complete', type: 'COMPLETE' },
        { code: 'reschedule_inputs', name: 'Reschedule', type: 'RESCHEDULE' },
        { code: 'reassign_inputs', name: 'Reassign', type: 'REASSIGN' },
        { code: 'edit_inputs', name: 'Edit', type: 'EDIT' },
      ]);
    });
  });

  describe('getApprovalAcceptRejectInputFields', () => {
    const baseMockActivity = {
      category: 'activity_category',
      state: 'IN_PROGRESS',
      data: {
        task: {
          approval_info: {
            action: 'scheduled',
            type: 'task',
            action_data: {
              task_code: 'task1',
              state: 'APPROVED',
              from_state: 'IN_PROGRESS',
              to_state: 'COMPLETED',
            },
          },
        },
      },
    };

    it('should return the correct inputs for a task approval action', () => {
      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        baseMockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([
        { code: 'input1', ssKey: 'input1' },
        { code: 'input2', ssKey: 'input2' },
      ]);
    });

    it('should return the correct inputs for task rejection action', () => {
      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        baseMockActivity,
        'approval_item_reject',
        [
          { code: 'input3', ssKey: 'input3' },
          { code: 'input4', ssKey: 'input4' },
        ],
      );

      expect(result).toEqual([
        { code: 'input3', ssKey: 'input3' },
        { code: 'input4', ssKey: 'input4' },
      ]);
    });

    it('should return an empty array for task approval action when no matching inputs are found', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        approval_setting: {
          configCode1: {
            approve_inputs: { __default: [] },
            reject_inputs: { __default: [] },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        baseMockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([]);
    });

    it('should return an empty array for task rejection action when no matching inputs are found', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        approval_setting: {
          configCode1: {
            approve_inputs: { __default: [] },
            reject_inputs: { __default: [] },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        baseMockActivity,
        'approval_item_reject',
        [
          { code: 'input3', ssKey: 'input3' },
          { code: 'input4', ssKey: 'input4' },
        ],
      );

      expect(result).toEqual([]);
    });

    it('should return the correct approval inputs for a visibility_change action for user approval type', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        user_management_config: {
          approval_config: {
            approval_config_mappings: [
              {
                action: 'visibility_change',
                approval_config_code: 'configCode1',
              },
            ],
          },
        },
      };

      const mockActivity = {
        ...baseMockActivity,
        data: {
          task: {
            approval_info: {
              action: 'unlock',
              type: 'user',
              action_data: {},
            },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        mockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([
        { code: 'input1', ssKey: 'input1' },
        { code: 'input2', ssKey: 'input2' },
      ]);
    });

    it('should return the correct inputs for disable user action type', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        user_management_config: {
          approval_config: {
            approval_config_mappings: [
              {
                action: 'visibility_change',
                approval_config_code: 'configCode1',
              },
            ],
          },
        },
      };

      const mockActivity = {
        ...baseMockActivity,
        data: {
          task: {
            approval_info: {
              action: 'disable',
              type: 'user',
              action_data: {},
            },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        mockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([
        { code: 'input1', ssKey: 'input1' },
        { code: 'input2', ssKey: 'input2' },
      ]);
    });

    it('should return the correct inputs for VO type approval action', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        approval_setting: {
          configCode1: {
            approve_inputs: { __default: ['input1', 'input2'] },
            reject_inputs: { __default: ['input3', 'input4'] },
          },
        },
      };

      const mockActivity = {
        ...baseMockActivity,
        data: {
          task: {
            approval_info: {
              action: 'approve',
              type: 'vo',
              action_data: {
                from_state: 'START',
                to_state: 'COMPLETED',
              },
            },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        mockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([]);
    });

    it('should return an empty array when the taskCode does not match any approval_config_mapping', () => {
      const mockConfigData = {
        ...baseMockConfigData,
        approval_setting: {
          configCode1: {
            approve_inputs: { __default: ['input1'] },
            reject_inputs: { __default: ['input3'] },
          },
        },
      };

      const mockActivity = {
        ...baseMockActivity,
        data: {
          task: {
            approval_info: {
              action: 'approve',
              type: 'task',
              action_data: {
                task_code: 'nonexistent_task',
              },
            },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(mockConfigData);

      const result = getApprovalAcceptRejectInputFields(
        mockActivity,
        'approval_item_approve',
        [
          { code: 'input1', ssKey: 'input1' },
          { code: 'input2', ssKey: 'input2' },
        ],
      );

      expect(result).toEqual([]);
    });
  });

  describe('getTaskNextStateInputs', () => {
    const baseMockActivity = {
      category: 'USER_CALENDAR_ITEM',
      state: 'IN_PROGRESS',
      data: {
        task: {
          code: 'task1',
          attributes: {
            input1: 'value1',
          },
        },
        user: {
          code: 'user123',
        },
        participants: [
          { code: 'user123', name: 'John Doe' },
          { code: 'user456', name: 'Jane Smith' },
        ],
      },
    };

    it('should return the correct inputs for task when selectedState is "edit_inputs"', () => {
      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getTaskNextStateInputs(
        { first_update_type: 'startState1' },
        baseMockActivity,
        'edit_inputs',
        [{ ssKey: 'input1', code: 'input1' }],
      );

      expect(result).toEqual([
        { ssKey: 'input1', code: 'input1', value: 'value1' },
      ]);
    });

    it('should return correct inputs for task when selectedState is "complete_inputs"', () => {
      const mockActivity = { ...baseMockActivity, state: 'COMPLETED' };
      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getTaskNextStateInputs(
        { first_update_type: 'startState1' },
        mockActivity,
        'complete_inputs',
        [{ ssKey: 'input1', code: 'input1' }],
      );

      expect(result).toEqual([
        { ssKey: 'input1', code: 'input1', value: 'value1' },
      ]);
    });

    it('should not include participant field if participation is disabled', () => {
      const mockActivity = {
        ...baseMockActivity,
        data: {
          ...baseMockActivity.data,
          task: {
            ...baseMockActivity.data.task,
            participants: { enabled: false, scope: [] },
          },
        },
      };

      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getTaskNextStateInputs(
        { first_update_type: 'startState1' },
        mockActivity,
        'edit_inputs',
        [],
      );

      expect(result).toEqual([]);
    });
  });

  describe('getTaskUpdateInputs', () => {
    const baseMockActivity = {
      category: 'activity_category',
      state: 'IN_PROGRESS',
      data: {
        task: { code: 'task1' },
        vo: { start_state: 'startState1' },
      },
    };

    it('should return an empty array if there are no next states', () => {
      const values = { selectStateInput: { value: 'complete_inputs' } };
      const allInputs = [];
      const activity = {};
      const lead = { first_update_type: 'type1' };

      const result = getTaskUpdateInputs(
        values,
        allInputs,
        'user',
        {},
        'module1',
        activity,
        lead,
      );
      expect(result).toEqual([]);
    });

    it('should return inputs if there are next states', () => {
      const values = { selectStateInput: { value: 'complete_inputs' } };
      const allInputs = [];
      const lead = { first_update_type: 'type1' };

      (getClientConfigData as jest.Mock).mockReturnValue(baseMockConfigData);

      const result = getTaskUpdateInputs(
        values,
        allInputs,
        'user',
        {},
        'module1',
        baseMockActivity,
        lead,
      );
      expect(result).toEqual([
        {
          code: 'selectStateInput',
          hint: 'Select State',
          type: 'code_name_spinner',
          code_name_spinner_options: [
            { code: 'complete_inputs', name: 'Complete', type: 'COMPLETE' },
            {
              code: 'reschedule_inputs',
              name: 'Reschedule',
              type: 'RESCHEDULE',
            },
            { code: 'reassign_inputs', name: 'Reassign', type: 'REASSIGN' },
            { code: 'edit_inputs', name: 'Edit', type: 'EDIT' },
          ],
          required: true,
          returnCode: true,
        },
      ]);
    });
  });
});
