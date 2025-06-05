import React, { useCallback } from 'react';
import { Select } from 'src/@vymo/ui/atoms';
import { countryCodes } from './queries';
import { CountryCodeDropdownProps } from './types';

// https://github.com/google/libphonenumber

// use lib for now to validate ph number of respective country
function CountryCodeDropdown({
  onCodeChange,
  selectedCode,
  'data-test-id': dataTestId,
}: CountryCodeDropdownProps) {
  const onChange = useCallback(
    (code) => {
      onCodeChange(code[0]);
    },
    [onCodeChange],
  );

  return (
    <Select
      data-test-id={dataTestId}
      options={countryCodes}
      value={selectedCode}
      onChange={onChange}
    />
  );
}

export default CountryCodeDropdown;
