import _ from 'lodash';
import React, { useCallback } from 'react';
import { DatePicker } from 'src/@vymo/ui/blocks/dateTime';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { DATE_FORMATS } from 'src/models/clientConfig/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import { parseDateFormatToDateFns } from 'src/models/clientConfig/queries';

type Props = {
  value: number;
  onChange: (arg0, arg1, arg2?) => void;
  i18nConfig: any;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};

function DatePickerAdapter({
  value,
  onChange,
  loading,
  i18nConfig,
  viewMode = false,
  ...field
}: Props & FormContextProps) {
  const format = parseDateFormatToDateFns(
    i18nConfig?.client_date_time_config?.[DATE_FORMATS.DATE_IN_CURRENT_YEAR]
      ?.dateTimeFormat,
  );

  const onDatePickerChange = useCallback(
    (date, event) => {
      const onChangeValue = new Date(date).getTime();
      const upadateValue =
        _.isNil(onChangeValue) || onChangeValue === 0 ? null : onChangeValue;

      if (field.isDebug) {
        // eslint-disable-next-line no-console
        console.log({
          'Selected Value': date,
          'On Change Value': onChangeValue,
        });
      }
      onChange(upadateValue, event);
    },
    [onChange, field.isDebug],
  );

  return (
    <DatePicker
      value={value ? new Date(value) : null}
      onChange={onDatePickerChange}
      format={format}
      viewMode={viewMode}
      {...field}
    />
  );
}

export default DatePickerAdapter;
