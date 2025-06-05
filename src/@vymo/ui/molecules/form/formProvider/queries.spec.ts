import {
  Config,
  FormFieldState,
  FormProps,
  FormVersion,
  InputFieldConfig,
} from '../types';
import {
  getConfigFieldsByGroup,
  getDuplicateKeys,
  getFieldsSyncWithUpdatedConfigData,
  getFlattenConfig,
  getFormFieldFromValue,
  getUpdatedConfigAndFieldsAppendAtCode,
  getUpdatedConfigAndFieldsDeleteAtCode,
  mapConfigData,
} from './queries';
import { FormSliceState } from './types';

describe('src/@vymo/ui/molecules/form/formProvider/queries.ts', () => {
  describe('getFormFieldFromValue', () => {
    it('should create form fields with default values for string, number, and boolean types', () => {
      const formValue: FormProps['value'] = {
        firstName: { value: 'John', code: 'firstName' },
        age: { value: 30, code: 'age' },
        isActive: { value: true, code: 'isActive' },
      };

      const result = Object.entries(formValue).reduce((acc, [code, value]) => {
        acc[code] = getFormFieldFromValue(value);
        return acc;
      }, {});

      expect(result).toEqual({
        firstName: {
          code: 'firstName',
          value: 'John',
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
        age: {
          code: 'age',
          value: 30,
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
        isActive: {
          code: 'isActive',
          value: true,
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
      });
    });

    it('should handle an empty formValue object', () => {
      const formValue: FormProps['value'] = {};

      const result = Object.entries(formValue).reduce((acc, [code, value]) => {
        acc[code] = getFormFieldFromValue(value);
        return acc;
      }, {});
      expect(result).toEqual({});
    });

    it('should handle different types and values correctly', () => {
      const formValue: FormProps['value'] = {
        name: { value: 'Alice', code: 'name' },
        age: { value: 25, code: 'age' },
        hasChildren: { value: false, code: 'hasChildren' },
        score: { value: 85.5, code: 'score' },
      };

      const result = Object.entries(formValue).reduce((acc, [code, value]) => {
        acc[code] = getFormFieldFromValue(value);
        return acc;
      }, {});
      expect(result).toEqual({
        name: {
          code: 'name',
          value: 'Alice',
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
        age: {
          code: 'age',
          value: 25,
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
        hasChildren: {
          code: 'hasChildren',
          value: false,
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
        score: {
          code: 'score',
          value: 85.5,
          isValid: true,
          errors: [],
          touched: false,
          additionalData: null,
          lastUpdated: undefined,
        },
      });
    });
  });

  describe('getFieldsSyncWithUpdatedConfigData', () => {
    const fields: FormSliceState['formData']['fields'] = {
      firstName: {
        code: 'firstName',
        value: '',
        additionalData: null,
        isValid: true,
        errors: [],
        touched: false,
      },
      age: {
        code: 'age',
        value: 0,
        additionalData: null,
        isValid: true,
        errors: [],
        touched: false,
      },
    };

    const configData: Config['data'] = [
      {
        code: 'firstName',
        placeholder: 'First Name',
        type: 'text',
        required: true,
        read_only: false,
        hint: 'Enter your first name',
        oifOptions: null,
        configMapOptions: null,
      },
      {
        code: 'lastName',
        placeholder: 'Last Name',
        type: 'text',
        required: true,
        read_only: false,
        hint: 'Enter your last name',
        oifOptions: null,
        configMapOptions: null,
      },
    ];

    it('should update fields with matching configData codes', () => {
      const result = getFieldsSyncWithUpdatedConfigData(fields, configData);

      expect(result).toEqual({
        firstName: {
          additionalData: null,
          code: 'firstName',
          errors: [],
          isValid: true,
          lastUpdated: undefined,
          touched: false,
          value: '',
        }, // Should be unchanged
        lastName: {
          additionalData: null,
          code: 'lastName',
          errors: [],
          isValid: true,
          lastUpdated: undefined,
          touched: false,
          value: undefined,
        }, // Should be added
      });
      expect(result.lastName).toEqual({
        additionalData: null,
        code: 'lastName',
        errors: [],
        isValid: true,
        lastUpdated: undefined,
        touched: false,
        value: undefined,
      });
    });

    it('should handle no matching fields', () => {
      const result = getFieldsSyncWithUpdatedConfigData(fields, []);
      expect(result).toEqual({});
    });

    it('should handle partial matching fields', () => {
      const partialConfigData: Config['data'] = [
        {
          code: 'age',
          placeholder: 'Age',
          type: 'number',
          required: false,
          read_only: false,
          hint: 'Enter your age',
          oifOptions: null,
          configMapOptions: null,
        },
      ];

      const result = getFieldsSyncWithUpdatedConfigData(
        fields,
        partialConfigData,
      );
      expect(result).toEqual({
        age: {
          additionalData: null,
          code: 'age',
          errors: [],
          isValid: true,
          lastUpdated: undefined,
          touched: false,
          value: 0,
        },
      });
    });

    it('should handle empty input', () => {
      const result = getFieldsSyncWithUpdatedConfigData({}, configData);
      expect(result).toEqual({
        firstName: {
          additionalData: null,
          code: 'firstName',
          errors: [],
          isValid: true,
          lastUpdated: undefined,
          touched: false,
          value: undefined,
        },
        lastName: {
          additionalData: null,
          code: 'lastName',
          errors: [],
          isValid: true,
          lastUpdated: undefined,
          touched: false,
          value: undefined,
        },
      });
    });
  });

  describe('getFlattenConfig', () => {
    const simpleData: InputFieldConfig[] = [
      {
        code: 'field1',
        placeholder: 'Field 1',
        childrenDisplayType: 'nested',
        children: [],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
      {
        code: 'field2',
        placeholder: 'Field 2',
        childrenDisplayType: 'nested',
        children: [],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
    ];

    const nestedData: InputFieldConfig[] = [
      {
        code: 'parent1',
        placeholder: 'Parent 1',
        childrenDisplayType: 'nested',
        children: [
          {
            code: 'child1',
            placeholder: 'Child 1',
            childrenDisplayType: 'nested',
            children: [],
            type: '',
            hint: '',
            required: false,
            read_only: false,
          },
          {
            code: 'child2',
            placeholder: 'Child 2',
            childrenDisplayType: 'nested',
            children: [],
            type: '',
            hint: '',
            required: false,
            read_only: false,
          },
        ],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
      {
        code: 'field3',
        placeholder: 'Field 3',
        childrenDisplayType: 'nested',
        children: [],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
    ];

    const flattenChildrenData: InputFieldConfig[] = [
      {
        code: 'parent2',
        placeholder: 'Parent 2',
        childrenDisplayType: 'flatten',
        children: [
          {
            code: 'nestedChild1',
            placeholder: 'Nested Child 1',
            childrenDisplayType: 'nested',
            children: [],
            type: '',
            hint: '',
            required: false,
            read_only: false,
          },
          {
            code: 'nestedChild2',
            placeholder: 'Nested Child 2',
            childrenDisplayType: 'nested',
            children: [],
            type: '',
            hint: '',
            required: false,
            read_only: false,
          },
        ],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
      {
        code: 'field4',
        placeholder: 'Field 4',
        childrenDisplayType: 'nested',
        children: [],
        type: '',
        hint: '',
        required: false,
        read_only: false,
      },
    ];

    it('should flatten simple configurations', () => {
      const result = getFlattenConfig(simpleData);
      expect(result).toEqual(simpleData);
    });

    it('should flatten nested configurations', () => {
      const expectedFlattenedData: InputFieldConfig[] = [
        {
          children: [
            {
              children: [],
              childrenDisplayType: 'nested',
              code: 'child1',
              hint: '',
              placeholder: 'Child 1',
              read_only: false,
              required: false,
              type: '',
            },
            {
              children: [],
              childrenDisplayType: 'nested',
              code: 'child2',
              hint: '',
              placeholder: 'Child 2',
              read_only: false,
              required: false,
              type: '',
            },
          ],
          childrenDisplayType: 'nested',
          code: 'parent1',
          hint: '',
          placeholder: 'Parent 1',
          read_only: false,
          required: false,
          type: '',
        },
        {
          children: [],
          childrenDisplayType: 'nested',
          code: 'field3',
          hint: '',
          placeholder: 'Field 3',
          read_only: false,
          required: false,
          type: '',
        },
      ];

      const result = getFlattenConfig(nestedData);
      expect(result).toEqual(expectedFlattenedData);
    });

    it('should handle empty input', () => {
      const result = getFlattenConfig(undefined);
      expect(result).toEqual([]);
    });

    it('should flatten children when childrenDisplayType is flatten', () => {
      const expectedFlattenedData: InputFieldConfig[] = [
        {
          childrenDisplayType: 'flatten',
          code: 'parent2',
          hint: '',
          placeholder: 'Parent 2',
          read_only: false,
          required: false,
          type: '',
        },
        {
          children: [],
          childrenDisplayType: 'nested',
          code: 'nestedChild1',
          hint: '',
          placeholder: 'Nested Child 1',
          read_only: false,
          required: false,
          type: '',
        },
        {
          children: [],
          childrenDisplayType: 'nested',
          code: 'nestedChild2',
          hint: '',
          placeholder: 'Nested Child 2',
          read_only: false,
          required: false,
          type: '',
        },
        {
          children: [],
          childrenDisplayType: 'nested',
          code: 'field4',
          hint: '',
          placeholder: 'Field 4',
          read_only: false,
          required: false,
          type: '',
        },
      ];

      const result = getFlattenConfig(flattenChildrenData);
      expect(result).toEqual(expectedFlattenedData);
    });
  });

  describe('getConfigFieldsByGroup', () => {
    const config: Config = {
      version: FormVersion.web,
      data: [
        {
          placeholder: 'Field 1',
          type: 'text',
          code: 'field1',
          hint: 'Hint for Field 1',
          required: true,
          read_only: false,
        },
        {
          placeholder: 'Field 2',
          type: 'number',
          code: 'field2',
          hint: 'Hint for Field 2',
          required: false,
          read_only: true,
        },
      ],
      grouping: [
        {
          fields: ['field1', 'field2'],
          code: 'group1',
          name: 'Group 1',
        },
      ],
    };

    it('should return grouped fields when grouping is defined and remaining should be part of Other group', () => {
      const result = getConfigFieldsByGroup(config);
      expect(result).toHaveLength(2);
      expect(result[0].code).toBe('group1');
      expect(result[0].fields).toHaveLength(2);
    });

    it('should return default group when grouping is empty', () => {
      const configWithoutGrouping: Config = {
        version: FormVersion.web,
        data: [
          {
            placeholder: 'Field 1',
            type: 'text',
            code: 'field1',
            hint: 'Hint for Field 1',
            required: true,
            read_only: false,
          },
          {
            placeholder: 'Field 2',
            type: 'number',
            code: 'field2',
            hint: 'Hint for Field 2',
            required: false,
            read_only: true,
          },
        ],
        grouping: [],
      };

      const result = getConfigFieldsByGroup(configWithoutGrouping);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('default');
      expect(result[0].fields).toHaveLength(2);
    });
  });

  describe('getUpdatedConfigAndFieldsAppendAtCode', () => {
    const configData: InputFieldConfig[] = [
      {
        placeholder: 'Field 1',
        type: 'text',
        code: 'field1',
        hint: 'Hint for Field 1',
        required: true,
        read_only: false,
        childrenDisplayType: 'nested',
        children: [
          {
            placeholder: 'Subfield 1',
            type: 'number',
            code: 'subfield1',
            hint: 'Hint for Subfield 1',
            required: false,
            read_only: true,
          },
        ],
      },
      {
        placeholder: 'Field 2',
        type: 'checkbox',
        code: 'field2',
        hint: 'Hint for Field 2',
        required: false,
        read_only: false,
      },
    ];

    const fields: Record<string, FormFieldState> = {
      field1: {
        code: 'field1',
        value: '',
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
      subfield1: {
        code: 'subfield1',
        value: '',
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
      field2: {
        code: 'field2',
        value: false,
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
    };

    const appendedConfigData: InputFieldConfig[] = [
      {
        placeholder: 'New Subfield',
        type: 'text',
        code: 'newSubfield',
        hint: 'Hint for New Subfield',
        required: true,
        read_only: false,
      },
    ];

    it('should append fields at top-level when insertAtCode is found', () => {
      const insertAtCode = 'field2';
      const isFormInitialized = true;
      const actionType = 'insert';
      const childrenDisplayType: InputFieldConfig['childrenDisplayType'] =
        'flatten';

      const result = getUpdatedConfigAndFieldsAppendAtCode(
        configData,
        fields,
        appendedConfigData,
        insertAtCode,
        isFormInitialized,
        actionType,
        childrenDisplayType,
      );

      expect(result.updatedConfigData).toHaveLength(2);
      expect(result.updatedConfigData[1].children).toEqual([
        {
          code: 'newSubfield',
          hint: 'Hint for New Subfield',
          placeholder: 'New Subfield',
          read_only: false,
          required: true,
          type: 'text',
        },
      ]);
    });

    it('should update existing children when actionType is updateAtCode', () => {
      const insertAtCode = 'field1';
      const isFormInitialized = true;
      const actionType = 'updateAtCode';
      const childrenDisplayType: InputFieldConfig['childrenDisplayType'] =
        'nested';

      const result = getUpdatedConfigAndFieldsAppendAtCode(
        configData,
        fields,
        appendedConfigData,
        insertAtCode,
        isFormInitialized,
        actionType,
        childrenDisplayType,
      );

      expect(result.updatedConfigData).toHaveLength(2);
      expect(result.updatedConfigData[0].children).toHaveLength(2);
      expect(result.updatedConfigData[0].children?.[1]?.code).toBe(
        'newSubfield',
      );
    });

    it('should log error if insertAtCode is not found in configData', () => {
      const insertAtCode = 'nonExistingCode';
      const isFormInitialized = true;
      const actionType = 'insert';
      const childrenDisplayType: InputFieldConfig['childrenDisplayType'] =
        'flatten';

      // mock console log
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});

      const result = getUpdatedConfigAndFieldsAppendAtCode(
        configData,
        fields,
        appendedConfigData,
        insertAtCode,
        isFormInitialized,
        actionType,
        childrenDisplayType,
      );

      expect(result.updatedConfigData).toHaveLength(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cannot find the nonExistingCode code in form to which fields need to be inserted',
        [
          {
            children: [
              {
                code: 'subfield1',
                hint: 'Hint for Subfield 1',
                placeholder: 'Subfield 1',
                read_only: true,
                required: false,
                type: 'number',
              },
            ],
            childrenDisplayType: 'nested',
            code: 'field1',
            hint: 'Hint for Field 1',
            placeholder: 'Field 1',
            read_only: false,
            required: true,
            type: 'text',
          },
          {
            code: 'field2',
            hint: 'Hint for Field 2',
            placeholder: 'Field 2',
            read_only: false,
            required: false,
            type: 'checkbox',
          },
        ],
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getUpdatedConfigAndFieldsDeleteAtCode', () => {
    const configData: InputFieldConfig[] = [
      {
        placeholder: 'Field 1',
        type: 'text',
        code: 'field1',
        hint: 'Hint for Field 1',
        required: true,
        read_only: false,
        childrenDisplayType: 'nested',
        children: [
          {
            placeholder: 'Subfield 1',
            type: 'number',
            code: 'subfield1',
            hint: 'Hint for Subfield 1',
            required: false,
            read_only: true,
          },
        ],
      },
      {
        placeholder: 'Field 2',
        type: 'checkbox',
        code: 'field2',
        hint: 'Hint for Field 2',
        required: false,
        read_only: false,
      },
    ];

    const fields: Record<string, FormFieldState> = {
      field1: {
        code: 'field1',
        value: '',
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
      subfield1: {
        code: 'subfield1',
        value: '',
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
      field2: {
        code: 'field2',
        value: false,
        additionalData: {},
        isValid: true,
        errors: [],
        touched: false,
      },
    };

    it('should delete field when deleteAtCode is found at top level', () => {
      const deleteAtCode = 'field1';
      const isFormInitialized = true;

      const result = getUpdatedConfigAndFieldsDeleteAtCode(
        configData,
        fields,
        deleteAtCode,
        isFormInitialized,
      );

      expect(result.updatedConfigData).toHaveLength(1);
      expect(result.updatedFieldsData).toEqual({
        field1: {
          additionalData: {},
          code: 'field1',
          errors: [],
          isValid: true,
          touched: false,
          value: '',
        },
        field2: {
          additionalData: {},
          code: 'field2',
          errors: [],
          isValid: true,
          touched: false,
          value: false,
        },
      });
      expect(result.deleted).toBe(true);
    });

    it('should delete field when deleteAtCode is found in nested children', () => {
      const deleteAtCode = 'subfield1';
      const isFormInitialized = true;

      const result = getUpdatedConfigAndFieldsDeleteAtCode(
        configData,
        fields,
        deleteAtCode,
        isFormInitialized,
      );

      expect(result.updatedConfigData[0].children).toHaveLength(0);
      expect(result.deleted).toBe(true);
    });

    it('should log error if deleteAtCode is not found in configData', () => {
      const deleteAtCode = 'nonExistingCode';
      const isFormInitialized = true;

      // mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});

      const result = getUpdatedConfigAndFieldsDeleteAtCode(
        configData,
        fields,
        deleteAtCode,
        isFormInitialized,
      );

      expect(result.updatedConfigData).toHaveLength(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cannot find the code in form to which fields need to be deleted',
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDuplicateKeys', () => {
    const configData: InputFieldConfig[] = [
      {
        placeholder: 'Field 1',
        code: 'field1',
        type: 'text',
        hint: 'Hint for Field 1',
        required: true,
        read_only: false,
      },
      {
        placeholder: 'Field 2',
        code: 'field2',
        type: 'checkbox',
        hint: 'Hint for Field 2',
        required: false,
        read_only: false,
      },
      {
        placeholder: 'Field 3',
        code: 'field3',
        type: 'number',
        hint: 'Hint for Field 3',
        required: true,
        read_only: true,
      },
      {
        placeholder: 'Field 4',
        code: 'field1',
        type: 'textarea',
        hint: 'Hint for Field 4',
        required: false,
        read_only: true,
      }, // Duplicate code 'field1'
    ];

    it('should identify duplicate keys based on code property', () => {
      const result = getDuplicateKeys(configData, 'code');

      expect(result.hasDuplicates).toBe(true);
      expect(result.duplicateKeys).toEqual(['field1']);
    });

    it('should handle no duplicates', () => {
      const noDuplicateConfigData: InputFieldConfig[] = [
        {
          placeholder: 'Field 1',
          code: 'field1',
          type: 'text',
          hint: 'Hint for Field 1',
          required: true,
          read_only: false,
        },
        {
          placeholder: 'Field 2',
          code: 'field2',
          type: 'checkbox',
          hint: 'Hint for Field 2',
          required: false,
          read_only: false,
        },
        {
          placeholder: 'Field 3',
          code: 'field3',
          type: 'number',
          hint: 'Hint for Field 3',
          required: true,
          read_only: true,
        },
      ];

      const result = getDuplicateKeys(noDuplicateConfigData, 'code');

      expect(result.hasDuplicates).toBe(false);
      expect(result.duplicateKeys).toEqual([]);
    });

    it('should handle empty configData', () => {
      const emptyConfigData: InputFieldConfig[] = [];
      const result = getDuplicateKeys(emptyConfigData, 'code');

      expect(result.hasDuplicates).toBe(false);
      expect(result.duplicateKeys).toEqual([]);
    });
  });

  describe('mapConfigData', () => {
    it('should map config data with no children', () => {
      const configData = [
        { code: 'field1', placeholder: 'Field 1', children: null },
        { code: 'field2', placeholder: 'Field 2', children: null },
      ];

      const mapFn = (inputField: InputFieldConfig) => ({
        ...inputField,
        mapped: true,
      });
      const result = mapConfigData(configData as any, mapFn);

      expect(result).toEqual([
        { code: 'field1', placeholder: 'Field 1', mapped: true, children: [] },
        { code: 'field2', placeholder: 'Field 2', mapped: true, children: [] },
      ]);
    });

    it('should map config data with children', () => {
      const configData = [
        {
          code: 'field1',
          placeholder: 'Field 1',
          children: [
            { code: 'child1', placeholder: 'Child 1' },
            { code: 'child2', placeholder: 'Child 2' },
          ],
        },
      ];

      const mapFn = (inputField: InputFieldConfig) => ({
        ...inputField,
        mapped: true,
      });
      const result = mapConfigData(configData as any, mapFn);

      expect(result).toEqual([
        {
          code: 'field1',
          placeholder: 'Field 1',
          children: [
            {
              code: 'child1',
              placeholder: 'Child 1',
              mapped: true,
              children: [],
            },
            {
              code: 'child2',
              placeholder: 'Child 2',
              mapped: true,
              children: [],
            },
            // eslint-disable-next-line max-lines
          ],
          mapped: true,
        },
      ]);
    });

    it('should map config data with nested children', () => {
      const configData = [
        {
          code: 'field1',
          // eslint-disable-next-line max-lines
          placeholder: 'Field 1',
          children: [
            {
              code: 'child1',
              placeholder: 'Child 1',
              children: [
                { code: 'grandchild1', placeholder: 'Grandchild 1' },
                { code: 'grandchild2', placeholder: 'Grandchild 2' },
              ],
            },
            { code: 'child2', placeholder: 'Child 2' },
          ],
        },
      ];

      const mapFn = (inputField: InputFieldConfig) => ({
        ...inputField,
        mapped: true,
      });
      const result = mapConfigData(configData as any, mapFn);

      expect(result).toEqual([
        {
          code: 'field1',
          placeholder: 'Field 1',
          children: [
            {
              code: 'child1',
              placeholder: 'Child 1',
              children: [
                {
                  children: [],
                  code: 'grandchild1',
                  placeholder: 'Grandchild 1',
                  mapped: true,
                },
                {
                  children: [],
                  code: 'grandchild2',
                  placeholder: 'Grandchild 2',
                  mapped: true,
                },
              ],
              mapped: true,
            },
            {
              code: 'child2',
              placeholder: 'Child 2',
              mapped: true,
              children: [],
            },
          ],
          mapped: true,
        },
      ]);
    });

    it('should return empty array when config data is empty', () => {
      const configData: InputFieldConfig[] = [];
      const mapFn = (inputField: InputFieldConfig) => ({
        ...inputField,
        mapped: true,
      });
      const result = mapConfigData(configData, mapFn);
      expect(result).toEqual([]);
    });

    it('should return empty array when config data is null', () => {
      const configData: InputFieldConfig[] | null = null;
      const mapFn = (inputField: InputFieldConfig) => ({
        ...inputField,
        mapped: true,
      });
      const result = mapConfigData(configData as any, mapFn);
      expect(result).toEqual([]);
    });
  });
});
