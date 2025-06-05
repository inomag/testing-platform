import { Validation } from './types';

export function checkErrors(
  value: string,
  validations: Validation[],
  label: string,
  required: boolean,
  min?: number,
  max?: number,
): string[] {
  const errors: string[] = [];
  if (required && value.trim() === '') {
    errors.push('Required');
  }
  if (min && value.length < min) {
    errors.push(`${label ?? 'Value'} must be at least ${min} digits long`);
  }
  if (max && value.length > max) {
    errors.push(`${label ?? 'Value'} must be at most ${max} digits long`);
  }
  validations.forEach((v) => {
    if (value && v?.regex && !v?.regex?.test(value)) {
      errors.push(v.errorMessage ?? `${v.regex} failed`);
    }
  });
  return errors;
}

export function getInputId(label: string, id: string): string {
  return label ? `input-${label.toLowerCase().replaceAll(' ', '-')}` : id;
}

export const getSecureInputValue = (
  inputChangeValue: string,
  inputValue: string | number,
) => {
  const changeInLength = inputChangeValue.length - String(inputValue).length;

  if (changeInLength < 0) {
    // Characters were deleted
    inputChangeValue = String(inputValue).slice(
      0,
      String(inputValue).length + changeInLength,
    );
  } else if (changeInLength > 0) {
    // Characters were added
    const newChars = inputChangeValue.slice(String(inputValue).length);
    inputChangeValue = String(inputValue) + newChars;
  }
  return inputChangeValue;
};
