import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { PanProps } from './types';

const Pan = forwardRef<HTMLInputElement, React.PropsWithChildren<PanProps>>(
  (
    {
      otpValidation = false,
      required = false,
      icon,
      onChange = () => {},
      displayModifier = undefined,
      displayDeModifier = undefined,
      validations = [
        {
          regex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
          errorMessage: 'Invalid PAN number',
        },
      ],
      subMessage = undefined,
      classes,
      value = '',
      label = '',
      readOnly = false,
      hideValidation = false,
      viewMode = false,
      ...props
    },
    ref,
  ) => {
    const panModifier = useCallback(
      (panValue: string) => panValue.toUpperCase(),
      [],
    );

    const panDeModifier = useCallback(
      (panValue: string) =>
        panValue.replace(/[a-z]/g, (match) => match.toUpperCase()),
      [],
    );

    const displayValueFunction = displayModifier || panModifier;

    const [displayValue, setDisplayValue] = useState(
      displayValueFunction(value),
    );

    useEffect(() => {
      setDisplayValue(displayValueFunction(value));
    }, [displayValueFunction, value]);

    const onInputChange = (PanValue, event, isValid, errors) => {
      const modifiedValue = displayValueFunction(PanValue);
      setDisplayValue(modifiedValue);
      onChange(
        displayDeModifier
          ? displayDeModifier(PanValue)
          : panDeModifier(PanValue),
        event,
        null,
        isValid,
        errors,
      );
    };

    return (
      <>
        <Input
          label={label}
          id="pan"
          placeholder="Enter PAN Number"
          required={required}
          type="text"
          onChange={onInputChange}
          validations={validations}
          subMessage={subMessage}
          classNames={classes}
          iconRight={icon}
          value={displayValue}
          ref={ref}
          data-test-id="pan-input"
          disabled={readOnly}
          hideValidation={hideValidation}
          maxLength={10}
          viewMode={viewMode}
          {...props}
        />
        {/* :TODO: implement i18 */}
        {otpValidation && (
          <div>logic for Pan validation needs to be implemented here</div>
        )}
      </>
    );
  },
);

export default Pan;
