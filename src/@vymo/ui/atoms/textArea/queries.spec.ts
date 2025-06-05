import { checkErrors, getTextAreaId } from './queries';
import { Validation } from './type';

describe('src/@vymo/ui/atoms/textArea/queries.ts', () => {
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

  describe('getTextAreaId', () => {
    it('should return an id based on the label if label is provided', () => {
      const label = 'Test Label';
      const id = 'test-id';
      const result = getTextAreaId(label, id);
      expect(result).toEqual('text-area-test-label');
    });

    it('should return the provided id if label is not provided', () => {
      const label = '';
      const id = 'test-id';
      const result = getTextAreaId(label, id);
      expect(result).toEqual('test-id');
    });

    it('should replace spaces in the label with hyphens', () => {
      const label = 'Test Label With Spaces';
      const id = 'test-id';
      const result = getTextAreaId(label, id);
      expect(result).toEqual('text-area-test-label-with-spaces');
    });
  });
});
