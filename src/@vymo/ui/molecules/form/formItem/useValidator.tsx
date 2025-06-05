import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { evaluate } from '../configMappingFormItemsGenerator/formulaContext/evaluate';
import {
  evaluateValidation,
  getFormulaDependentInputCodesForValidations,
  oifVerificationRequired,
  phoneValidation,
  validateLabelClick,
} from '../configMappingFormItemsGenerator/formulaContext/queries';
import { FormulaValidation, Validation } from './types';

function useValidator(
  label: string,
  value,
  code: string,
  required: boolean,
  verified: boolean | null,
  type: string | undefined,
  hint: string | undefined,
  validations: Validation[] | FormulaValidation[] = [],
  formValue = {},
): {
  isValid: boolean;
  errors: string[];
  validate: (
    arg0: any,
    arg1: any,
  ) => { isCurrentValid: boolean; currentErrors: string[] };
} {
  const isFirstTime = useRef(true);

  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback(
    (inputValue, additionalData) => {
      const currentErrors: string[] = [];
      if (
        oifVerificationRequired(
          required,
          formValue?.[code]?.touched,
          verified,
          additionalData,
          !inputValue?.toString()?.trim(),
        )
      ) {
        currentErrors.push('Verification Required');
      }

      if (validateLabelClick(required, type, additionalData)) {
        currentErrors.push(`Please click on ${hint} to proceed`);
      }

      if (required && !inputValue?.toString()?.trim()) {
        currentErrors.push('Required');
      }

      if (formValue?.[code]?.additionalData?.meta?.country_code && inputValue) {
        const error = phoneValidation(
          formValue?.[code]?.additionalData?.meta?.country_code,
          inputValue,
        );
        if (error) {
          currentErrors.push(error);
        }
      }

      validations.forEach((validation) => {
        if (validation.expression) {
          const errorMsg = evaluateValidation(validation, evaluate);
          if (errorMsg) {
            currentErrors.push(errorMsg);
          }
        } else if (inputValue && !validation.regex.test(inputValue)) {
          currentErrors.push(validation.errorMessage);
        }
      });

      if (!_.isEqual(errors, currentErrors)) {
        setErrors(currentErrors);
      }

      return {
        isCurrentValid: currentErrors.length === 0,
        currentErrors,
      };
    },
    [code, errors, formValue, hint, required, type, validations, verified],
  );

  const strigifiedFormDepenednetData = useMemo(
    () =>
      JSON.stringify(
        _.pick(
          formValue,
          getFormulaDependentInputCodesForValidations(validations),
        ),
      ),
    [formValue, validations],
  );

  useEffect(
    () => () => {
      isFirstTime.current = true;
    },
    [],
  );

  //  run formula validations for field that depends on other fields value after first render/effect
  useEffect(() => {
    if (!isFirstTime.current) {
      validate(value, {});
    }
    isFirstTime.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strigifiedFormDepenednetData]);

  return { isValid: errors.length === 0, errors, validate };
}

export default useValidator;
