export const REGEX_DECIMAL = /^\d+(\.\d{1,3})?$/;
export const decimalValidation = [
  {
    regex: REGEX_DECIMAL,
    errorMessage: 'This is not a valid decimal number',
  },
];
