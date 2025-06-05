import i18next from 'i18next';
import en from 'src/i18n/translations/en';
import { getTaskCreationInputs } from './tasks';

describe('src/modules/workflowForm/queries/tasks.spec.ts', () => {
  beforeAll(async () => {
    await i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
      },
    });
  });

  describe('getTaskCreationInputs', () => {
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

    it('should return inputs for valid task and type "log"', () => {
      const result = getTaskCreationInputs(
        mockValues,
        mockConfigInputs,
        mockModule,
        mockVo,
        'moduleCode',
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

    it('should return inputs for valid task and type "schedule"', () => {
      const values = {
        type: { value: 'schedule' },
        activity: { value: 'task2' },
      };
      const result = getTaskCreationInputs(
        values,
        mockConfigInputs,
        mockModule,
        mockVo,
        'moduleCode',
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
        { ssKey: 'input3', type: 'date' },
      ]);
    });

    it('should return empty inputs when no type is provided', () => {
      const values = {};
      const result = getTaskCreationInputs(
        values,
        mockConfigInputs,
        mockModule,
        mockVo,
        'moduleCode',
      );
      expect(result).toEqual([
        {
          code: 'type',
          hint: 'Select Type',
          type: 'code_name_spinner',
          code_name_spinner_options: [
            { code: 'schedule', name: 'Schedule Activity' },
            { code: 'log', name: 'Log Activity' },
          ],
          required: true,
          returnCode: true,
        },
      ]);
    });

    it('should return only type input when no activity is selected', () => {
      const values = { type: { value: 'log' } };
      const result = getTaskCreationInputs(
        values,
        mockConfigInputs,
        mockModule,
        mockVo,
        'moduleCode',
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
      ]);
    });

    it('should return empty inputs when no tasks are available', () => {
      const emptyModule = { tasks: [] };
      const result = getTaskCreationInputs(
        mockValues,
        mockConfigInputs,
        emptyModule,
        mockVo,
        'moduleCode',
      );
      expect(result).toEqual([
        {
          code: 'type',
          code_name_spinner_options: [
            {
              code: 'schedule',
              name: 'Schedule Activity',
            },
            {
              code: 'log',
              name: 'Log Activity',
            },
          ],
          hint: 'Select Type',
          required: true,
          returnCode: true,
          type: 'code_name_spinner',
        },
      ]);
    });

    it('should return multi_vo inputs when multi_vo is enabled and moduleCode is not "user"', () => {
      const mockTaskWithMultiVO = {
        ...mockModule,
        tasks: [
          {
            code: 'task1',
            can_log: true,
            can_schedule: true,
            log_inputs: { __default: [] },
            create_inputs: { __default: [] },
            vos: { multi_vo: true, context_filters: [] },
          },
        ],
      };

      const result = getTaskCreationInputs(
        mockValues,
        mockConfigInputs,
        mockTaskWithMultiVO,
        mockVo,
        'moduleCode',
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'multi_vos',
            type: 'multi_select_check_box_user',
          }),
        ]),
      );
    });

    it('should not return multi_vo inputs when multi_vo is not enabled', () => {
      const mockTaskWithoutMultiVO = {
        ...mockModule,
        tasks: [
          {
            code: 'task1',
            can_log: true,
            can_schedule: true,
            log_inputs: { __default: [] },
            create_inputs: { __default: [] },
            vos: { multi_vo: false },
          },
        ],
      };

      const result = getTaskCreationInputs(
        mockValues,
        mockConfigInputs,
        mockTaskWithoutMultiVO,
        mockVo,
        'moduleCode',
      );
      expect(result).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'multi_vos' }),
        ]),
      );
    });

    it('should not return multi_vo inputs when moduleCode is "user"', () => {
      const result = getTaskCreationInputs(
        mockValues,
        mockConfigInputs,
        mockModule,
        mockVo,
        'user',
      );
      expect(result).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'multi_vos' }),
        ]),
      );
    });
  });
});
