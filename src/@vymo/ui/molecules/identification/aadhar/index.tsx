import React, { forwardRef, useCallback, useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { AadharProps } from './types';

const Aadhar = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<AadharProps>
>(
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
          regex: /^(\d{4}-){2}\d{4}$|^\d{12}$/,
          errorMessage: 'Invalid Aadhar Number',
        },
      ],
      'data-test-id': dataTestId,
      readOnly = false,
      value = '',
      viewMode = false,
      ...props
    },
    ref,
  ) => {
    const aadharModifier = useCallback((aadharValue: string) => {
      const formattedValue = aadharValue.replace(/(\d{4})(?=\d)/g, '$1-');
      return formattedValue;
    }, []);

    const aadharDeModifier = useCallback((aadharValue: string) => {
      const aadharWithoutHyphen = aadharValue.replace(/[ -]/g, '');
      return aadharWithoutHyphen;
    }, []);

    const displayValueFunction = displayModifier || aadharModifier;

    const [displayValue, setDisplayValue] = useState(
      displayValueFunction(value),
    );

    const onInputChange = (aadharValue, event, isValid, errors) => {
      onChange(
        displayDeModifier
          ? displayDeModifier(aadharValue)
          : aadharDeModifier(aadharValue),
        event,
        null,
        isValid,
        errors,
      );
      const modifiedValue = displayValueFunction(aadharValue);
      setDisplayValue(modifiedValue);
    };

    return (
      <>
        <Input
          id="aadhar"
          placeholder="Enter Aadhar number"
          required={required}
          type="text"
          onChange={onInputChange}
          validations={validations}
          data-test-id={dataTestId}
          iconRight={icon}
          value={displayValue}
          ref={ref}
          disabled={readOnly}
          viewMode={viewMode}
          {...props}
        />
        {/* :TODO: implement i18 */}
        {otpValidation && (
          <div>logic for aadhar validation needs to be implemented here</div>
        )}
      </>
    );
  },
);

export default Aadhar;
