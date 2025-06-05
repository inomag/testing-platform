const functionDoc = {
  IS_EMPTY: {
    description: 'Check if the input is empty',
    example: 'IS_EMPTY(variable)',
  },
  IS_NOT_EMPTY: {
    description: 'Check if the input is not empty',
    example: 'IS_NOT_EMPTY(variable)',
  },
  NOT: {
    description: 'Negate the input',
    example: 'NOT(variable)',
  },
  INTEGER_TO_WORD: {
    description: 'Convert an integer to words',
    example: 'INTEGER_TO_WORD(variable)',
  },

  REPLACE: {
    description: 'Replace a substring with another substring',
    example: 'REPLACE(variable, "old", "new")',
  },
  FLOOR: {
    description: 'Round a number down to the nearest integer',
    example: 'FLOOR(variable)',
  },
  CEIL: {
    description: 'Round a number up to the nearest integer',
    example: 'CEIL(variable)',
  },
  ROUND: {
    description: 'Round a number to the nearest integer',
    example: 'ROUND(variable)',
  },
  IS: {
    description: 'Check if two values are equal',
    example: 'IS(variable1, variable2)',
  },
  SUM: {
    description: 'Add two or more numbers',
    example: 'SUM(variable1, variable2, variable3)',
  },
  EQUALS: {
    description: 'Check if two values are equal',
    example: 'EQUALS(variable1, variable2)',
  },
  NE: {
    description: 'Check if two values are not equal',
    example: 'NE(variable1, variable2)',
  },
  AND: {
    description: 'Check if all inputs are true',
    example: 'AND(variable1, variable2, variable3)',
  },
  GT: {
    description: 'Check if the first value is greater than the second value',
    example: 'GT(variable1, variable2)',
  },
  EQUALS_IGNORE_CASE: {
    description: 'Check if two values are equal, ignoring case',
    example: 'EQUALS_IGNORE_CASE(variable1, variable2)',
  },
  EQ: {
    description: 'Check if two values are equal',
    example: 'EQ(variable1, variable2)',
  },
  OR: {
    description: 'Check if any input is true',
    example: 'OR(variable1, variable2, variable3)',
  },
  CONCAT: {
    description: 'Concatenate two or more strings',
    example: 'CONCAT(variable1, variable2, variable3)',
  },
  IF: {
    description:
      'Return one value if the condition is true, otherwise return another value',
    example: 'IF(condition, value1, value2)',
  },
  MULTIPLY: {
    description: 'Multiply two or more numbers',
    example: 'MULTIPLY(variable1, variable2, variable3)',
  },
  DIVIDE: {
    description: 'Divide the first value by the second value',
    example: 'DIVIDE(variable1, variable2)',
  },
  LT: {
    description: 'Check if the first value is less than the second value',
    example: 'LT(variable1, variable2)',
  },
  LTE: {
    description:
      'Check if the first value is less than or equal to the second value',
    example: 'LTE(variable1, variable2)',
  },
  GTE: {
    description:
      'Check if the first value is greater than or equal to the second value',
    example: 'GTE(variable1, variable2)',
  },
  NOT_EQUALS: {
    description: 'Check if two values are not equal',
    example: 'NOT_EQUALS(variable1, variable2)',
  },
  TRANSACTION_NUMBER: {
    description: 'Generates a variable length transaction number',
    example: 'TRANSACTION_NUMBER(variable)',
  },
  IN: {
    description: 'Check if the first value is in the list of values',
    example: 'IN(variable1, variable2)',
  },
  COMPUTE_YEARS_ELAPSED: {
    description: 'Compute the years elapsed for a date from today',
    example: 'COMPUTE_YEARS_ELAPSED(variable1)',
  },
};

