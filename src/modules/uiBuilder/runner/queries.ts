/* eslint-disable @typescript-eslint/no-unused-vars */
import Logger from 'src/logger';
import { getModuleProps } from 'src/workspace/utils';

const log = new Logger('UiBuilder Runner Queries');

/* eslint-disable global-require */

// vadation onChange
// let start with mandatory based on required props this will set in runner -> payload -> valid: false

const extractFunctionBody = (code) => {
  if (!code) return '';
  const match = code.match(
    /\(data,?\s*formData?\)?\s*=>\s*(?:\{(?:[^{}]|\{[^{}]*\})*\}|[^;]+)/,
  );
  return match ? match[0] : code;
};

/**
 * Safely execute a query function
 * @param {string} logic - The query logic as a string
 * @param {any} data - Data to be passed to the function
 * @param {any} formData - Additional form data to be passed
 * @returns {any} - Result of the executed query
 */
export const executeQuery = (
  logic: string,
  data: any = null,
  formData: any = {},
) => {
  if (!logic) return null;

  try {
    const trimmedLogic = extractFunctionBody(logic).trim();
    if (!trimmedLogic) return null;

    // Handle arrow functions
    if (trimmedLogic.includes('=>')) {
      try {
        // eslint-disable-next-line no-eval
        const fn = eval(trimmedLogic);
        if (typeof fn !== 'function') return null;

        // Safely execute function and handle undefined params
        try {
          const result = fn(data, formData);
          return Number.isNaN(result) ? null : result;
        } catch {
          return null;
        }
      } catch {
        return null;
      }
    }

    // Handle other function formats
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function('data', 'formData', `return ${trimmedLogic}`);
      const result = fn(data, formData);
      return Number.isNaN(result) ? null : result;
    } catch {
      return null;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in query execution:', err);
    return null;
  }
};

const handleDataObjectPath = (formPath: string) => {
  switch (formPath) {
    case 'modules': {
      const modules = getModuleProps()?.getConfigModules?.();
      return Array.isArray(modules) && modules.length > 0
        ? modules
        : ['module1', 'module2'];
    }
    default:
      return [];
  }
};

const handleConfigPath = (props: any, formPath: string, config: any) => {
  if (props.query) {
    return executeQuery(props.query, config[formPath], config);
  }
  return config[formPath] !== undefined ? config[formPath] : '';
};

export const resolveProps = (props, config) => {
  if (typeof props !== 'object' || props === null) {
    return props;
  }

  if (Array.isArray(props)) {
    return props.map((item) => resolveProps(item, config));
  }

  if ('path' in props && typeof props.path === 'string') {
    const [bindType, formPath = ''] = props.path
      .replace(/[{}]/g, '')
      .split('__');

    if (bindType === 'dataObject') {
      return handleDataObjectPath(formPath);
    }
    return handleConfigPath(props, formPath, config);
  }

  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      resolveProps(value, config),
    ]),
  );
};

/**
 * Utility function to extract and update the config dynamically
 */
export const handleChange = ({
  value,
  event,
  additionalData,
  validValue,
  currentError,
  node,
  config,
  setConfig,
}) => {
  const { path = '', saveQuery } = node.data.value || {};

  let updatedValue = Array.isArray(value) ? value[0]?.value : value;

  // If `saveQuery` exists, execute it and handle errors
  if (saveQuery) {
    try {
      const transformedValue = executeQuery(saveQuery, updatedValue, config);
      if (transformedValue !== null) {
        updatedValue = transformedValue;
      }
    } catch (err) {
      // If saveQuery execution fails, retain original value
      log.error('Error executing saveQuery:', err);
    }
  }

  // Update the bound configuration property if `path` exists
  if (path) {
    const [bindType, formPath] = path.replace(/[{}]/g, '').split('__');
    if (formPath && bindType === 'formConfig') {
      setConfig({ ...config, [formPath]: updatedValue });
    }
  }

  return updatedValue;
};
