import { REGEX_DECIMAL } from 'src/@vymo/ui/molecules/currencyAndDecimal/constant';
import { DEFAULT_I18N_CONFIG } from '../constants';
import { REGEX_AADHAR, REGEX_EMAIL, REGEX_PAN } from './constant';
import {
  getAdditionalDataByType,
  getDurationValue,
  getFieldOptions,
  getMetaValue,
  getMinMaxValidations,
  getPhoneValidation,
  getValidationByTypeAndFieldRegex,
  isDropdownType,
  isOptionValid,
  toCamelCaseKeys,
} from './queries';

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  describe('isDropdowntype', () => {
    it('should return true for valid types', () => {
      const validTypes = [
        'sifg',
        'dropdown',
        'code_name_spinner',
        'saved-list-sifg',
        'static-sifg',
      ];
      validTypes.forEach((type) => {
        expect(isDropdownType(type)).toBe(true);
      });
    });

    it('should return false for invalid types', () => {
      const invalidTypes = [
        'text',
        'number',
        'radio',
        'checkbox',
        'custom-type',
      ];
      invalidTypes.forEach((type) => {
        expect(isDropdownType(type)).toBe(false);
      });
    });

    it('should return false for undefine or null', () => {
      expect(isDropdownType(undefined)).toBe(false);
      expect(isDropdownType(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isDropdownType('')).toBe(false);
    });
  });

  describe('toCamelCaseKeys', () => {
    it('should convert keys in an array of objects to camelCase', () => {
      const input = [
        { first_name: 'John', last_name: 'Doe' },
        { first_name: 'Jane', last_name: 'Doe' },
      ];

      const expectedOutput = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Doe' },
      ];

      expect(toCamelCaseKeys(input)).toEqual(expectedOutput);
    });

    it('should convert keys of an object to camelCase', () => {
      const input = { first_name: 'John', last_name: 'Doe' };
      const expectedOutput = { firstName: 'John', lastName: 'Doe' };

      expect(toCamelCaseKeys(input)).toEqual(expectedOutput);
    });

    it('should not convert the empty object or array to camelCase', () => {
      expect(toCamelCaseKeys([])).toEqual([]);
      expect(toCamelCaseKeys({})).toEqual({});
    });

    it('should not convert non-object or non-array to camelCase', () => {
      expect(toCamelCaseKeys('hello')).toEqual('hello');
    });
  });

  describe('getFieldOptions', () => {
    it('should return mapped option when type is spinner', () => {
      const input = [
        { code: '001', name: 'option1' },
        { code: '002', name: 'option2' },
      ];
      const type = 'spinner';
      const expectedOutput = [
        {
          code: { code: '001', name: 'option1' },
          name: { code: '001', name: 'option1' },
        },
        {
          code: { code: '002', name: 'option2' },
          name: { code: '002', name: 'option2' },
        },
      ];

      expect(getFieldOptions(input, type)).toEqual(expectedOutput);
    });

    it('should not return mapped option when type is not spinner', () => {
      const input = [
        { code: '001', name: 'option1' },
        { code: '002', name: 'option2' },
      ];
      const type = 'not-spinner';
      const expectedOutput = [
        { code: '001', name: 'option1' },
        { code: '002', name: 'option2' },
      ];
      expect(getFieldOptions(input, type)).toEqual(expectedOutput);
    });

    it('should return empty array when options is not there and type is spinner', () => {
      const input = [];
      const type = 'spinner';
      const expectedOutput = [];

      expect(getFieldOptions(input, type)).toEqual(expectedOutput);
    });

    it('should return empty array when options is not there and type is not spinner', () => {
      const input = [];
      const type = 'not-spinner';
      const expectedOutput = [];

      expect(getFieldOptions(input, type)).toEqual(expectedOutput);
    });

    it('should return empty array when options is not there and type is undefined', () => {
      const input = [
        { code: '001', name: 'option1' },
        { code: '002', name: 'option2' },
      ];
      const type = undefined;
      const expectedOutput = [
        { code: '001', name: 'option1' },
        { code: '002', name: 'option2' },
      ];

      expect(getFieldOptions(input, type)).toEqual(expectedOutput);
    });

    describe('getMetaValue', () => {
      it('should return the value of the first key found in config and delete the key', () => {
        const config = { key1: 'value1', key2: 'value2', key3: 'value3' };
        const oldKeys = ['key1', 'key2'];

        const result = getMetaValue(oldKeys, config);

        expect(result).toBe('value1');
        expect(config).not.toHaveProperty('key1');
      });

      it('should return the value of the second key if the first key is not found', () => {
        const config = { key2: 'value2', key3: 'value3' };
        const oldKeys = ['key1', 'key2'];

        const result = getMetaValue(oldKeys, config);

        expect(result).toBe('value2');
        expect(config).not.toHaveProperty('key2');
      });

      it('should return null if none of the keys are found', () => {
        const config = { key3: 'value3' };
        const oldKeys = ['key1', 'key2'];

        const result = getMetaValue(oldKeys, config);

        expect(result).toBeNull();
        expect(config).toHaveProperty('key3', 'value3');
      });

      it('should return the object if the found value is an object', () => {
        const config = {
          key1: { nestedObject: 'nestedValue' },
          key2: 'value2',
        };
        const oldKeys = ['key1', 'key2'];

        const result = getMetaValue(oldKeys, config);

        expect(result).toStrictEqual({ nestedObject: 'nestedValue' });
        expect(config).not.toHaveProperty('key1');
      });

      it('should return null if oldKeys is an empty array', () => {
        const config = { key1: 'value1', key2: 'value2' };
        const oldKeys = [];

        const result = getMetaValue(oldKeys, config);

        expect(result).toBeNull();
        expect(config).toHaveProperty('key1', 'value1');
        expect(config).toHaveProperty('key2', 'value2');
      });

      it('should return null if config is empty', () => {
        const config = {};
        const oldKeys = ['key1', 'key2'];
        const result = getMetaValue(oldKeys, config);
        expect(result).toBeNull();
        expect(config).toStrictEqual({});
      });

      it('should return null if config is null', () => {
        const config = null;
        const oldKeys = ['key1', 'key2'];
        const result = getMetaValue(oldKeys, config);
        expect(result).toBeNull();
      });
    });

    describe('getDurantionValue', () => {
      it('should filterout all nan and return an array when the code is an integer when type is meeting', () => {
        const options = [
          { code: '30', name: 'Half Hour' },
          { code: '60', name: 'One Hour' },
          { code: 'abc', name: 'Invalid Duration' },
        ];
        const type = 'meeting';
        const expectedOutput = [30, 60];
        expect(getDurationValue(options, type)).toEqual(expectedOutput);
      });

      it('should and return undefined when type is not meeting', () => {
        const options = [
          { code: '30', name: 'Half Hour' },
          { code: '60', name: 'One Hour' },
          { code: 'abc', name: 'Invalid Duration' },
        ];
        const type = 'not-meeting';
        expect(getDurationValue(options, type)).toBe(undefined);
      });

      it('should and return [] when type is meeting and options are empty', () => {
        const options = [];
        const type = 'meeting';
        expect(getDurationValue(options, type)).toEqual([]);
      });

      it('should and return undefined when type is not meeting and options are empty', () => {
        const options = [];
        const type = 'non-meeting';
        expect(getDurationValue(options, type)).toBe(undefined);
      });

      it('should filterout all nan and return an empty array when type is meeting', () => {
        const options = [
          { code: 'abc', name: 'nan' },
          { code: 'xyz', name: 'nan' },
          { code: 'pwc', name: 'Invalid Duration' },
        ];
        const type = 'meeting';
        const expectedOutput = [];
        expect(getDurationValue(options, type)).toEqual(expectedOutput);
      });

      it('should return undefined when type is undefined', () => {
        const options = [
          { code: '30', name: '30min' },
          { code: '60', name: '60min' },
          { code: 'def', name: 'Invalid Duration' },
        ];
        const type = undefined;
        expect(getDurationValue(options, type)).toEqual(undefined);
      });

      it('should return undefined when type is an empty string', () => {
        const options = [
          { code: 'abc', name: 'nan' },
          { code: 'xyz', name: 'nan' },
          { code: 'def', name: 'Invalid Duration' },
        ];
        const type = '';
        expect(getDurationValue(options, type)).toEqual(undefined);
      });
    });

    describe('getMinMaxValidations', () => {
      it('should return an error message array when type is date', () => {
        const expectedOutput = [
          {
            errorMessage: 'date must be at least 5 digits long',
            regex: /^.{5,}$/,
          },
          {
            errorMessage: 'date must be at most 10 digits long',
            regex: /^.{0,10}$/,
          },
        ];
        expect(getMinMaxValidations('date', 5, 10)).toEqual(expectedOutput);
      });

      it('should return an error message when type is time', () => {
        const expectedOutput = [
          {
            errorMessage: 'time must be at least 5 digits long',
            regex: /^.{5,}$/,
          },
          {
            errorMessage: 'time must be at most 10 digits long',
            regex: /^.{0,10}$/,
          },
        ];
        expect(getMinMaxValidations('time', 5, 10)).toEqual(expectedOutput);
      });

      it('should return an error message when type is meeting', () => {
        const expectedOutput = [
          {
            errorMessage: 'meeting must be at least 5 digits long',
            regex: /^.{5,}$/,
          },
          {
            errorMessage: 'meeting must be at most 10 digits long',
            regex: /^.{0,10}$/,
          },
        ];
        expect(getMinMaxValidations('meeting', 5, 10)).toEqual(expectedOutput);
      });

      it('should return an array of object when type is not date , time , meeting', () => {
        const expectedOutput = [
          {
            errorMessage: 'text must be at least 5 digits long',
            regex: /^.{5,}$/,
          },
          {
            errorMessage: 'text must be at most 10 digits long',
            regex: /^.{0,10}$/,
          },
        ];
        expect(getMinMaxValidations('text', 5, 10)).toEqual(expectedOutput);
      });

      it('should return an array of object of length 1 when type is not date , time , meeting and only max is undefined', () => {
        const expectedOutput = [
          {
            errorMessage: 'text must be at least 5 digits long',
            regex: /^.{5,}$/,
          },
        ];
        expect(getMinMaxValidations('text', 5, undefined)).toEqual(
          expectedOutput,
        );
      });

      it('should return an array of object of length 1 when type is not date , time , meeting and only min is undefined', () => {
        const expectedOutput = [
          {
            errorMessage: 'text must be at most 10 digits long',
            regex: /^.{0,10}$/,
          },
        ];
        expect(getMinMaxValidations('text', undefined, 10)).toEqual(
          expectedOutput,
        );
      });

      it('should return an empty array when type is not date , time , meeting and max and min is undefined', () => {
        const expectedOutput = [];
        expect(getMinMaxValidations('text', undefined, undefined)).toEqual(
          expectedOutput,
        );
      });
    });

    describe('getValidationByTypeAndFieldRegex', () => {
      it('should return a custom regex validation when regex and regexHint are provided', () => {
        const result = getValidationByTypeAndFieldRegex(
          'text',
          'text',
          '^[a-zA-Z]+$',
          'Field should only contain alphabets',
          undefined,
          undefined,
          {},
        );
        expect(result).toEqual([
          {
            regex: /^[a-zA-Z]+$/,
            errorMessage: 'Field should only contain alphabets',
          },
        ]);
      });

      it('should return email validation when type is "email"', () => {
        const result = getValidationByTypeAndFieldRegex(
          'email',
          'email',
          undefined,
          undefined,
          undefined,
          undefined,
          {},
        );
        expect(result).toEqual([
          {
            regex: REGEX_EMAIL,
            errorMessage: 'email is not valid',
          },
        ]);
      });

      it('should return min, max, and email validations when type is "email" and min/max are provided', () => {
        const result = getValidationByTypeAndFieldRegex(
          'email',
          'email',
          undefined,
          undefined,
          5,
          10,
          {},
        );
        expect(result).toEqual([
          {
            regex: REGEX_EMAIL,
            errorMessage: 'email is not valid',
          },
          {
            regex: /^.{5,}$/,
            errorMessage: 'email must be at least 5 digits long',
          },
          {
            regex: /^.{0,10}$/,
            errorMessage: 'email must be at most 10 digits long',
          },
        ]);
      });

      it('should return validation for type "pan"', () => {
        const result = getValidationByTypeAndFieldRegex(
          'pan',
          'pan',
          undefined,
          undefined,
          undefined,
          undefined,
          {},
        );
        expect(result).toEqual([
          {
            regex: REGEX_PAN,
            errorMessage: 'pan is not valid',
          },
        ]);
      });

      it('should return all validations including custom regex, min, max, and type-specific', () => {
        const result = getValidationByTypeAndFieldRegex(
          'decimal',
          'decimal',
          '^[a-z]+$',
          'Must be lowercase letters only',
          5,
          10,
          {},
        );
        expect(result).toEqual([
          {
            regex: REGEX_DECIMAL,
            errorMessage: 'decimal is not a valid decimal number',
          },
          {
            regex: /^.{5,}$/,
            errorMessage: 'decimal must be at least 5 digits long',
          },
          {
            regex: /^.{0,10}$/,
            errorMessage: 'decimal must be at most 10 digits long',
          },
          {
            regex: /^[a-z]+$/,
            errorMessage: 'Must be lowercase letters only',
          },
        ]);
      });

      it('should return all validations including custom regex, min, max, and type-specific is aadhar', () => {
        const result = getValidationByTypeAndFieldRegex(
          'aadhar',
          'aadhar',
          undefined,
          undefined,
          undefined,
          undefined,
          {},
        );
        expect(result).toEqual([
          {
            regex: REGEX_AADHAR,
            errorMessage: 'aadhar is not valid',
          },
        ]);
      });
      it('should return no validations when additionalPhoneProps are present and type is phone', () => {
        const result = getValidationByTypeAndFieldRegex(
          'phone',
          'phone',
          undefined,
          undefined,
          undefined,
          undefined,
          { countryCodes: ['IN', 'AU', 'US'], enableCountryCodeV2: true },
        );
        expect(result).toEqual([]);
      });
    });
  });
});

