/* eslint-disable complexity */
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Input } from 'src/@vymo/ui/atoms';
import classNames from 'classnames';
import { format as formatDate, parse } from 'date-fns';
import { ReactComponent as ClockIcon } from 'src/assets/icons/clock.svg';
import Logger from 'src/logger';
import { getDateFromTime } from './queries';
import TimeList from './timeList';
import { TimeFormat, TimePickerProps } from './types';
import styles from './index.module.scss';

const log = new Logger('TimePicker');

function TimePicker({
  value = '',
  onChange,
  format,
  showInput = true,
  step = { stepHours: 1, stepMinutes: 5, stepSeconds: 5 },
  discreteTimeOptions = { hours: null, minutes: null, seconds: null },
  'data-test-id': dataTestId,
  viewMode = false,
}: TimePickerProps) {
  format = (format || 'HH:mm') as TimeFormat;

  const [hours, setHoursState] = useState<number | null>(null);
  const [minutes, setMinutesState] = useState<number | null>(null);
  const [seconds, setSecondsState] = useState<number | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const inputRef = useRef() as MutableRefObject<any>;
  const [showTimePicker, setShowTimePicker] = useState(!showInput);
  const [timeValue, setTimeValue] = useState(value);

  useEffect(() => {
    setTimeValue(value);
  }, [value]);

  const show12Hours = format.indexOf('a') > -1;
  const { stepHours = 1, stepMinutes = 5, stepSeconds = 5 } = step;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showInput &&
        inputRef?.current &&
        !inputRef?.current.contains(e.target)
      ) {
        setShowTimePicker(false);
        setTimeValue(value);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [inputRef, showInput, value]);

  useEffect(() => {
    if (timeValue) {
      const initialTime = parse(timeValue, format as string, new Date());
      const formattedHours = show12Hours
        ? initialTime.getHours() % 12 || 12
        : initialTime.getHours();
      const formattedMinutes = initialTime.getMinutes();
      const formattedSeconds = initialTime.getSeconds();
      const initialPeriod = initialTime.getHours() >= 12 ? 'PM' : 'AM';

      setHoursState(formattedHours);
      setMinutesState(formattedMinutes);
      setSecondsState(formattedSeconds);
      setPeriod(initialPeriod);
    } else {
      setHoursState(null);
      setMinutesState(null);
      setSecondsState(null);
      setPeriod(null);
    }
  }, [timeValue, show12Hours, format]);

  const handleTimeChange = useCallback(
    (date?: Date) => {
      if (date) {
        const formattedValue = formatDate(date, format as string);
        onChange(formattedValue, null, date);
      } else {
        onChange(null, null, null);
      }
    },
    [format, onChange],
  );

  const handleHoursChange = (hourValue: number) => {
    setHoursState(hourValue);
    handleTimeChange(
      getDateFromTime(show12Hours, hourValue, minutes, seconds, period),
    );
  };

  const handleMinutesChange = (minValue: number) => {
    setMinutesState(minValue);
    handleTimeChange(
      getDateFromTime(show12Hours, hours, minValue, seconds, period),
    );
  };

  const handleSecondsChange = (secondsValue: number) => {
    setSecondsState(secondsValue);
    handleTimeChange(
      getDateFromTime(show12Hours, hours, minutes, secondsValue, period),
    );
  };

  const handlePeriodChange = (periodValue: string) => {
    setPeriod(periodValue);
    handleTimeChange(
      getDateFromTime(show12Hours, hours, minutes, seconds, periodValue),
    );
  };

  const handleOnChange = (inputValue: string) => {
    setTimeValue(inputValue);
    if (!inputValue) {
      handleTimeChange();
    } else {
      try {
        const date = parse(inputValue, format as string, new Date());
        handleTimeChange(date);
      } catch (error) {
        log.info(error);
      }
    }
  };

  const timePickerClasses = classNames(styles.timePicker, {
    [styles.timePicker__absolutePosition]: showInput,
  });

  return (
    <div className={styles.timePicker__wrapper}>
      {showInput && (
        <Input
          ref={inputRef}
          iconRight={<ClockIcon />}
          onClick={() => setShowTimePicker(true)}
          value={timeValue}
          onChange={handleOnChange}
          clearInputIcon
          data-test-id={dataTestId}
          viewMode={viewMode}
          variant="block"
          onTouchStart={() => setShowTimePicker(true)}
        />
      )}
      {showTimePicker && (
        <div className={timePickerClasses}>
          <div className={styles.timePicker__content}>
            {['h', 'hh', 'HH'].includes(format.split(':')?.[0]) && (
              <TimeList
                value={hours}
                onItemClick={handleHoursChange}
                options={(discreteTimeOptions?.hours || show12Hours
                  ? [...Array(13).keys()].slice(1, 13)
                  : [...Array(24).keys()]
                )
                  .filter((num) => num % stepHours === 0)
                  .map((hour) => ({
                    label: hour < 10 ? `0${hour}` : hour,
                    value: hour,
                  }))}
              />
            )}
            {format.includes('mm') && (
              <TimeList
                value={minutes}
                onItemClick={handleMinutesChange}
                options={(discreteTimeOptions?.minutes || [...Array(60).keys()])
                  .filter((num) => num % stepMinutes === 0)
                  .map((minute) => ({
                    label: minute < 10 ? `0${minute}` : minute,
                    value: minute,
                  }))}
              />
            )}
            {format.includes('ss') && (
              <TimeList
                value={seconds}
                onItemClick={handleSecondsChange}
                options={(discreteTimeOptions?.seconds || [...Array(60).keys()])
                  .filter((num) => num % stepSeconds === 0)
                  .map((second) => ({
                    label: second < 10 ? `0${second}` : second,
                    value: second,
                  }))}
              />
            )}
            {show12Hours && (
              <TimeList
                value={period}
                onItemClick={handlePeriodChange}
                options={[
                  { label: 'AM', value: 'AM' },
                  { label: 'PM', value: 'PM' },
                ]}
              />
            )}
          </div>
          {showInput && (
            <div className={styles.timePicker__footer}>
              <Button
                type="text"
                onClick={() => {
                  const now = new Date();
                  const nowHours = show12Hours
                    ? now.getHours() % 12 || 12
                    : now.getHours();
                  const nowMinutes = now.getMinutes();
                  const nowSeconds = now.getSeconds();
                  const nowPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
                  setHoursState(nowHours);
                  setMinutesState(nowMinutes);
                  setSecondsState(nowSeconds);
                  setPeriod(nowPeriod);
                  handleTimeChange(
                    getDateFromTime(
                      show12Hours,
                      nowHours,
                      nowMinutes,
                      nowSeconds,
                      nowPeriod,
                    ),
                  );
                }}
              >
                Now
              </Button>
              <Button size="small" onClick={() => setShowTimePicker(false)}>
                Ok
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TimePicker;
