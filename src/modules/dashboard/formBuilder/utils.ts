export const generateRandomCode = () =>
  Math.random().toString(36).substring(2, 8);

export const generateRandomHint = (fieldName: string) => {
  // Generate two random uppercase letters
  const randomUppercase = String.fromCharCode(
    65 + Math.floor(Math.random() * 26),
    65 + Math.floor(Math.random() * 26),
  );
  return `Sample ${fieldName} ${randomUppercase}`;
};
