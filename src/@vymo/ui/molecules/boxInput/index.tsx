import React, { useCallback, useRef, useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import Text from 'src/@vymo/ui/atoms/text';
import {
  checkInvalidInput,
  focusNextInput,
  focusPreviousInput,
  getInputFromChildren,
  handleMultiCharacterInput,
} from './queries';
import { BoxInputInputProps } from './types';
import styles from './index.module.scss';

function BoxInput({
  onChange,
  numOfBoxes,
  error,
  'data-test-id': dataTestId,
  value,
  label = 'Enter MPIN',
}: BoxInputInputProps) {
  const [mPin, setMPin] = useState(value);
  const inputRefs = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (inputVal: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(
        (event?.currentTarget as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );
      const mPinCopy = [...mPin];

      // Check if backspace is pressed in an empty input and move focus to the previous box
      focusPreviousInput(inputVal, index, event, mPin, inputRefs);

      // If input contains non-numeric characters, return early
      if (checkInvalidInput(inputVal)) {
        return;
      }

      // Focus on the next input if applicable
      focusNextInput(inputVal, index, numOfBoxes, event, inputRefs);

      // Handle multi-character input
      handleMultiCharacterInput(
        inputVal,
        index,
        mPinCopy,
        numOfBoxes,
        inputRefs,
      );

      // Update mPin state and trigger onChange
      setMPin(mPinCopy);
      onChange(mPinCopy, event);
    },
    [numOfBoxes, mPin, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const index = parseInt(
        (event?.target as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );
      if (event?.key === 'Backspace' && mPin[index] === '') {
        // Move focus to previous input on backspace if current input is empty
        event.preventDefault();
        if (index > 0) {
          const prevInput = getInputFromChildren(inputRefs, index - 1);
          prevInput?.focus();
          prevInput?.select();
        }
      }
      if (event?.key === 'ArrowRight' && index < mPin.length - 1) {
        event.preventDefault();
        const nextInput = getInputFromChildren(inputRefs, index + 1);
        nextInput?.focus();
        nextInput?.select();
      }
      if (event?.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        const prevInput = getInputFromChildren(inputRefs, index - 1);
        prevInput?.focus();
        prevInput?.select();
      }
    },
    [mPin],
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pasteData = event.clipboardData
        .getData('Text')
        .slice(0, numOfBoxes);
      const otpCopy = [...mPin];
      const index = parseInt(
        (event?.currentTarget as HTMLElement)?.getAttribute('data-index') ?? '',
        10,
      );

      // Distribute the pasted data across input fields
      pasteData.split('').forEach((char, i) => {
        if (index + i < numOfBoxes) {
          otpCopy[index + i] = char;
          const nextInput = getInputFromChildren(inputRefs, index + i);
          nextInput?.focus();
        }
      });

      onChange(otpCopy, event);
      event.preventDefault();
    },
    [numOfBoxes, mPin, onChange],
  );

  const displayModifier = useCallback((inputValue: string) => {
    if (!/^[0-9]*$/.test(inputValue)) {
      return '';
    }
    return inputValue;
  }, []);

  return (
    <div className={styles.mpin__container} data-test-id={dataTestId}>
      {/* :TODO: implement i18 */}
      <div>
        <Text
          classNames={[
            styles.enter_mpin_text,
            styles.enter_mpin_text__required,
          ]}
        >
          {label}
        </Text>
        <div ref={inputRefs as any} className={styles.box__container}>
          {Array.from({ length: numOfBoxes }, (_, i) => (
            <Input
              type="number"
              secureValue
              showSecureValueIcon={false}
              key={i}
              classNames={`${styles.mpin__box} ${error ? styles.error : ''}`}
              value={mPin[i]}
              onChange={handleInputChange}
              data-test-id={`${dataTestId}-input-${i}`}
              data-index={i}
              clearInputIcon={false}
              maxLength={1}
              displayModifier={displayModifier}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error && (
          <Text
            type="label"
            variant="error"
            data-test-id={`${dataTestId}-error`}
            classNames={styles.mpin__error}
          >
            {error}
          </Text>
        )}
      </div>
    </div>
  );
}

export default React.memo(BoxInput);
