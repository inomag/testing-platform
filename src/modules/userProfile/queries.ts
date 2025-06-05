import { CategoryData } from './types';

export const parseCategoryData = (
  categoryResponse: CategoryData,
  category,
) => ({
  groups:
    category.type === 'grouping_view'
      ? (categoryResponse?.results || [])?.map((group) => ({
          name: group?.group_name,
          inputs: group?.data?.reduce(
            (acc, data) => acc.concat(data.inputs || []),
            [],
          ),
        }))
      : [],
  users: category.type === 'input_list_view' ? categoryResponse?.results : [],
  tables: category.type === 'table_view' ? categoryResponse?.results : [],
  tabItems:
    categoryResponse?.filters?.map((filter) => ({
      label: filter.name,
      key: filter.code,
    })) || [],
  selectedTab:
    categoryResponse?.value?.[0]?.code || categoryResponse?.filters?.[0]?.code,
  ...category,
});

export const getConvertedValues = (inputs: any[]) => {
  const values = {};
  inputs.forEach((input) => {
    values[input.code] = { value: input.value, code: input.code };
  });
  return values;
};
