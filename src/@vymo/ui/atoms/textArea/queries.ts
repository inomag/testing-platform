import { Validation } from './type';

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
    if (value && !v?.regex?.test(value)) {
      errors.push(v.errorMessage);
    }
  });
  return errors;
}
export function getTextAreaId(label: string, id: string): string {
  return label ? `text-area-${label.toLowerCase().replaceAll(' ', '-')}` : id;
}
