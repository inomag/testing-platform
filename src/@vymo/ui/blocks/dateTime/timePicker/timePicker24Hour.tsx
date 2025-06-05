import React, { useCallback } from 'react';
import TimePicker from '.';
import {
  convertTo24HourFormat,
  convertToFormat,
  extractTimeFormat,
} from '../rangePicker/queries';
import { TimePickerProps } from './types';

// this component adpater is needed as react-datepicker sends 24 hour format to custom timepicker.
// we need to convert it to required format before we send to timePicker component and vice versa for onChange
function TimePicker24Hour({
  value,
  discreteTimeOptions,
  format,
  step,
  onChange,
}: TimePickerProps) {
  // convert to time format as this format includes date also.
  format = extractTimeFormat(format);

  value = convertToFormat(value, format);

  const onChangeTimePicker = useCallback(
    (timeString, event, date) => {
      // convert it back to 24 hour format to be sent to react-datepicker
      onChange(convertTo24HourFormat(timeString, format), event, date);
    },
    [format, onChange],
  );

  return (
    <TimePicker
      showInput={false}
      onChange={onChangeTimePicker}
      //  @ts-ignore
      discreteTimeOptions={discreteTimeOptions}
      // extractTime(dateFormat) ??
      value={String(value)}
      format={format}
      // @ts-ignore
      step={step}
    />
  );
}

export default TimePicker24Hour;
