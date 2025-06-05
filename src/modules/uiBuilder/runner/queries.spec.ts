import { executeQuery, handleChange, resolveProps } from './queries';

jest.mock('src/workspace/utils', () => ({
  getModuleProps: jest.fn(() => ({
    getConfigModules: jest.fn(() => ['module1', 'module2']),
  })),
}));

describe('src/modules/uiBuilder/runner/queries.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('executeQuery', () => {
    it('should execute valid function logic with correct parameters', () => {
      const logic = '(data, formData) => data + formData.value';
      const result = executeQuery(logic, 5, { value: 10 });
      expect(result).toBe(15);
    });

    it('should return null for invalid function syntax', () => {
      const logic = 'invalid syntax';
      const result = executeQuery(logic);
      expect(result).toBeNull();
    });

    it('should handle undefined parameters gracefully', () => {
      const logic = '(data, formData) => data + formData?.value';
      const result = executeQuery(logic);
      expect(result).toBeNull();
    });

    it('should handle empty string logic', () => {
      const result = executeQuery('');
      expect(result).toBeNull();
    });
  });

  describe('resolveProps', () => {
    it('should correctly resolve dataObject modules path', () => {
      const props = { path: '{dataObject__modules}' };
      const result = resolveProps(props, {});
      expect(result).toEqual(['module1', 'module2']);
    });

    it('should execute query transformation when provided', () => {
      const props = { path: '{formConfig__test}', query: '(data) => data * 2' };
      const result = resolveProps(props, { test: 5 });
      expect(result).toBe(10);
    });

    it('should return direct config value when no query is provided', () => {
      const props = { path: '{formConfig__test}' };
      const result = resolveProps(props, { test: 'value' });
      expect(result).toBe('value');
    });

    it('should handle missing path gracefully', () => {
      const props = { path: '{formConfig__nonexistent}' };
      const result = resolveProps(props, {});
      expect(result).toBe('');
    });
  });

  describe('handleChange', () => {
    let setConfig;
    let config;
    const defaultParams = {
      event: null,
      additionalData: null,
      validValue: true,
      currentError: null,
    };

    beforeEach(() => {
      setConfig = jest.fn();
      config = { test: 'oldValue' };
    });

    it('should update config when valid path exists', () => {
      const node = { data: { value: { path: '{formConfig__test}' } } };

      const updatedValue = handleChange({
        value: 'newValue',
        node,
        config,
        setConfig,
        ...defaultParams,
      });

      expect(updatedValue).toBe('newValue');
      expect(setConfig).toHaveBeenCalledWith({ test: 'newValue' });
      expect(setConfig).toHaveBeenCalledTimes(1);
    });

    it('should execute saveQuery transformation when provided', () => {
      const node = {
        data: {
          value: {
            saveQuery: "(data) => data + '!'",
            path: '{formConfig__test}',
          },
        },
      };

      const updatedValue = handleChange({
        value: 'hello',
        node,
        config,
        setConfig,
        ...defaultParams,
      });

      expect(updatedValue).toBe('hello!');
      expect(setConfig).toHaveBeenCalledWith({ test: 'hello!' });
    });

    it('should handle invalid saveQuery gracefully', () => {
      const node = {
        data: {
          value: {
            saveQuery: 'invalid syntax',
            path: '{formConfig__test}',
          },
        },
      };

      const updatedValue = handleChange({
        value: 'hello',
        node,
        config,
        setConfig,
        ...defaultParams,
      });

      expect(updatedValue).toBe('hello');
      expect(setConfig).toHaveBeenCalledWith({ test: 'hello' });
    });

    it('should handle missing path gracefully', () => {
      const node = { data: { value: {} } };

      const updatedValue = handleChange({
        value: 'newValue',
        node,
        config,
        setConfig,
        ...defaultParams,
      });

      expect(updatedValue).toBe('newValue');
      expect(setConfig).not.toHaveBeenCalled();
    });

    it('should handle array values correctly', () => {
      const node = { data: { value: { path: '{formConfig__test}' } } };
      const arrayValue = [{ value: 'arrayValue' }];

      const updatedValue = handleChange({
        value: arrayValue,
        node,
        config,
        setConfig,
        ...defaultParams,
      });

      expect(updatedValue).toBe('arrayValue');
      expect(setConfig).toHaveBeenCalledWith({ test: 'arrayValue' });
    });
  });
});
