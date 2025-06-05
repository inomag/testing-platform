import React, { useCallback, useEffect, useMemo } from 'react';
import RadioGroupAdapter from 'src/@vymo/ui/molecules/form/adapters/radioAdapter';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import { getSifgValueForSelect } from './queries';
import { SifgProps } from './types';

const outputTypeDefault = {};

function Sifg({
  code: sifgCode,
  value,
  disabled,
  options,
  outputType = outputTypeDefault,
  onChange,
  placeholder,
  appendFieldsAtCode,
  loading,
  viewMode = false,
  ...props
}: SifgProps & {
  appendFieldsAtCode: FormContextProps['appendFieldsAtCode'];
  loading: boolean;
}) {
  const { inputs = {}, selection } = options ?? {};

  const onSifgChange = useCallback(
    (selectedOptions, event) => {
      const { code, name } = selectedOptions[0];
      let sifgValue = name;
      if (outputType.json) {
        sifgValue = JSON.stringify({ code, name });
      } else if (outputType.returnCode) {
        sifgValue = code;
      }

      onChange(sifgValue, event, { data: { code } });
    },
    [onChange, outputType.json, outputType.returnCode],
  );

  value = useMemo(
    () =>
      getSifgValueForSelect(
        value,
        selection?.code_name_spinner_options,
        outputType,
      ),
    [outputType, selection?.code_name_spinner_options, value],
  );

  useEffect(() => {
    const sifgInputs = inputs[value] ?? [];

    if (Array.isArray(sifgInputs)) {
      const configAppend = sifgInputs.map((input) => {
        if (input.type === 'sifg' && outputType.returnCode) {
          input = {
            ...input,
            outputType: { returnCode: outputType.returnCode },
          };
        }
        return input;
      });

      appendFieldsAtCode({ code: sifgCode, config: configAppend });
    }

    // append Config
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sifgCode, inputs, outputType.returnCode, value]);

  return (
    <RadioGroupAdapter
      value={value}
      disabled={disabled}
      // @ts-ignore
      options={selection?.code_name_spinner_options}
      onChange={onSifgChange}
      meta={{ viewType: 'chipRadio', placeholder }}
      loading={loading}
      viewMode={viewMode}
      {...props}
    />
  );
}

export default Sifg;
