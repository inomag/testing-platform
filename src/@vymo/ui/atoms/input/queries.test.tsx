import { checkErrors, getInputId, getSecureInputValue } from './queries';
import { Validation } from './types';

describe('src/@vymo/ui/blocks/input/queries.test.tsx', () => {
  describe('checkErrors', () => {
    const validations: Validation[] = [
      {
        regex: /^[a-zA-Z]+$/,
        errorMessage: 'Value must contain only letters',
      },
      {
        regex: /^[0-9]+$/,
        errorMessage: 'Value must contain only numbers',
      },
    ];

    it('should return an empty array if no errors are found', () => {
      const value = 'abc123';
      const errors = checkErrors(value, [], 'Test Field', true, 3, 6);
      expect(errors).toEqual([]);
    });

    it('should return an error message if the value is required and empty', () => {
      const value = '';
      const errors = checkErrors(value, validations, 'Test Field', true, 3, 6);
      expect(errors).toContain('Required');
    });

    it('should return an error message if the value is too short', () => {
      const value = 'ab';
      const errors = checkErrors(value, validations, 'Test Field', true, 3, 6);
      expect(errors).toContain('Test Field must be at least 3 digits long');
    });

    it('should return an error message if the value is too long', () => {
      const value = 'abcdefg';
      const errors = checkErrors(value, validations, 'Test Field', true, 3, 6);
      expect(errors).toContain('Test Field must be at most 6 digits long');
    });

    it('should return an error message if the value does not match a validation regex', () => {
      const value = 'abc123!';
      const errors = checkErrors(value, validations, 'Test Field', true, 3, 6);
      expect(errors).toContain('Value must contain only letters');
    });

    it('should return multiple error messages if multiple errors are found', () => {
      const value = 'abc123!';
      const errors = checkErrors(value, validations, 'Test Field', true, 1, 2);
      // expect(errors).toContain('TEST FIELD must be at least 1 digits long');
      expect(errors).toContain('Test Field must be at most 2 digits long');
      expect(errors).toContain('Value must contain only letters');
    });
  });

  describe('getInputId', () => {
    it('should return an id based on the label if label is provided', () => {
      const label = 'Test Label';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('input-test-label');
    });

    it('should return the provided id if label is not provided', () => {
      const label = '';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('test-id');
    });

    it('should replace spaces in the label with hyphens', () => {
      const label = 'Test Label With Spaces';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('input-test-label-with-spaces');
    });
  });

  describe('getSecureInputValue', () => {
    it('should return the same input value if no characters are added or removed', () => {
      expect(getSecureInputValue('test', 'test')).toBe('test');
    });

    it('should remove characters when inputChangeValue is shorter', () => {
      const result = getSecureInputValue('te', 'test');
      expect(result).toBe('te');
    });

    it('should add characters when inputChangeValue is longer', () => {
      const result = getSecureInputValue('testing', 'test');
      expect(result).toBe('testing');
    });

    it('should handle numbers as inputValue correctly', () => {
      const result = getSecureInputValue('1234', 123);
      expect(result).toBe('1234');
    });

    it('should handle empty string inputChangeValue correctly', () => {
      const result = getSecureInputValue('', 'test');
      expect(result).toBe('');
    });

    it('should handle empty string inputValue correctly', () => {
      const result = getSecureInputValue('test', '');
      expect(result).toBe('test');
    });

    it('should handle numeric strings correctly', () => {
      const result = getSecureInputValue('456', '123');
      expect(result).toBe('456');
    });
  });

  describe('getInputId', () => {
    it('should return an id based on the label if label is provided', () => {
      const label = 'Test Label';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('input-test-label');
    });

    it('should return the provided id if label is not provided', () => {
      const label = '';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('test-id');
    });

    it('should replace spaces in the label with hyphens', () => {
      const label = 'Test Label With Spaces';
      const id = 'test-id';
      const result = getInputId(label, id);
      expect(result).toEqual('input-test-label-with-spaces');
    });
  });
});
