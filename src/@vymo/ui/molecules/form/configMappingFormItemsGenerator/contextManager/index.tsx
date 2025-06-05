import React from 'react';
import { ContextEvaluatorProps } from './types';
import useContextFilterEvaluator from './useContextFilterEvaluator';

function ContextEvaluator({ render, field, formValue }: ContextEvaluatorProps) {
  const computedFiltersAndOptions = useContextFilterEvaluator(
    field.contextFilters,
    field,
    field.options,
    formValue,
  );

  return render({
    ...field,
    ...computedFiltersAndOptions,
  });
}

export default React.memo(ContextEvaluator);
