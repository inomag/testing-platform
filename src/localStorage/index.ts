/* eslint-disable no-console */
const localStorageService = {
  get: <T>(key: string | null): T | null => {
    if (key === null) {
      return null;
    }
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(
        `Error parsing local storage value for key ${key}: ${error}`,
      );
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error setting local storage value for key ${key}: ${error}`,
      );
    }
  },

  delete: (key: string): void => {
    localStorage.removeItem(key);
  },
};

export default localStorageService;
