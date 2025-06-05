import { convertTo24HourFormat, extractTimeFormat } from './queries';

describe('src/@vymo/ui/blocks/dateTime/dateTimeRangePicker/queries.ts', () => {
  describe('extractTimeFormat', () => {
    it('should extract hh:mm a format from MMMM d, yyyy hh:mm a', () => {
      const formatString = 'MMMM d, yyyy hh:mm a';
      expect(extractTimeFormat(formatString)).toEqual('hh:mm a');
    });

    it('should extract hh:mm a format from MM dd, yyyy hh:mm a', () => {
      const formatString = 'MM dd, yyyy hh:mm a';
      expect(extractTimeFormat(formatString)).toEqual('hh:mm a');
    });

    it('should extract HH:mm format from MMM dd, yy HH:mm', () => {
      const formatString = 'MMM dd, yy HH:mm';
      expect(extractTimeFormat(formatString)).toEqual('HH:mm');
    });

    it('should extract h:mm aa format from MMMM d, yyyy h:mm aa', () => {
      const formatString = 'MMMM d, yyyy h:mm aa';
      expect(extractTimeFormat(formatString)).toEqual('h:mm aa');
    });
  });

  describe('convertTo24HourFormat', () => {
    it('should convert a valid 12-hour time to 24-hour format', () => {
      const timeString = '4:30 AM';
      const format = 'hh:mm a';
      const result = convertTo24HourFormat(timeString, format);
      expect(result).toEqual('04:30');
    });

    it('should return empty input if timeString is empty', () => {
      const timeString = '';
      const format = 'hh:mm a';
      const result = convertTo24HourFormat(timeString, format);
      expect(result).toBe('');
    });

    it('should handle midnight correctly (12:00 AM)', () => {
      const timeString = '12:00 AM';
      const format = 'hh:mm a';
      const result = convertTo24HourFormat(timeString, format);
      expect(result).toBe('00:00');
    });

    it('should handle noon correctly (12:00 PM)', () => {
      const timeString = '12:00 PM';
      const format = 'hh:mm a';
      const result = convertTo24HourFormat(timeString, format);
      expect(result).toBe('12:00');
    });

    it('should correctly handle edge case of 11:59 PM', () => {
      const timeString = '11:59 PM';
      const format = 'hh:mm a';
      const result = convertTo24HourFormat(timeString, format);
      expect(result).toBe('23:59');
    });
  });
});
