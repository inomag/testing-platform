import React, { useMemo } from 'react';
import { useFormContext } from '../../formProvider';
import { mapConfigData } from '../../formProvider/queries';
import { getAdditionalDataByType } from '../queries';
import { FormulaEvaluatorProps } from '../types';
import useFormulaEvaluator from './useFormulaEvaluator';

function FormulaEvaluator({
  render,
  field,
  formValue,
  clientConfig,
}: FormulaEvaluatorProps) {
  const { setFormConfig, config } = useFormContext(false);

  const computedFieldValue = useFormulaEvaluator(
    'defaultValue',
    formValue?.[field.code]?.value,
    field,
    formValue,
    String,
  );

  const computedAdditionalData = useMemo(
    () =>
      getAdditionalDataByType(
        computedFieldValue,
        field,
        'defaultValue',
        clientConfig,
        formValue?.[field.code]?.additionalData,
      ),
    [computedFieldValue, field, clientConfig, formValue],
  );

  const computedHiddenValue = useFormulaEvaluator(
    'hiddenV2',
    field.hidden,
    field,
    formValue,
    Boolean,
  );

  const computedReadOnlyValue = useFormulaEvaluator(
    'readOnlyV2',
    field.disabled,
    field,
    formValue,
    Boolean,
  );

  const computedPlaceholderValue = useFormulaEvaluator(
    'placeholderValue',
    field.placeholder,
    field,
    formValue,
    String,
  );

  const computedMandatoryValue = useFormulaEvaluator(
    'requiredV2',
    field.required,
    field,
    formValue,
    String,
  );

  useMemo(() => {
    if (!field.retainFormContext && computedHiddenValue) {
      const updatedConfigData = mapConfigData(config.data, (inputField) => {
        if (inputField.code === field.code) {
          return {
            ...inputField,
            hideFormValue: true,
          };
        }
        return inputField;
      });

      setFormConfig({
        ...config,
        data: updatedConfigData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.retainFormContext, field.code, computedHiddenValue, setFormConfig]);

  return render(
    {
      ...field,
      placeholder: computedPlaceholderValue,
      hidden: computedHiddenValue,
      disabled: computedReadOnlyValue,
      required: computedMandatoryValue,
    },
    computedFieldValue,
    computedAdditionalData,
  );
}

export default React.memo(FormulaEvaluator);
