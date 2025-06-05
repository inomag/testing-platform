import { calculateTime, formatNumber, getTimeUnit } from './queries';

describe('Time Utility Functions', () => {
  describe('calculateTime', () => {
    it('should return all zeros for 0 seconds', () => {
      expect(calculateTime(0)).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it('should calculate seconds only correctly', () => {
      expect(calculateTime(45)).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 45,
      });
    });

    it('should calculate minutes and seconds correctly', () => {
      const result = calculateTime(185); // 3 minutes and 5 seconds
      expect(result).toEqual({
        hours: 0,
        minutes: 3,
        seconds: 5,
      });
    });

    it('should calculate hours, minutes, and seconds correctly', () => {
      const result = calculateTime(3725); // 1 hour, 2 minutes, 5 seconds
      expect(result).toEqual({
        hours: 1,
        minutes: 2,
        seconds: 5,
      });
    });

    it('should handle exact hours correctly', () => {
      const result = calculateTime(7200); // Exactly 2 hours
      expect(result).toEqual({
        hours: 2,
        minutes: 0,
        seconds: 0,
      });
    });

    it('should handle exact minutes correctly', () => {
      const result = calculateTime(120); // Exactly 2 minutes
      expect(result).toEqual({
        hours: 0,
        minutes: 2,
        seconds: 0,
      });
    });

    it('should handle large numbers correctly', () => {
      const result = calculateTime(86399); // 23:59:59
      expect(result).toEqual({
        hours: 23,
        minutes: 59,
        seconds: 59,
      });
    });
  });

  describe('formatNumber', () => {
    it('should format single digits with leading zero', () => {
      expect(formatNumber(0)).toBe('00');
      expect(formatNumber(1)).toBe('01');
      expect(formatNumber(9)).toBe('09');
    });

    it('should keep double digits as is', () => {
      expect(formatNumber(10)).toBe('10');
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(99)).toBe('99');
    });

    it('should handle numbers over 99 without padding', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('getTimeUnit', () => {
    it('should return "hrs" when hours are present', () => {
      expect(getTimeUnit(1, 0)).toBe('hrs');
      expect(getTimeUnit(1, 30)).toBe('hrs');
      expect(getTimeUnit(24, 0)).toBe('hrs');
    });

    it('should return "mins" when only minutes are present', () => {
      expect(getTimeUnit(0, 1)).toBe('mins');
      expect(getTimeUnit(0, 30)).toBe('mins');
      expect(getTimeUnit(0, 59)).toBe('mins');
    });

    it('should return "secs" when no hours or minutes', () => {
      expect(getTimeUnit(0, 0)).toBe('secs');
    });

    // Multiple test cases for same scenarios with different values
    it('should consistently return correct unit based on priority', () => {
      // Hours take precedence over minutes
      expect(getTimeUnit(2, 15)).toBe('hrs');
      expect(getTimeUnit(1, 59)).toBe('hrs');

      // Minutes take precedence over seconds
      expect(getTimeUnit(0, 1)).toBe('mins');
      expect(getTimeUnit(0, 30)).toBe('mins');
    });
  });

  describe('Integration of all functions', () => {
    it('should work together for time formatting', () => {
      const time = calculateTime(3665); // 1 hour, 1 minute, 5 seconds
      const { hours, minutes, seconds } = time;

      expect(formatNumber(hours)).toBe('01');
      expect(formatNumber(minutes)).toBe('01');
      expect(formatNumber(seconds)).toBe('05');
      expect(getTimeUnit(hours, minutes)).toBe('hrs');
    });

    it('should work together for minutes-only case', () => {
      const time = calculateTime(185); // 3 minutes, 5 seconds
      const { hours, minutes, seconds } = time;

      expect(formatNumber(hours)).toBe('00');
      expect(formatNumber(minutes)).toBe('03');
      expect(formatNumber(seconds)).toBe('05');
      expect(getTimeUnit(hours, minutes)).toBe('mins');
    });

    it('should work together for seconds-only case', () => {
      const time = calculateTime(45); // 45 seconds
      const { hours, minutes, seconds } = time;

      expect(formatNumber(hours)).toBe('00');
      expect(formatNumber(minutes)).toBe('00');
      expect(formatNumber(seconds)).toBe('45');
      expect(getTimeUnit(hours, minutes)).toBe('secs');
    });
  });
});
