import { convertSecondsToMinutes, getInputFromChildren } from './queries';

describe('src/components/otp/queries.tsx', () => {
  describe('getInputFromChildren', () => {
    it('should return the input element at the specified index', () => {
      const inputRef: any = {
        current: {
          children: [
            {
              querySelector: jest.fn().mockReturnValue(null),
            },
            {
              querySelector: jest.fn().mockReturnValue({
                tagName: 'INPUT',
              }),
            },
          ],
        },
      };

      const input = getInputFromChildren(inputRef, 1);
      expect(input?.tagName).toBe('INPUT');
    });

    it('should return null if the input element is not found', () => {
      const inputRef: any = {
        current: {
          children: [
            {
              querySelector: jest.fn().mockReturnValue(null),
            },
            {
              querySelector: jest.fn().mockReturnValue(null),
            },
          ],
        },
      };

      const input = getInputFromChildren(inputRef, 1);
      expect(input).toBeNull();
    });

    it('should return null if the inputRef is null', () => {
      const inputRef = {
        current: null,
      };

      const input = getInputFromChildren(inputRef, 1);
      expect(input).toBeNull();
    });
  });

  describe('convertSecondsToMinutes', () => {
    it('should return correct result for 40 seconds', () => {
      const result = convertSecondsToMinutes(40);
      expect(result).toEqual('40 seconds');
    });

    it('should return correct result for 72 seconds', () => {
      const result = convertSecondsToMinutes(72);
      expect(result).toEqual('1 min 12 seconds');
    });

    it('should return correct result for 122 seconds', () => {
      const result = convertSecondsToMinutes(122);
      expect(result).toEqual('2 min 2 seconds');
    });

    it('should return correct result for 240 seconds', () => {
      const result = convertSecondsToMinutes(240);
      expect(result).toEqual('4 min 0 seconds');
    });
  });
});
