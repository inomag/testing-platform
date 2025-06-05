import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { differenceInMilliseconds, isBefore, startOfDay } from 'date-fns';
import { ReactComponent as SwapRight } from 'src/assets/icons/between.svg';
import DatePicker from '../datePicker';
import type { DateTimeRangePickerProps } from './types';
import styles from './index.module.scss';

function RangePicker({
  value,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  onChange = _.noop,
  format,
  duration = [],
  placeholderText = '',
  viewMode = false,
  ...rangePickerProps
}: DateTimeRangePickerProps) {
  const [openEndCalendar, setOpenEndCalendar] = useState(false);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);

  const [dateArray, setDateArray] = useState(value);

  const [startDate = null, endDate = null] = dateArray ?? [];

  const minDuration = duration.slice(0, 1)[0] ?? Number.NEGATIVE_INFINITY;
  const maxDuration = duration.splice(-1)[0] ?? Number.POSITIVE_INFINITY;

  useEffect(() => {
    setDateArray(value);
  }, [value]);

  const toDatePickerTimeSteps = useMemo(() => {
    const startDateOffSet = startOfDay(startDate ?? new Date());
    const millisecondsSinceStartOfDay = differenceInMilliseconds(
      startDate ?? new Date(),
      startDateOffSet,
    );
    if (duration.length > 0) {
      const durationObject = duration.reduce(
        (acc, durationValue) => {
          durationValue = millisecondsSinceStartOfDay + durationValue;
          const hours = Math.floor(durationValue / 60 / 60 / 1000);
          const minutes = Math.floor((durationValue / 60 / 1000) % 60);
          const seconds = Math.floor((durationValue / 1000) % 60);
          acc.hours = [...acc.hours, hours];
          acc.minutes = [...acc.minutes, minutes];
          acc.seconds = [...acc.seconds, seconds];
          return acc;
        },
        { hours: [], minutes: [], seconds: [] } as {
          hours: Array<number>;
          minutes: Array<number>;
          seconds: Array<number>;
        },
      );
      return {
        hours: _.uniq(durationObject.hours),
        minutes: _.uniq(durationObject.minutes),
        seconds: _.uniq(durationObject.seconds),
      };
    }
    return null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration?.length, startDate]);

  const onStartDateChange = useCallback(
    (date, event) => {
      // @ts-ignore
      onChange([date, endDate], event);
      setDateArray([date, endDate]);
    },
    [endDate, onChange],
  );

  const onEndDateChange = useCallback(
    (date, event) => {
      if (date) {
        // @ts-ignore
        onChange([startDate, date], event);
        setDateArray([startDate, date]);
      } else {
        // @ts-ignore
        onChange([], event);
        // @ts-ignore
        setDateArray([]);
      }
    },
    [onChange, startDate],
  );

  const onStartDateCalendarOpen = useCallback(() => {
    setOpenEndCalendar(false);
  }, []);

  const onStartDateCalendarClose = useCallback(() => {
    if (
      (!endDate && startDate) ||
      (endDate && startDate && isBefore(endDate, startDate))
    ) {
      setOpenEndCalendar(true);
    }
  }, [endDate, startDate]);

  const onEndDateCalendarClose = useCallback(() => {
    if (
      (endDate && !startDate) ||
      (endDate && startDate && isBefore(endDate, startDate))
    ) {
      setOpenStartCalendar(true);
    }
  }, [endDate, startDate]);

  return (
    <div className={!viewMode ? styles.rangePicker : ''}>
      <DatePicker
        selectsStart
        open={openStartCalendar}
        onChange={onStartDateChange}
        value={startDate}
        startDate={startDate}
        endDate={endDate}
        min={min}
        max={max}
        format={format}
        timeStep={{ stepMinutes: 5 }}
        onCalendarOpen={onStartDateCalendarOpen}
        onCalendarClose={onStartDateCalendarClose}
        placeholderText={placeholderText}
        customInput={
          <Input
            isOnChangeArgFirstEvent
            clearInputIcon={false}
            hideValidation
            onChange={onStartDateChange}
            variant="block"
            showDisabledIcon={rangePickerProps.showDisabledIcon}
            onTouchStart={onStartDateCalendarOpen}
          />
        }
        wrapperClassName={styles.rangePicker__start}
        viewMode={viewMode}
        {...rangePickerProps}
      />
      <SwapRight />
      <DatePicker
        selectsEnd
        showIcon={false}
        open={openEndCalendar}
        onChange={onEndDateChange}
        value={endDate}
        startDate={startDate}
        endDate={endDate}
        min={minDuration}
        max={maxDuration}
        minMaxRelativeDate={startDate}
        discreteTimeOptions={toDatePickerTimeSteps}
        format={format}
        onCalendarClose={onEndDateCalendarClose}
        placeholderText={placeholderText}
        wrapperClassName={styles.rangePicker__end}
        viewMode={viewMode}
        {...rangePickerProps}
      />
    </div>
  );
}

export default RangePicker;
