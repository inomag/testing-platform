import React, { useMemo } from 'react';
import { Option, RadioGroup } from 'src/@vymo/ui/atoms/radio';
import { RadioTypeProps } from 'src/@vymo/ui/atoms/radio/types';
import Select from 'src/@vymo/ui/atoms/select';
import { FormContextProps } from '../formProvider/types';

type Props = {
  meta: {
    viewType: RadioTypeProps;
    placeholder?: string;
  };
  disabled: boolean;
  onChange: (arg0, arg1, arg2?) => void;
  options: Array<{ code: string; name: string; disabled?: boolean }>;
  value?: string;
  hint: string;
  multi?: boolean;
  viewMode?: boolean;
};
export default function RadioGroupAdapter({
  options,
  meta,
  disabled = false,
  onChange,
  value,
  loading,
  hint,
  viewMode = false,
  ...field
}: Props & FormContextProps) {
  const radioValue = useMemo(() => value, [value]);

  if (options?.length > 5) {
    return (
      <Select
        value={value}
        disabled={disabled}
        options={options}
        search
        onChange={onChange}
        placeholder={meta.placeholder}
        loading={loading}
        viewMode={viewMode}
        {...field}
      />
    );
  }
  return (
    <RadioGroup
      {...field}
      type={meta.viewType}
      name={String(hint)}
      onChange={onChange}
      value={radioValue}
      viewMode={viewMode}
    >
      {options?.map((option) => (
        <Option
          {...option}
          value={option.code}
          label={option.name}
          disabled={option.disabled || disabled}
        />
      ))}
    </RadioGroup>
  );
}
