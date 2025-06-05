import _ from 'lodash';
import { useMemo } from 'react';
import { useFormContext } from '../../formProvider';
import { nameSpaces as C } from '../formulaContext/contextClass/constants';
import { evaluate } from '../formulaContext/evaluate';
import { getCustomFilters, getFilteredOptions } from './queries';

function useContextFilterEvaluator(contextFilters, field, options, formValue) {
  const { referralData, setDebugMessage, isDebug } = useFormContext(false);

  const stringifieldFormDependentData = useMemo(() => {
    const dependentCodes = _.map(
      contextFilters,
      (filter) => filter.source_attribute,
    );
    return JSON.stringify(_.pick(formValue, dependentCodes));
  }, [contextFilters, formValue]);

  // Using referralData. Need to look back here once some referral context filter use case comes up
  const currentContext = useMemo(
    () => ({
      form: formValue,
      referral: referralData,
      session: evaluate.getContext(C.NS_SESSION).context,
      vo: evaluate.getContext(C.NS_VO).context,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stringifieldFormDependentData],
  );

  const customFilters = useMemo(() => {
    const filters = getCustomFilters(contextFilters, field, currentContext);
    if (filters.length > 0 && isDebug) {
      setDebugMessage({
        messageKey: `Custom Filters context (${field.code})`,
        data: currentContext,
      });
    }
    return filters;
  }, [contextFilters, field, currentContext, isDebug, setDebugMessage]);

  const filteredOptions = useMemo(
    () => getFilteredOptions(customFilters, options),
    [customFilters, options],
  );

  return { customFilters, options: filteredOptions };
}

export default useContextFilterEvaluator;
