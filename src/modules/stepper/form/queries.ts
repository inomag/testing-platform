export const getDefaultValues = (values) =>
  Object.entries(values).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = { value, code: key };
    }
    return acc;
  }, {});
