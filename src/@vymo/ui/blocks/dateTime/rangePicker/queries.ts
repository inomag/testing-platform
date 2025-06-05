import { format as formatDate, parse } from 'date-fns';

export const extractTimeFormat = (formatString) => {
  const timePattern = /\b(HH:mm|hh:mm\s[a][a]?|h:mm\s[a][a]?)\b/g;

  const match = formatString.match(timePattern);
  return match ? match[0] : null;
};

export const convertToFormat = (timeString, format) => {
  if (timeString) {
    const date = parse(timeString, 'HH:mm', new Date());
    return formatDate(date, format as string);
  }
  return timeString;
};

export const convertTo24HourFormat = (timeString, format) => {
  if (timeString) {
    const date = parse(timeString, format, new Date());
    return formatDate(date, 'HH:mm' as string);
  }
  return timeString;
};
