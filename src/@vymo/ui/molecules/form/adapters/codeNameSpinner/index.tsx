import React, { useCallback } from 'react';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import RadioGroupAdapter from '../radioAdapter';
import { getValueForSelect } from './queries';
import type { Props } from './types';

function CodeNameSpinner({
  value,
  disabled,
  onChange,
  placeholder,
  options = [],
  type,
  returnCode,
  loading,
  viewMode = false,
  ...props
}: Props & FormContextProps) {
  value = getValueForSelect(value, returnCode, options) || value;

  const onSelectChange = useCallback(
    (selectedOptions, event) => {
      let additionalData;
      const { code, name } = selectedOptions[0] ?? {};
      if (type === 'code_name_spinner') {
        additionalData = { data: { code } };
        onChange(returnCode ? code : name, event, additionalData);
      } else {
        onChange(code, event);
      }
    },
    [onChange, returnCode, type],
  );

  return (
    // @ts-ignore
    <RadioGroupAdapter
      value={Array.isArray(value) ? value?.[0] : value}
      disabled={disabled}
      options={options}
      onChange={onSelectChange}
      meta={{ viewType: 'chipRadio', placeholder }}
      loading={loading}
      viewMode={viewMode}
      {...props}
    />
  );
}

export default CodeNameSpinner;
