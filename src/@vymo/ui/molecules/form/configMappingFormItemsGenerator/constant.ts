export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const REGEX_CHARACTER = /^[A-Za-z]*$/;
// regex to find if a given input is a string built up of special character or not
export const REGEX_SPECIAL_CHARACTER = /^[[!@#$%^&*(),.?":{}|<>]]*$/;
export const REGEX_PHONE = /^(\+?\d{2}\)?[-. ]?\d+)$/;
export const REGEX_DECIMAL = /^\d+(\.\d{1,3})?$/; // optional decimal points ??
export const REGEX_PAN = /^([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1})$/;
export const REGEX_AADHAR = /^(\d{4}-){2}\d{4}$|^\d{12}$/;
