import { findLastIndex } from 'lodash';

export const getInputFromChildren = (
  inputRef: React.RefObject<HTMLDivElement>,
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

// Function to focus the previous input based on conditions
export const focusPreviousInput = (
  inputVal: string,
  index: number,
  event:
    | React.KeyboardEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLInputElement>,
  mPin: string[],
  inputRefs: React.RefObject<HTMLDivElement>,
) => {
  if (inputVal === '' && index > 0 && event.type !== 'blur') {
    const lastIndex = Math.max(
      0,
      findLastIndex(mPin, (item) => item !== '', index) - 1,
    );
    const prevInput = getInputFromChildren(inputRefs, lastIndex);
    if (prevInput) {
      prevInput.focus();
      prevInput.select(); // Select the previous input as well
      return true; // Indicates that previous input is focused
    }
  }
  return false; // No previous input focused
};

// Function to handle focus on the next input if necessary
export const focusNextInput = (
  inputVal: string,
  index: number,
  numOfBoxes: number,
  event: React.ChangeEvent<HTMLInputElement>,
  inputRefs: React.RefObject<HTMLDivElement>,
) => {
  if (index < numOfBoxes - 1 && inputVal !== '' && event.type !== 'blur') {
    const nextInput = getInputFromChildren(inputRefs, index + 1);
    nextInput?.focus();
  }
};

// Function to handle multi-character input spread across multiple boxes
export const handleMultiCharacterInput = (
  inputVal: string,
  index: number,
  mPinCopy: string[],
  numOfBoxes: number,
  inputRefs: React.RefObject<HTMLDivElement>,
) => {
  if (inputVal.length > 1) {
    for (let i = index; i < index + inputVal.length; i++) {
      if (i < numOfBoxes) {
        mPinCopy[i] = inputVal[i - index];
        const input = getInputFromChildren(inputRefs, i);
        if (input) {
          input.value = inputVal[i - index];
        }
      }
    }
  } else {
    mPinCopy[index] = inputVal;
  }
};

// Function to handle non-numeric characters
export const checkInvalidInput = (inputVal: string) =>
  !/^[0-9]*$/.test(inputVal);
