/* eslint-disable complexity */
import { isEmpty } from 'lodash';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { standardFunctions, valTypes } from './constants';

const advanceTokenStream = (tokenStream) => {
  const { done, value } = tokenStream.iter.next();
  tokenStream.ended = done;
  tokenStream.next = value;
};

const parseID = (tokenStream) => {
  if (tokenStream.ended) return null;
  const [, id] = tokenStream.next;
  if (id === null) return null;

  advanceTokenStream(tokenStream);
  return id;
};

const parseDelim = (tokenStream, target) => {
  if (tokenStream.ended) return null;
  const [, , delim] = tokenStream.next;
  if (delim === null || delim !== target) return null;
  advanceTokenStream(tokenStream);
  return delim;
};

// eslint-disable-next-line max-lines-per-function
const parseExpr = (tokenStream, functionArgValidation = true) => {
  const id = parseID(tokenStream);
  if (!id) return null;
  const isFn = parseDelim(tokenStream, '(');
  if (isFn) {
    if (!standardFunctions[id]) {
      return { error: locale(Keys.ERROR_FUNCTION_INVALID, { id }) };
    }
    const args = [];
    while (!parseDelim(tokenStream, ')')) {
      if (args.length > 0) {
        if (!parseDelim(tokenStream, ',')) return null;
      }
      const expr = parseExpr(tokenStream, functionArgValidation);
      if (!expr) return null;
      // @ts-ignore
      args.push(expr);
    }
    const functionParams = standardFunctions[id];
    if (
      functionArgValidation && functionParams.args
        ? args.length !== functionParams.args
        : args.length < functionParams.minArgs
    ) {
      return {
        error: locale(Keys.ERROR_FUNCTION_ARGUMENTS_EXPECTED, {
          id,
          args: functionParams.args
            ? functionParams.args
            : functionParams.minArgs,
        }),
      };
    }
    return {
      type: 'value',
      value: {
        valType: 'function',
        function: {
          type: 'standard',
          standardFunction: id,
          inputs: args,
          output: null,
          returnType: functionParams.returnType,
        },
      },
    };
  }
  const params = id.split('>');
  const valTypeData = !isEmpty(params) ? valTypes[params[0]] : null;
  const valType = params.shift();
  // eslint-disable-next-line consistent-return
  params.forEach((item, index) => {
    if (isEmpty(item) && !isEmpty(valTypeData)) {
      return {
        error: locale(Keys.ERROR_ARGUMENT_EMPTY_AT_TYPE, {
          arg: valTypeData.args[index],
          type: valType,
        }),
      };
    }
  });
  if (valTypeData) {
    if (valTypeData.params !== params.length) {
      return {
        error: locale(Keys.ERROR_INVALID_QUERY_LENGTH_NEAR_PARAM, {
          param: params[0],
          expectedLength: valTypeData.params,
        }),
      };
    }
  } else {
    return {
      error: locale(Keys.ERROR_INVALID_QUERY_NEAR_ID, { id }),
    };
  }
  return {
    type: 'value',
    value: {
      valType,
      ...valTypeData.args.reduce(
        (accumulator, currentValue, index) => ({
          ...accumulator,
          [currentValue]: params[index],
        }),
        {},
      ),
    },
  };
};

export const parse = (string, functionArgValidation = true) => {
  const formattedString = string.replace(/\s/g, '');
  if (
    // This regex defines the rule query format with proper brackets and format
    !/^(?:[a-zA-Z0-9!@#$%^&*_+\-=[\]{};':"\\|,.<>/?]+|[(),])*$/.test(
      formattedString,
    )
  ) {
    return { error: locale(Keys.TOKENIZATION_ERROR) };
  }

  const tokenStream = {
    iter: formattedString.matchAll(
      // This regex defines the rule query format with proper brackets
      /(?:([a-zA-Z0-9!@#$%^&*_+\-=[\]{};':"\\|.<>/?]+)|([(),]))/gy,
    ),
    ended: false,
  };
  advanceTokenStream(tokenStream);

  const res = parseExpr(tokenStream, functionArgValidation);
  if (res?.error) {
    return res;
  }

  if (!tokenStream.ended) {
    return {
      error: locale(Keys.EXTRA_CHARACTERS_FOUND),
    };
  }
  return res;
};

const getValueType = (value) => {
  let str = '';
  str = `${str}${value.valType}>`;
  valTypes[value.valType].args.forEach((s, i) => {
    str = `${str}${value[s]}${
      valTypes[value.valType].args.length === i + 1 ? '' : '>'
    }`;
  });
  return str;
};

export const transformJsonToQuery = (json) => {
  const jsonData: any = json;
  let queryString = '';
  if (jsonData.expression) {
    queryString = `${queryString}${
      jsonData.expression?.valType === 'function'
        ? jsonData?.expression?.function?.standardFunction
        : jsonData?.expression?.standardFunction
    }(`;
  }

  const map =
    jsonData.expression?.inputs || jsonData.expression?.function?.inputs || [];

  map.forEach((item, index) => {
    if (item.value.valType === 'function') {
      const childData = `${transformJsonToQuery(item.value)}`;
      queryString = `${queryString}${
        item.value.function.standardFunction
      }(${childData}${index + 1 === map.length ? ')' : ','}`;
    } else {
      queryString = `${queryString + getValueType(item.value)}${
        index + 1 === map.length ? ')' : ','
      }`;
    }
  });
  return queryString;
};

export const transformInitialData = (value) => {
  const query = transformJsonToQuery({ expression: value });
  const res: any = parse(query) || {};
  return { ...res, query };
};
