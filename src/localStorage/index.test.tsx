import localStorageService from './index';

describe('localStorageService', () => {
  afterEach(() => {
    localStorage.removeItem('test-key');
  });

  describe('get', () => {
    it('should return null if the key is null', () => {
      const value = localStorageService.get<string>(null);
      expect(value).toBeNull();
    });

    it('should return null if the key is not found in local storage', () => {
      const value = localStorageService.get<string>('nonexistent-key');
      expect(value).toBeNull();
    });

    it('should return the value associated with the key if it is found in local storage', () => {
      const expectedValue = { foo: 'bar' };
      localStorage.setItem('test-key', JSON.stringify(expectedValue));

      const value = localStorageService.get<{ foo: string }>('test-key');
      expect(value).toEqual(expectedValue);
    });

    it('should return null if the value associated with the key cannot be parsed as the specified type', () => {
      localStorage.setItem('test-key', 'not a valid JSON string');

      const value = localStorageService.get<{ foo: string }>('test-key');
      expect(value).toBeNull();
    });
  });

  describe('set', () => {
    it('should set the value associated with the key in local storage', () => {
      const value = { foo: 'bar' };
      localStorageService.set('test-key', value);

      const storedValue = localStorage.getItem('test-key');
      expect(storedValue).toEqual(JSON.stringify(value));
    });
  });

  describe('delete', () => {
    it('should remove the value associated with the key from local storage', () => {
      localStorage.setItem('test-key', 'test-value');

      localStorageService.delete('test-key');

      const storedValue = localStorage.getItem('test-key');
      expect(storedValue).toBeNull();
    });
  });
});
