/* eslint-disable @typescript-eslint/default-param-last */
import _ from 'lodash';
import { nameSpaces as C } from '../formulaContext/contextClass/constants';

// Refactored to use more descriptive variable names and simplify logic where possible
export const getFormFilterValues = (
  contextValue,
  defaultPath,
  filter: any[] = [],
) => {
  if (_.isEmpty(contextValue)) return filter;

  if (_.isArray(contextValue)) {
    contextValue.forEach((val) =>
      getFormFilterValues(val, defaultPath, filter),
    );
    return filter;
  }

  const pathValue = _.get(contextValue, defaultPath);
  if (pathValue) return getFormFilterValues(pathValue, defaultPath, filter);

  if (_.isString(contextValue)) {
    filter.push(contextValue);
  }

  return filter;
};

export const getSourceAttribute = (input, attribute) => {
  const { code: inputCode, originalCode = '' } = input;
  const aifSuffix = inputCode?.replace(originalCode, '') || '';
  return !_.isEmpty(originalCode) ? `${attribute}${aifSuffix}` : attribute;
};

export const fetchFilterValue = (namespace, attribute, currentContext) => {
  if (namespace === 'form' || namespace === 'vos') {
    const contextValue = _.get(
      currentContext,
      namespace === 'form'
        ? `${namespace}.${attribute}.value`
        : `${C.NS_REFERRAL}`,
    );
    return _.uniq(getFormFilterValues(contextValue, `data.${namespace}`));
  }

  const namespaceObj = currentContext[namespace];
  const filterValues: any[] = [];

  _.each(namespaceObj, (item) => {
    if (_.isArray(item)) {
      item.forEach((opt) => {
        const found = _.isArray(opt)
          ? _.find(opt, { code: attribute })
          : opt[attribute] && opt;
        const value = _.isArray(found)
          ? _.get(found, 'value', [])
          : found && [found[attribute]];
        filterValues.push(...value);
      });
    } else if (item[attribute]) {
      filterValues.push(item[attribute]);
    }
  });

  return _.uniq(filterValues);
};

export const getCustomFilters = (
  contextFilters: any[] = [],
  fieldConfig,
  currentContext,
) =>
  contextFilters.reduce((acc, filter) => {
    const sourceAttribute = getSourceAttribute(
      fieldConfig,
      filter.source_attribute,
    );
    const dynamicFilterValue =
      filter.type === 'dynamic'
        ? fetchFilterValue(
            filter.source_namespace,
            sourceAttribute,
            currentContext,
          )
        : filter.filter_value;

    if (!_.isEmpty(dynamicFilterValue)) {
      acc.push({ path: filter.filter_attribute, value: dynamicFilterValue });
    }

    return acc;
  }, []);

export const getFilteredOptions = (filters, options) => {
  if (_.isEmpty(filters)) return options;

  return options.filter((option) =>
    filters.every((filter) => {
      const pathValue = option.inputs_map?.[filter.path] || option[filter.path];
      return filter.value.some(
        (value) =>
          _.lowerCase(String(value)) === _.lowerCase(String(pathValue)),
      );
    }),
  );
};
