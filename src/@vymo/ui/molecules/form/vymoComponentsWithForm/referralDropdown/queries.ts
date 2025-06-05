import _ from 'lodash';

export const getReferralFilters = (customFilter) =>
  (customFilter || []).reduce((acc, f) => {
    acc[f.path] = _.uniq([...(acc[f.path] ?? []), ...f.value]);
    return acc;
  }, {});

export const getReferralDropdownParams = (
  customFilter: Array<{ value: Array<string>; path: string }>,
  source: string,
  searchText?: string,
) => ({
  filters: JSON.stringify(getReferralFilters(customFilter)),
  source,
  search_text: searchText,
});

export const getReferredModuleCode = (
  start_state,
  modules: Array<{ start_state: string; code: string }> = [],
) => {
  const module = modules.find((m) => m?.start_state === start_state);
  return module?.code;
};