describe('getPhoneValidation', () => {
  it('should return empty validation array when additionalData is there', () => {
    const result = getPhoneValidation(
      { countryCodes: ['IN', 'AU', 'US'], enableCountryCodeV2: true },
      'phone',
      10,
      10,
    );
    expect(result).toEqual([]);
  });

  it('should return min max validation when additionalData is not there', () => {
    const expectedOutput = [
      {
        errorMessage: 'phone must be at least 10 digits long',
        regex: /^.{10,}$/,
      },
      {
        errorMessage: 'phone must be at most 10 digits long',
        regex: /^.{0,10}$/,
      },
    ];
    const result = getPhoneValidation({}, 'phone', 10, 10);
    expect(result).toEqual(expectedOutput);
  });
});

describe('configMappingFormItemsGenerator Queries', () => {
  describe('isOptionValid', () => {
    it('should return false for invalid options', () => {
      expect(isOptionValid({ code: 'none', name: 'Select' })).toBe(false);
      expect(isOptionValid({ code: '', name: 'Select' })).toBe(false);
      expect(isOptionValid({ code: 'select', name: 'Select' })).toBe(false);
      expect(isOptionValid({ code: 'none', name: 'select' })).toBe(false);
      expect(isOptionValid({ code: ' none ', name: 'Select' })).toBe(false);
      expect(isOptionValid({ code: ' select ', name: 'Select' })).toBe(false);
      expect(isOptionValid({ code: 'none', name: ' select ' })).toBe(false);
    });

    it('should return true for valid options', () => {
      expect(isOptionValid({ code: 'Cheque', name: 'Cheque' })).toBe(true);
      expect(isOptionValid({ code: 'DD', name: 'Select DD' })).toBe(true);
      expect(isOptionValid({ code: 'option_1', name: 'Face 2 Face' })).toBe(
        true,
      );
    });

    it('should handle edge cases', () => {
      expect(isOptionValid({ code: '  ', name: '  ' })).toBe(false); // Not specifically invalid by current criteria
      expect(isOptionValid({})).toBe(false);
    });
  });

  describe('getFieldOptions', () => {
    it('should return filtered options for spinner type', () => {
      const options = ['Cheque', 'DD', 'select'];
      const type = 'spinner';
      const expected = [
        { code: 'Cheque', name: 'Cheque' },
        { code: 'DD', name: 'DD' },
      ];
      // @ts-ignore
      expect(getFieldOptions(options, type)).toEqual(expected);
    });

    it('should return the same options for non-spinner type', () => {
      const options = [
        { code: 'Cheque', name: 'Cheque' },
        { code: 'DD', name: 'DD' },
      ];
      const type = 'other';
      const expected = [
        { code: 'Cheque', name: 'Cheque' },
        { code: 'DD', name: 'DD' },
      ];
      expect(getFieldOptions(options, type)).toEqual(expected);
    });

    it('should handle empty options array', () => {
      const options = [];
      const type = 'spinner';
      const expected = [];
      expect(getFieldOptions(options, type)).toEqual(expected);
    });

    it('should handle null options array', () => {
      const options = null;
      const type = 'spinner';
      const expected = [];
      // @ts-ignore
      expect(getFieldOptions(options, type)).toEqual(expected);
    });

    it('should handle invalid options within the array', () => {
      const options = ['Cheque', 'DD', 'none', 'select', ''];
      const type = 'spinner';
      const expected = [
        { code: 'Cheque', name: 'Cheque' },
        { code: 'DD', name: 'DD' },
      ];
      // @ts-ignore
      expect(getFieldOptions(options, type)).toEqual(expected);
    });
  });
});

