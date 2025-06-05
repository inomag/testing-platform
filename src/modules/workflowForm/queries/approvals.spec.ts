import { getConvertedApproverFields } from './approvals';

describe('src/modules/workflowForm/queries/approvals.spec.ts', () => {
  describe('getConvertedApproverFields', () => {
    it('should return an empty array when approvers array is empty', () => {
      const result = getConvertedApproverFields([]);
      expect(result).toEqual([]);
    });

    it('should return correctly formatted fields for a single approver with no scope', () => {
      const mockApprovers = [
        {
          name: 'John Doe',
          code: 'john_doe',
          scope: [],
          default_selection: false,
        },
      ];

      const result = getConvertedApproverFields(mockApprovers);

      expect(result).toEqual([
        {
          name: 'John Doe',
          code: 'john_doe',
          required: false,
          hint: 'John Doe',
          type: 'code_name_spinner',
          code_name_spinner_options: [{ code: 'none', name: 'Select' }],
          disabled: false,
        },
      ]);
    });

    it('should return correctly formatted fields for a single approver with a scope', () => {
      const mockApprovers = [
        {
          name: 'Jane Doe',
          code: 'jane_doe',
          scope: ['managers'],
          default_selection: true,
        },
      ];

      const result = getConvertedApproverFields(mockApprovers);

      expect(result).toEqual([
        {
          name: 'Jane Doe',
          code: 'jane_doe',
          required: false,
          hint: 'Jane Doe',
          type: 'code_name_spinner',
          code_name_spinner_options: [{ code: 'none', name: 'Select' }, {}],
          disabled: true,
        },
      ]);
    });

    it('should return correctly formatted fields for multiple approvers with different scopes', () => {
      const mockApprovers = [
        {
          name: 'John Doe',
          code: 'john_doe',
          scope: ['managers'],
          default_selection: false,
        },
        {
          name: 'Jane Doe',
          code: 'jane_doe',
          scope: ['peers'],
          default_selection: true,
        },
      ];

      const result = getConvertedApproverFields(mockApprovers);

      expect(result).toEqual([
        {
          name: 'John Doe',
          code: 'john_doe',
          required: false,
          hint: 'John Doe',
          type: 'code_name_spinner',
          code_name_spinner_options: [{ code: 'none', name: 'Select' }, {}],
          disabled: false,
        },
        {
          name: 'Jane Doe',
          code: 'jane_doe',
          required: false,
          hint: 'Jane Doe',
          type: 'code_name_spinner',
          code_name_spinner_options: [{ code: 'none', name: 'Select' }, {}],
          disabled: true,
        },
      ]);
    });

    it('should return correctly formatted fields when scope is undefined or null', () => {
      const mockApprovers = [
        {
          name: 'Undefined Scope',
          code: 'undefined_scope',
          scope: undefined,
          default_selection: false,
        },
      ];

      const result = getConvertedApproverFields(mockApprovers);

      expect(result).toEqual([
        {
          name: 'Undefined Scope',
          code: 'undefined_scope',
          required: false,
          hint: 'Undefined Scope',
          type: 'code_name_spinner',
          code_name_spinner_options: [{ code: 'none', name: 'Select' }],
          disabled: false,
        },
      ]);
    });
  });
});
