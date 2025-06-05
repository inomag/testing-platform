import {
  fetchFilterValue,
  getCustomFilters,
  getFilteredOptions,
  getFormFilterValues,
  getSourceAttribute,
} from './queries';

describe('getFormFilterValues', () => {
  it('should return filter when contextValue is empty', () => {
    const contextValue = null;
    const defaultPath = 'path';
    const filter = [];
    const result = getFormFilterValues(contextValue, defaultPath, filter);
    expect(result).toEqual([]);
  });

  it('should recurse through array contextValue', () => {
    const contextValue = ['value1', 'value2'];
    const defaultPath = 'path';
    const filter = [];
    const result = getFormFilterValues(contextValue, defaultPath, filter);
    expect(result).toEqual(['value1', 'value2']);
  });

  it('should recurse through object contextValue', () => {
    const contextValue = { path: { path: 'value' } };
    const defaultPath = 'path';
    const filter = [];
    const result = getFormFilterValues(contextValue, defaultPath, filter);
    expect(result).toEqual(['value']);
  });
});

describe('getSourceAttribute', () => {
  it('should return attribute with suffix if originalCode is present', () => {
    const input = { code: 'code123', originalCode: 'code' };
    const attribute = 'attribute';
    const result = getSourceAttribute(input, attribute);
    expect(result).toBe('attribute123');
  });

  it('should return attribute without suffix if originalCode is not present', () => {
    const input = { code: 'code123' };
    const attribute = 'attribute';
    const result = getSourceAttribute(input, attribute);
    expect(result).toBe('attribute');
  });
});

describe('fetchFilterValue', () => {
  it('should return unique values for form namespace', () => {
    const namespace = 'form';
    const attribute = 'attribute';
    const currentContext = {
      form: {
        attribute: { value: ['value1', 'value2', 'value1'] },
      },
    };
    const result = fetchFilterValue(namespace, attribute, currentContext);
    expect(result).toEqual(['value1', 'value2']);
  });
});

describe('getCustomFilters', () => {
  test('should return dynamic filters', () => {
    const contextFilters = [
      {
        source_attribute: 'attribute',
        source_namespace: 'form',
        type: 'dynamic',
        filter_attribute: 'path',
      },
    ];
    const fieldConfig = 'attribute';
    const currentContext = {
      form: { attribute: { value: ['value1'] } },
    };
    const result = getCustomFilters(
      contextFilters,
      fieldConfig,
      currentContext,
    );
    expect(result).toEqual([{ path: 'path', value: ['value1'] }]);
  });

  test('should return static filters', () => {
    const contextFilters = [
      {
        source_attribute: 'attribute',
        type: 'static',
        filter_attribute: 'path',
        filter_value: 'value1',
      },
    ];
    const fieldConfig = 'attribute';
    const currentContext = {};
    const result = getCustomFilters(
      contextFilters,
      fieldConfig,
      currentContext,
    );
    expect(result).toEqual([{ path: 'path', value: 'value1' }]);
  });
});

describe('getFilteredOptions', () => {
  test('should return filtered options based on filters', () => {
    const filters = [{ path: 'attribute', value: ['value1', 'value2'] }];
    const options = [
      { attribute: 'value1' },
      { attribute: 'value2' },
      { attribute: 'value3' },
    ];
    const result = getFilteredOptions(filters, options);
    expect(result).toEqual([{ attribute: 'value1' }, { attribute: 'value2' }]);
  });

  test('should return all options when filters are empty', () => {
    const filters = [];
    const options = [
      { attribute: 'value1' },
      { attribute: 'value2' },
      { attribute: 'value3' },
    ];
    const result = getFilteredOptions(filters, options);
    expect(result).toEqual(options);
  });
});
