export const getInputFromChildren = (
  inputRef: React.RefObject<HTMLElement>,
  index: number,
): HTMLInputElement | null => {
  if (!inputRef || !inputRef.current || !inputRef.current.children[index]) {
    return null;
  }

  const input = inputRef.current.children[index].querySelector(
    'input',
  ) as HTMLInputElement | null;
  return input;
};

export const convertSecondsToMinutes = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min ${remainingSeconds} seconds`;
};
