import { getDefaultValues } from './queries';

describe('getDefaultValues', () => {
  it('should return an object with default values for valid inputs', () => {
    const values = {
      name: 'John',
      age: 30,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      name: { value: 'John', code: 'name' },
      age: { value: 30, code: 'age' },
    });
  });

  it('should return an empty object for inputs with no values', () => {
    const values = {
      name: '',
      age: null,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({});
  });

  it('should handle an empty object input', () => {
    const values = {};
    const result = getDefaultValues(values);
    expect(result).toEqual({});
  });

  it('should handle inputs with mixed valid and invalid values', () => {
    const values = {
      name: 'John',
      age: '',
      city: 'New York',
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      name: { value: 'John', code: 'name' },
      city: { value: 'New York', code: 'city' },
    });
  });

  it('should handle inputs with undefined values', () => {
    const values = {
      name: undefined,
      age: 30,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      age: { value: 30, code: 'age' },
    });
  });

  it('should handle inputs with null values', () => {
    const values = {
      name: null,
      age: 30,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      age: { value: 30, code: 'age' },
    });
  });

  it('should handle inputs with mixed valid, empty, and null values', () => {
    const values = {
      name: 'John',
      age: '',
      city: null,
      country: 'USA',
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      name: { value: 'John', code: 'name' },
      country: { value: 'USA', code: 'country' },
    });
  });

  it('should handle inputs with numeric values', () => {
    const values = {
      age: 0,
      score: 100,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      age: { value: 0, code: 'age' },
      score: { value: 100, code: 'score' },
    });
  });

  it('should handle inputs with boolean values', () => {
    const values = {
      isActive: true,
      isDeleted: false,
    };
    const result = getDefaultValues(values);
    expect(result).toEqual({
      isActive: { value: true, code: 'isActive' },
      isDeleted: { value: false, code: 'isDeleted' },
    });
  });
});
