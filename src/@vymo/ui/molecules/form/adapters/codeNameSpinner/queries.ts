export const getValueForSelect = (
  value,
  returnCode,
  options: Array<{ code: string; name: string }>,
) => {
  if (returnCode) {
    return value;
  }
  return options.find(({ name }) => name === value)?.code;
};
