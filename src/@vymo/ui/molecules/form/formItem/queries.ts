/* eslint-disable complexity */
import { evaluate } from '../configMappingFormItemsGenerator/formulaContext/evaluate';
import { evaluateValidation } from '../configMappingFormItemsGenerator/formulaContext/queries';
import { FormulaValidation, Validation } from './types';

export function checkErrors(
  value,
  validations: Validation[] | FormulaValidation[],
  label: string,
  required: boolean,
): string[] {
  const errors: string[] = [];
  if (required && !value?.toString()?.trim()) {
    errors.push('Required');
  }
  validations.forEach((validation) => {
    if (validation.expression) {
      const errorMsg = evaluateValidation(validation, evaluate);
      if (errorMsg) {
        errors.push(errorMsg);
      }
    } else if (value && !validation.regex.test(value)) {
      errors.push(validation.errorMessage);
    }
  });
  return errors;
}
