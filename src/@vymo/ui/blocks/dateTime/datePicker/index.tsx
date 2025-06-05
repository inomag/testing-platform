import React, { forwardRef } from 'react';
import BaseDateTime from '../base';
import DatePickerWithTime from './datePickerWithTime';
import { DatePickerProps } from './types';

const DatePicker = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<DatePickerProps>
>(({ showTime, viewMode = false, ...datepickerProps }, ref = null) => {
  if (showTime) {
    return (
      <DatePickerWithTime ref={ref} {...datepickerProps} viewMode={viewMode} />
    );
  }
  return <BaseDateTime ref={ref} {...datepickerProps} viewMode={viewMode} />;
});

export default DatePicker;
