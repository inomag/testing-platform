import { checkErrors } from './queries';
import { Validation } from './types';

describe('checkErrors', () => {
  const validations: Validation[] = [
    {
      regex: /^[a-zA-Z\s]+$/,
      errorMessage: 'Only alphabets and spaces are allowed',
    },
    {
      regex: /^[0-9]{10}$/,
      errorMessage: 'Phone number should be 10 digits',
    },
  ];

  it('should return an empty array if value is valid', () => {
    const value = 'John Doe';
    const label = 'Name';
    const required = true;
    const errors = checkErrors(value, [validations[0]], label, required);
    expect(errors).toEqual([]);
  });

  it('should return an error message if value is empty and required is true', () => {
    const value = '';
    const label = 'Name';
    const required = true;
    const errors = checkErrors(value, validations, label, required);
    expect(errors).toEqual(['Required']);
  });

  it('should return an error message if value does not match regex', () => {
    const value = 'John Doe 123';
    const label = 'Name';
    const required = true;
    const errors = checkErrors(value, [validations[0]], label, required);
    expect(errors).toEqual(['Only alphabets and spaces are allowed']);
  });

  it('should return multiple error messages if value does not match multiple regex', () => {
    const value = 'John Doe 123';
    const label = 'Name';
    const required = true;
    const errors = checkErrors(value, validations, label, required);
    expect(errors).toEqual([
      'Only alphabets and spaces are allowed',
      'Phone number should be 10 digits',
    ]);
  });
});
