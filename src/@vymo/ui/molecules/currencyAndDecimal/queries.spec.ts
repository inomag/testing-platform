import {
  convertValueFromI18nToNative,
  formatCurrency,
  getSeparatorAndDecimalUsingLocale,
  reverseIntl,
} from './queries';

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  describe('getSeparatorAndDecimalUsingLocale', () => {
    it('should return correct separators for en-US locale', () => {
      const result = getSeparatorAndDecimalUsingLocale('en-US');
      expect(result.group).toEqual(',');
      expect(result.decimal).toEqual('.');
    });

    it('should return correct separators for vi-VN locale', () => {
      const result = getSeparatorAndDecimalUsingLocale('vi-VN');
      expect(result.group).toEqual('.');
      expect(result.decimal).toEqual(',');
    });

    it('should return correct separators for id-ID locale', () => {
      const result = getSeparatorAndDecimalUsingLocale('id-ID');
      expect(result.group).toEqual('.');
      expect(result.decimal).toEqual(',');
    });

    it('should return correct separators for en-IN locale', () => {
      const result = getSeparatorAndDecimalUsingLocale('en-IN');
      expect(result.group).toEqual(',');
      expect(result.decimal).toEqual('.');
    });

    it('should return correct separators for th-TH locale', () => {
      const result = getSeparatorAndDecimalUsingLocale('th-TH');
      expect(result.group).toEqual(',');
      expect(result.decimal).toEqual('.');
    });

    it('should handle invalid locale gracefully', () => {
      const result = getSeparatorAndDecimalUsingLocale('invalid-locale');
      expect(result.group).toEqual(',');
      expect(result.decimal).toEqual('.');
    });

    it('should handle undefined locale gracefully', () => {
      const result = getSeparatorAndDecimalUsingLocale(undefined);
      expect(result.group).toEqual(',');
      expect(result.decimal).toEqual('.');
    });
  });

  describe('reverseIntl', () => {
    it('should return correct number for en-US locale', () => {
      const result = reverseIntl('1,234.56', 'en-US');
      expect(result).toEqual('1234.56');
    });

    it('should return correct number for vi-VN locale', () => {
      const result = reverseIntl('1.234,56', 'vi-VN');
      expect(result).toEqual('1234.56');
    });

    it('should return correct number for id-ID locale', () => {
      const result = reverseIntl('1.234,56', 'id-ID');
      expect(result).toEqual('1234.56');
    });

    it('should return correct number for en-IN locale', () => {
      const result = reverseIntl('1,23,456.78', 'en-IN');
      expect(result).toEqual('123456.78');
    });

    it('should return correct number for th-TH locale', () => {
      const result = reverseIntl('1,234.56', 'th-TH');
      expect(result).toEqual('1234.56');
    });

    it('should handle empty string gracefully', () => {
      const result = reverseIntl('', 'en-US');
      expect(result).toEqual('');
    });

    it('should handle invalid number string gracefully', () => {
      const result = reverseIntl('invalid-number', 'en-US');
      expect(result).toEqual('invalid-number');
    });

    it('should handle undefined value gracefully', () => {
      const result = reverseIntl(undefined, 'en-US');
      expect(result).toEqual('');
    });
  });

  describe('convertValueFromI18nToNative', () => {
    it('should convert value to en-US locale', () => {
      const result = convertValueFromI18nToNative('1,234.56', 'en-US');
      expect(result).toEqual('1,234.56');
    });

    it('should convert value to vi-VN locale', () => {
      const result = convertValueFromI18nToNative('1,234.56', 'vi-VN');
      expect(result).toEqual('1,234,56');
    });

    it('should convert value to id-ID locale', () => {
      const result = convertValueFromI18nToNative('1,234.56', 'id-ID');
      expect(result).toEqual('1,234,56');
    });

    it('should convert value to en-IN locale', () => {
      const result = convertValueFromI18nToNative('1,234.56', 'en-IN');
      expect(result).toEqual('1,234.56');
    });

    it('should convert value to th-TH locale', () => {
      const result = convertValueFromI18nToNative('1,234.56', 'th-TH');
      expect(result).toEqual('1,234.56');
    });

    it('should handle empty string gracefully', () => {
      const result = convertValueFromI18nToNative('', 'en-US');
      expect(result).toEqual('');
    });

    it('should handle invalid number string gracefully', () => {
      const result = convertValueFromI18nToNative('invalid-number', 'en-US');
      expect(result).toEqual('invalid-number');
    });

    it('should handle undefined value gracefully', () => {
      const result = convertValueFromI18nToNative(undefined, 'en-US');
      expect(result).toEqual('undefined');
    });
  });

  describe('formatCurrency', () => {
    it('should format value correctly for en-US locale', () => {
      const result = formatCurrency('1234.56', 'en-US');
      expect(result).toEqual('1,234.56');
    });

    it('should format value correctly for vi-VN locale', () => {
      const result = formatCurrency('1234,56', 'vi-VN');
      expect(result).toEqual('1.234,56');
    });

    it('should format value correctly for id-ID locale', () => {
      const result = formatCurrency('1234,56', 'id-ID');
      expect(result).toEqual('1.234,56');
    });

    it('should format value correctly for en-IN locale', () => {
      const result = formatCurrency('123456.78', 'en-IN');
      expect(result).toEqual('1,23,456.78');
    });

    it('should format value correctly for th-TH locale', () => {
      const result = formatCurrency('1234.56', 'th-TH');
      expect(result).toEqual('1,234.56');
    });

    it('should handle empty value gracefully', () => {
      const result = formatCurrency('', 'en-US');
      expect(result).toEqual('');
    });

    it('should handle invalid value gracefully', () => {
      const result = formatCurrency('invalid-value', 'en-US');
      expect(result).toEqual('');
    });

    it('should handle value with trailing decimal gracefully', () => {
      const result = formatCurrency('1234.', 'en-US');
      expect(result).toEqual('1234.');
    });

    it('should handle value with double trailing decimal gracefully', () => {
      const result = formatCurrency('1234..', 'en-US');
      expect(result).toEqual('1234..');
    });
  });
});
