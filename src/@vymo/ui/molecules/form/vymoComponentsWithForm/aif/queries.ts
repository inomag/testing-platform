export function generateRandomCode() {
  return Math.random().toString(36).substring(3);
}

export const getConfigToAppend = (groupFields, groupTitle, code) => {
  const generatedCode = generateRandomCode();
  const inputFieldsForAif = groupFields.map((input) => ({
    ...input,
    code: `${code}_${generatedCode}_${input.code}`,
  }));
  const configAppend = [
    {
      type: 'group',
      parentCode: code,
      code: `${code}_${generatedCode}`,
      groupTitle: `${groupTitle}`,
      children: inputFieldsForAif,
    },
  ];

  return configAppend;
};