export const standardFunctions = {
  ...[
    { name: 'IS_EMPTY', returnType: 'bool' },
    { name: 'IS_NOT_EMPTY', returnType: 'bool' },
    { name: 'NOT', returnType: 'bool' },
    { name: 'INTEGER_TO_WORD', returnType: 'text' },
    { name: 'POWER', returnType: 'number' },
    { name: 'STARTS_WITH', returnType: 'bool' },
    { name: 'ENDS_WITH', returnType: 'bool' },
    { name: 'DAY_OF_MONTH', returnType: 'number' },
    { name: 'HOUR_OF_DAY', returnType: 'number' },
    { name: 'MONTH_OF_YEAR', returnType: 'number' },
    { name: 'YEAR', returnType: 'number' },
    { name: 'WEEKDAY', returnType: 'number' },
    { name: 'DATE_DIFF', returnType: 'number' },
    { name: 'DATE_ADD', returnType: 'text' },
    { name: 'DATE_SUB', returnType: 'text' },
    { name: 'REPLACE', returnType: 'text' },
    { name: 'FLOOR', returnType: 'number' },
    { name: 'CEIL', returnType: 'number' },
    { name: 'ROUND', returnType: 'number' },
    { name: 'ABS', returnType: 'number' },
    { name: 'SQRT', returnType: 'number' },
    { name: 'LEN', returnType: 'number' },
    { name: 'IS_NOT_NULL', returnType: 'bool' },
    { name: 'IS_NULL', returnType: 'bool' },
    { name: 'TRIM', returnType: 'text' },
    { name: 'IS', returnType: 'text' },
    { name: 'TO_STRING', returnType: 'text' },
  ].reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.name]: {
        args: 1,
        doc: functionDoc[currentValue.name],
        returnType: currentValue.returnType,
      },
    }),
    {},
  ),
  ...[
    { name: 'SUM', returnType: 'number' },
    { name: 'EQUALS', returnType: 'bool' },
    { name: 'NE', returnType: 'bool' },
    { name: 'AND', returnType: 'bool' },
    { name: 'GT', returnType: 'bool' },
    { name: 'MIN', returnType: 'number' },
    { name: 'MAX', returnType: 'number' },
    { name: 'EQUALS_IGNORE_CASE', returnType: 'bool' },
    { name: 'EQ', returnType: 'bool' },
    { name: 'OR', returnType: 'bool' },
    { name: 'CONCAT', returnType: 'text' },
    { name: 'IF', returnType: 'text' },
    { name: 'MULTIPLY', returnType: 'number' },
    { name: 'DIVIDE', returnType: 'number' },
  ].reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.name]: {
        args: null,
        minArgs: 2,
        doc: functionDoc[currentValue.name],
        returnType: currentValue.returnType,
      },
    }),
    {},
  ),
  ...[
    { name: 'LT', returnType: 'bool' },
    { name: 'LTE', returnType: 'bool' },
    { name: 'GTE', returnType: 'bool' },
    { name: 'GT', returnType: 'bool' },
    { name: 'NOT_EQUALS', returnType: 'bool' },
  ].reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.name]: {
        args: 2,
        doc: functionDoc[currentValue.name],
        returnType: currentValue.returnType,
      },
    }),
    {},
  ),
};

export const valTypes = {
  ...[
    'vo-assignee',
    'vo-creator',
    'task-assignee',
    'task-participant',
    'task-creator',
    'session',
    'form',
  ].reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue]: {
        params: 2,
        args: ['attribute', 'inputField'],
      },
    }),
    {},
  ),
  variable: {
    params: 1,
    args: ['variable'],
  },
  static: {
    params: 2,
    args: ['dataType', 'value'],
  },
  function: {
    params: 2,
    args: ['type', 'inputs'],
  },
  'vo-referral': {
    params: 3,
    args: ['voId', 'attribute', 'inputField'],
  },
  'bo-referral': {
    params: 1,
    args: ['boId'],
  },
  'task-vos': {
    params: 1,
    args: ['voId'],
  },
  vo: {
    params: 1,
    args: ['voId'],
  },
};
