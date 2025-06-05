import { MimeTypes } from './constants';
import { getEnumKey, getSizeUnitFormat, isImageMimeType } from './queries';

describe('getEnumKey', () => {
  it('should return correct enum key', () => {
    expect(getEnumKey(MimeTypes.PDF)).toBe('application/pdf');
  });

  it('should return undefined for unknown mime type', () => {
    expect(getEnumKey('unknown/mime-type')).toBe(undefined);
  });
});

describe('getSizeUnitFormat', () => {
  // Test zero bytes
  describe('when handling zero bytes', () => {
    it('should return "0 bytes"', () => {
      expect(getSizeUnitFormat(0)).toBe('0 bytes');
    });
  });

  // Test byte values (0-1023 bytes)
  describe('when handling byte values', () => {
    it('should format single byte correctly', () => {
      expect(getSizeUnitFormat(1)).toBe('1 bytes');
    });

    it('should format multiple bytes correctly', () => {
      expect(getSizeUnitFormat(512)).toBe('512 bytes');
    });

    it('should handle maximum bytes before KB', () => {
      expect(getSizeUnitFormat(1023)).toBe('1023 bytes');
    });
  });

  // Test KB values (1024 bytes - 1048575 bytes)
  describe('when handling kilobyte values', () => {
    it('should format exact KB correctly', () => {
      expect(getSizeUnitFormat(1024)).toBe('1 KB');
    });

    it('should format decimal KB correctly', () => {
      expect(getSizeUnitFormat(1536)).toBe('1.5 KB');
    });

    it('should format multiple KB correctly', () => {
      expect(getSizeUnitFormat(2048)).toBe('2 KB');
    });

    it('should handle maximum KB before MB', () => {
      expect(getSizeUnitFormat(1024 * 1024 - 1)).toBe('1024.0 KB');
    });

    it('should round KB to one decimal place', () => {
      expect(getSizeUnitFormat(1500)).toBe('1.5 KB');
      expect(getSizeUnitFormat(1516)).toBe('1.5 KB');
      expect(getSizeUnitFormat(1537)).toBe('1.5 KB');
    });
  });

  // Test MB values (1048576 bytes - 1073741823 bytes)
  describe('when handling megabyte values', () => {
    it('should format exact MB correctly', () => {
      expect(getSizeUnitFormat(1024 * 1024)).toBe('1 MB');
    });

    it('should format decimal MB correctly', () => {
      expect(getSizeUnitFormat(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });

    it('should format multiple MB correctly', () => {
      expect(getSizeUnitFormat(2 * 1024 * 1024)).toBe('2 MB');
    });

    it('should handle maximum MB before GB', () => {
      expect(getSizeUnitFormat(1024 * 1024 * 1024 - 1)).toBe('1024.0 MB');
    });

    it('should round MB to one decimal place', () => {
      const oneMBAndHalf = 1.5 * 1024 * 1024;
      expect(getSizeUnitFormat(oneMBAndHalf)).toBe('1.5 MB');
      expect(getSizeUnitFormat(oneMBAndHalf + 1024)).toBe('1.5 MB');
    });
  });

  // Test GB values (1073741824 bytes and above)
  describe('when handling gigabyte values', () => {
    it('should format exact GB correctly', () => {
      expect(getSizeUnitFormat(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should format decimal GB correctly', () => {
      expect(getSizeUnitFormat(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB');
    });

    it('should format multiple GB correctly', () => {
      expect(getSizeUnitFormat(2 * 1024 * 1024 * 1024)).toBe('2 GB');
    });

    it('should round GB to one decimal place', () => {
      const oneGBAndHalf = 1.5 * 1024 * 1024 * 1024;
      expect(getSizeUnitFormat(oneGBAndHalf)).toBe('1.5 GB');
      expect(getSizeUnitFormat(oneGBAndHalf + 1024 * 1024)).toBe('1.5 GB');
    });
  });

  // Test edge cases and invalid inputs
  describe('when handling edge cases', () => {
    it('should handle very large numbers', () => {
      const largeNumber = Number.MAX_SAFE_INTEGER; // 9007199254740991
      expect(getSizeUnitFormat(largeNumber)).toMatch(/\d+(\.\d)? GB$/);
    });

    // If we want to handle negative numbers, we should add these tests
    // and update the function accordingly
    it('should handle negative values', () => {
      expect(() => getSizeUnitFormat(-1024)).toThrow();
      expect(() => getSizeUnitFormat(-1)).toThrow();
    });

    it('should handle non-integer values', () => {
      expect(getSizeUnitFormat(1024.5)).toBe('1.0 KB');
      expect(getSizeUnitFormat(1024.7)).toBe('1.0 KB');
    });

    it('should handle decimal points at unit boundaries', () => {
      expect(getSizeUnitFormat(1023.9)).toBe('1023.9 bytes');
      expect(getSizeUnitFormat(1024)).toBe('1 KB');
      expect(getSizeUnitFormat(1024 * 1024 - 0.1)).toBe('1024.0 KB');
      expect(getSizeUnitFormat(1024 * 1024)).toBe('1 MB');
    });
  });

  // Test input validation
  describe('when handling invalid inputs', () => {
    it('should handle NaN', () => {
      expect(() => getSizeUnitFormat(NaN)).toThrow();
    });

    it('should handle Infinity', () => {
      expect(() => getSizeUnitFormat(Infinity)).toThrow();
    });

    it('should handle undefined/null', () => {
      // @ts-expect-error: Testing invalid input
      expect(() => getSizeUnitFormat(undefined)).toThrow();
      // @ts-expect-error: Testing invalid input
      expect(() => getSizeUnitFormat(null)).toThrow();
    });
  });
});

describe('isImageMimeType', () => {
  it('should return true for valid image MIME types', () => {
    const validImageTypes = [
      'image/png',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ];

    validImageTypes.forEach((type) => {
      expect(isImageMimeType(type)).toBe(true);
    });
  });

  it('should return false for HEIF and HEIC image types', () => {
    expect(isImageMimeType(MimeTypes.HEIF)).toBe(false);
    expect(isImageMimeType(MimeTypes.HEIC)).toBe(false);
  });

  it('should return false for non-image MIME types', () => {
    const nonImageTypes = [
      'application/pdf',
      'text/plain',
      'video/mp4',
      'audio/mpeg',
      'application/json',
    ];

    nonImageTypes.forEach((type) => {
      expect(isImageMimeType(type)).toBe(false);
    });
  });

  it('should return false for invalid or malformed MIME types', () => {
    const invalidTypes = [
      '',
      'invalid',
      'image',
      '/jpeg',
      'images/jpeg',
      null,
      undefined,
      123,
      true,
      {},
      [],
    ];

    invalidTypes.forEach((type) => {
      // @ts-ignore: Testing invalid input
      expect(isImageMimeType(type)).toBe(false);
    });
  });
});
