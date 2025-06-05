import React, { useCallback } from 'react';
import { RangePicker } from 'src/@vymo/ui/blocks/dateTime';
import { differenceInMilliseconds, getTime } from 'date-fns';
// eslint-disable-next-line vymo-ui/restrict-import
import { DATE_FORMATS } from 'src/models/clientConfig/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import { parseDateFormatToDateFns } from 'src/models/clientConfig/queries';
import { FormContextProps } from '../formProvider/types';

type Props = {
  value?: { date: string; duration: number };
  onChange: (arg0, arg1, arg2?) => void;
  duration: Array<number>;
  i18nConfig: any;
  viewMode?: boolean;
};

function DateTimeRangePickerAdapter({
  value,
  onChange,
  loading,
  i18nConfig,
  duration,
  viewMode = false,
  ...field
}: Props & FormContextProps) {
  const format = parseDateFormatToDateFns(
    i18nConfig?.client_date_time_config?.[
      DATE_FORMATS.MEETING_DATE_NOT_IN_CURRENT_YEAR
    ]?.dateTimeFormat,
  );

  const defaultMaxDuration = 90 * 60 * 1000;
  const defaultMinDuration = 30 * 60 * 1000;

  const minDuration = duration.slice(0, 1)[0] ?? defaultMinDuration;
  const maxDuration = duration.splice(-1)[0] ?? defaultMaxDuration;

  if (!duration.includes(maxDuration)) {
    duration.push(maxDuration);
  }

  if (!duration.includes(minDuration)) {
    duration.unshift(minDuration);
  }

  const { duration: durationForEndDate, date } = value ?? {};

  const startDate = date ? new Date(date) : null;

  const endDate =
    durationForEndDate && startDate
      ? new Date(getTime(startDate) + durationForEndDate)
      : null;

  const onDateTimeRangePickerChange = useCallback(
    (selectedDate, event) => {
      const [startDateValue, endDateValue] = selectedDate ?? [];
      const changeData = {
        date: startDateValue,
        duration: endDateValue
          ? differenceInMilliseconds(endDateValue, startDateValue)
          : null,
      };
      if (field.isDebug) {
        // eslint-disable-next-line no-console
        console.log({
          'Selected Value': selectedDate,
          'On Change Value': changeData,
        });
      }
      onChange(changeData, event);
    },
    [onChange, field.isDebug],
  );

  return (
    <RangePicker
      value={[startDate, endDate]}
      onChange={onDateTimeRangePickerChange}
      format={format}
      duration={duration}
      showTime
      viewMode={viewMode}
      {...field}
    />
  );
}

export default DateTimeRangePickerAdapter;
