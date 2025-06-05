export const parseDateFormatToDateFns = (dateTime: string = '') =>
  dateTime
    .replace('DD', 'dd')
    .replaceAll('YY', 'yy')
    .replaceAll('h:mm', 'hh:mm');
