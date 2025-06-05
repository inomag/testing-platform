import { getValueForSelect } from './queries';

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  describe('getValueForSelect', () => {
    const options = [
      { code: '001', name: 'Option 1' },
      { code: '002', name: 'Option 2' },
      { code: '003', name: 'Option 3' },
    ];

    it('should return a value when return code is true', () => {
      const value = 'someValue';
      const returnCode = true;
      const result = getValueForSelect(value, returnCode, options);
      expect(result).toBe(value);
    });

    it('should return code when return code is false and name exists', () => {
      const value = 'Option 1';
      const returnCode = false;
      const result = getValueForSelect(value, returnCode, options);
      expect(result).toBe('001');
    });

    it('should return undefine when return code is false and name is not present', () => {
      const value = 'Nonexistence option';
      const returnCode = false;
      const result = getValueForSelect(value, returnCode, options);
      expect(result).toBeUndefined();
    });
  });
});