describe('getAdditionalDataByType', () => {
  it('should return the correct code when a matching name is found', () => {
    const field = {
      type: 'sifg',
      defaultValue: 'some value',
      options: {
        selection: {
          code_name_spinner_options: [
            { name: 'option1', code: 'code1' },
            { name: 'option2', code: 'code2' },
          ],
        },
      },
    };

    const result = getAdditionalDataByType('option1', field, 'defaultValue');
    expect(result).toEqual({ data: { code: 'code1' } });
  });

  it('should return null when the field type is not "sifg"', () => {
    const field = { type: 'otherType', defaultValue: 'some value' };
    const result = getAdditionalDataByType('option1', field, 'defaultValue');
    expect(result).toBeNull();
  });

  it('should return the correct additionalData for aif', () => {
    const value = JSON.stringify({ key1: 'value1', key2: 'value2' });
    const field = { type: 'aif', defaultValue: 'some value' };

    const result = getAdditionalDataByType(value, field, 'defaultValue', {});

    expect(result).toEqual({
      meta: {
        elements: value,
      },
    });
  });

  it('should return currency_iso from clientConfig for type meeting', () => {
    const value = null;
    const field = { type: 'meeting', defaultValue: 'some value' };
    const clientConfig = { i18n_config: { currency_iso: 'INR' } };

    const result = getAdditionalDataByType(
      value,
      field,
      'defaultValue',
      clientConfig,
    );

    expect(result).toEqual({
      meta: {
        currency_iso: 'INR',
      },
    });
  });

  it('should return default currency_iso when clientConfig is undefined for type meeting', () => {
    const value = null;
    const field = { type: 'meeting', defaultValue: 'some value' };

    const result = getAdditionalDataByType(value, field, 'defaultValue');

    expect(result).toEqual({
      meta: {
        currency_iso: DEFAULT_I18N_CONFIG.currency_iso,
      },
    });
  });

  it('should return parsed code for type referral in additionalData', () => {
    const value = JSON.stringify({ code: 'REF123' });
    const field = { type: 'referral', defaultValue: 'some value' };

    const result = getAdditionalDataByType(value, field, 'defaultValue');

    expect(result).toEqual({
      data: {
        code: 'REF123',
      },
    });
  });
});
