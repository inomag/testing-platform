import React, { useCallback } from 'react';
import { TimePicker } from 'src/@vymo/ui/blocks/dateTime';
import { TimeFormat } from 'src/@vymo/ui/blocks/dateTime/timePicker/types';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import { format as formatDate, getTime } from 'date-fns';
// eslint-disable-next-line vymo-ui/restrict-import
import { DATE_FORMATS } from 'src/models/clientConfig/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import { parseDateFormatToDateFns } from 'src/models/clientConfig/queries';

type Props = {
  value: number;
  onChange: (arg0, arg1, arg2?) => void;
  i18nConfig: any;
  viewMode?: boolean;
};

function TimePickerAdapter({
  value,
  onChange,
  loading,
  i18nConfig,
  viewMode = false,
  ...field
}: Props & FormContextProps) {
  const format =
    parseDateFormatToDateFns(
      i18nConfig?.client_date_time_config?.[DATE_FORMATS.TIME]?.dateTimeFormat,
    ) || 'hh:mm a';

  const onTimePickerChange = useCallback(
    (time, event, date) => {
      const onChangeValue = getTime(date);
      if (field.isDebug) {
        // eslint-disable-next-line no-console
        console.log({
          'Selected Value': date,
          'On Change Value': onChangeValue,
        });
      }
      onChange(onChangeValue, event, time);
    },
    [onChange, field.isDebug],
  );

  return (
    <TimePicker
      value={value ? formatDate(new Date(value), format) : ''}
      onChange={onTimePickerChange}
      format={format as TimeFormat}
      viewMode={viewMode}
      {...field}
    />
  );
}

export default TimePickerAdapter;
