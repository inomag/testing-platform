import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { evaluate } from './evaluate';
import { evaluateField, getFormulaDependentInputCodes } from './queries';

function useFormulaEvaluator(
  path: string,
  value,
  field,
  formValue,
  type: typeof String | typeof Boolean,
) {
  const [computedValue, setComputedValue] = useState(type(''));

  const strigifiedFormDepenednetData = useMemo(
    () =>
      JSON.stringify(
        _.pick(formValue, getFormulaDependentInputCodes(field[path] ?? {})),
      ),
    [field, formValue, path],
  );

  useEffect(() => {
    if (field[path]) {
      let evaluatedValue = evaluateField(field[path], evaluate);
      if (
        typeof evaluatedValue === 'number' &&
        !['date', 'time', 'number'].includes(field.type)
      ) {
        evaluatedValue = String(evaluatedValue);
      }
      setComputedValue(evaluatedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strigifiedFormDepenednetData]);

  value = field[path] && computedValue ? computedValue : value;

  return value;
}

export default useFormulaEvaluator;
