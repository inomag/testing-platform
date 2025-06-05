import _ from 'lodash';
import React, { useCallback } from 'react';
import Select from 'src/@vymo/ui/atoms/select';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';

type Props = {
  value: string;
  disabled: boolean;
  onChange: (arg0, arg1, arg2?) => void;
  placeholder: string;
  options: Array<{ code: string; name: string }>;
  viewMode?: boolean;
};

function MultiSelectAdapter({
  value = '',
  disabled,
  onChange,
  placeholder,
  options = [],
  loading,
  viewMode = false,
  ...props
}: Props & FormContextProps) {
  value = !_.isEmpty(value) ? JSON.parse(value).map(({ code }) => code) : [];

  const onSelectChange = useCallback(
    (selectedOptions, event) => {
      const modifiedData = (selectedOptions || []).map(({ code, name }) => ({
        code,
        name,
      }));

      onChange(
        !_.isEmpty(modifiedData) ? JSON.stringify(modifiedData) : '',
        event,
      );
    },
    [onChange],
  );

  return (
    <Select
      value={value}
      disabled={disabled}
      options={options}
      onChange={onSelectChange}
      placeholder={placeholder}
      loading={loading}
      multi
      search
      viewMode={viewMode}
      {...props}
    />
  );
}

export default MultiSelectAdapter;
