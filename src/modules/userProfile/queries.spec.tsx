import { getConvertedValues, parseCategoryData } from './queries';

describe('parseCategoryData', () => {
  const mockCategoryResponse = {
    results: [
      {
        group_name: 'Group 1',
        data: [
          { inputs: [{ code: 'input1', value: 'value1' }] },
          { inputs: [{ code: 'input2', value: 'value2' }] },
        ],
      },
      {
        group_name: 'Group 2',
        data: [{ inputs: [{ code: 'input3', value: 'value3' }] }],
      },
    ],
    filters: [
      { name: 'Filter 1', code: 'filter1' },
      { name: 'Filter 2', code: 'filter2' },
    ],
    value: [{ code: 'filter2' }],
  };

  const mockCategoryGroupingView = {
    type: 'grouping_view',
  };

  const mockCategoryInputListView = {
    type: 'input_list_view',
  };

  it('should parse category data for grouping_view', () => {
    const result = parseCategoryData(
      mockCategoryResponse,
      mockCategoryGroupingView,
    );

    expect(result.groups).toEqual([
      {
        name: 'Group 1',
        inputs: [
          { code: 'input1', value: 'value1' },
          { code: 'input2', value: 'value2' },
        ],
      },
      {
        name: 'Group 2',
        inputs: [{ code: 'input3', value: 'value3' }],
      },
    ]);
    expect(result.users).toEqual([]);
    expect(result.tabItems).toEqual([
      { label: 'Filter 1', key: 'filter1' },
      { label: 'Filter 2', key: 'filter2' },
    ]);
    expect(result.selectedTab).toBe('filter2');
  });

  it('should parse category data for input_list_view', () => {
    const result = parseCategoryData(
      mockCategoryResponse,
      mockCategoryInputListView,
    );

    expect(result.groups).toEqual([]);
    expect(result.users).toEqual(mockCategoryResponse.results);
    expect(result.tabItems).toEqual([
      { label: 'Filter 1', key: 'filter1' },
      { label: 'Filter 2', key: 'filter2' },
    ]);
    expect(result.selectedTab).toBe('filter2');
  });

  it('should handle missing data gracefully', () => {
    const result = parseCategoryData({}, mockCategoryGroupingView);

    expect(result.groups).toEqual([]);
    expect(result.users).toEqual([]);
    expect(result.tabItems).toEqual([]);
    expect(result.selectedTab).toBeUndefined();
  });
});

describe('getConvertedValues', () => {
  it('should convert inputs to values object', () => {
    const inputs = [
      { code: 'input1', value: 'value1' },
      { code: 'input2', value: 'value2' },
    ];
    const result = getConvertedValues(inputs);

    expect(result).toEqual({
      input1: { value: 'value1', code: 'input1' },
      input2: { value: 'value2', code: 'input2' },
    });
  });

  it('should handle an empty inputs array', () => {
    const result = getConvertedValues([]);
    expect(result).toEqual({});
  });

  it('should handle inputs with code and value', () => {
    const inputs = [{ code: 'input1', value: 'input1' }];
    const result = getConvertedValues(inputs);

    expect(result).toEqual({
      input1: { code: 'input1', value: 'input1' },
    });
  });
});
