import React, { useCallback } from 'react';
import Location from 'src/@vymo/ui/blocks/location';
import { useFormContext } from '../formProvider';

type Props = {
  value: string;
  code: string;
  disabled: boolean;
  onChange: (arg0, arg1, arg2?) => void;
  isDebug?: boolean;
  hint?: string;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};

function LocationAdapter({
  value = '{}',
  code,
  disabled,
  onChange,
  isDebug,
  hint,
  viewMode = false,
  ...props
}: Props) {
  const { setDebugMessage } = useFormContext(false);
  const parsedValue = JSON.parse(value);

  const onLocationChange = useCallback(
    (selectedLocation, event, additionalData) => {
      const onChangeValue = JSON.stringify(selectedLocation);
      if (isDebug) {
        setDebugMessage({
          messageKey: `${hint} onChange`,
          data: {
            'Selected Value': selectedLocation,
            'On Change Value': onChangeValue,
          },
        });
      }
      onChange(onChangeValue, event, additionalData);
    },
    [onChange, isDebug, setDebugMessage, hint],
  );

  return (
    <Location
      onChange={onLocationChange}
      value={parsedValue}
      disabled={disabled || code === 'check_in'}
      type={code}
      viewMode={viewMode}
      {...props}
    />
  );
}

export default LocationAdapter;
