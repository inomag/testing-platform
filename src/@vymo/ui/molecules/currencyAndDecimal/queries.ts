import _ from 'lodash';

export const getSeparatorAndDecimalUsingLocale = (locale) => ({
  group: new Intl.NumberFormat(locale).format(1111).replace(/1/g, ''),
  decimal: new Intl.NumberFormat(locale).format(1.1).replace(/1/g, ''),
});

export const reverseIntl = (value, locale) => {
  if (!value) {
    return '';
  }
  const { group, decimal } = getSeparatorAndDecimalUsingLocale(locale);
  let reversedVal = String(value).replace(new RegExp(`\\${group}`, 'g'), '');
  reversedVal = reversedVal.replace(new RegExp(`\\${decimal}`, 'g'), '.');
  return Number.isNaN(reversedVal) ? 0 : reversedVal;
};

export const convertValueFromI18nToNative = (value, nativeLocale) => {
  const { group, decimal } = getSeparatorAndDecimalUsingLocale(nativeLocale);
  let reversedVal = String(value).replace(new RegExp(`\\${','}`, 'g'), group);
  reversedVal = reversedVal.replace(new RegExp(`\\${'.'}`, 'g'), decimal);
  return reversedVal;
};

export const formatCurrency = (value, locale) => {
  const { decimal } = getSeparatorAndDecimalUsingLocale(locale);
  if (
    !value ||
    (value[value.length - 1] === decimal && value[value.length - 2] === decimal)
  ) {
    return value;
  }
  if (value[value.length - 1] === decimal) {
    return value;
  }
  const val = value.replace(/[A-Za-z!@#$%^&*()<>?;'{}]/g, '');
  const formattedValue = new Intl.NumberFormat(locale, {
    minimumFractionDigits: val.includes(decimal)
      ? _.min([5, val.split(decimal)[1].length])
      : 0,
    maximumFractionDigits: 5,
  }).format(Number(reverseIntl(val, locale)));
  return formattedValue === 'NaN' ? '' : formattedValue;
};
