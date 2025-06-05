import _ from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DatePicker from 'react-datepicker';
import type { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from 'src/@vymo/ui/atoms';
import { useMachine } from '@xstate/react';
import classnames from 'classnames';
import { addMilliseconds, format as formatDate } from 'date-fns';
import { ReactComponent as CalendarIcon } from 'src/assets/icons/calendar.svg';
import CustomDateHeader from './calendarHeader/dateHeader';
import CustomMonthHeader from './calendarHeader/monthHeader';
import CustomYearHeader from './calendarHeader/yearHeader';
import { DEFAULT_FORMAT } from './constants';
import { DatePickerProps } from './datePicker/types';
import { getDatePickerScenario, getDateTimePickerMachine } from './queries';
import styles from './index.module.scss';

// https://github.com/Hacker0x01/react-datepicker/issues/3834
// react-datepicker serves commonjs in browser path and es in module path
// we use tsup for @vymo/ui bundling which uses esbuild. For node module default export path is module not browser.

// @ts-ignore
// eslint-disable-next-line no-var
var DatePickerBase = DatePicker.default ?? DatePicker;

/**
 * We are using 3rd party library
 * please refer this link for more examples
 * https://reactdatepicker.com/
 * https://github.com/Hacker0x01/react-datepicker
 */
const BaseDateTime = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<
    Omit<ReactDatePickerProps, 'value' | 'onChange'> & DatePickerProps
  >
>(
  (
    {
      value,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      startDate,
      endDate,
      selectsStart = false,
      selectsEnd = false,
      open = false,
      onChange = _.noop,
      format,
      placeholderText = '',
      disabled = false,
      picker = 'date',
      showTimeInput = false,
      renderCustomHeader,
      minMaxRelativeDate = null,
      onCalendarClose = _.noop,
      shouldCloseOnSelect = true,
      customTimeInput,
      'data-test-id': dataTestId,
      customInput,
      viewMode = false,
      ...datepickerProps
    },
    ref = null,
  ) => {
    const datePickerRef = useRef(null);

    const [date, setDate] = useState(value);

    const [isOpen, setIsOpen] = useState(open);

    const { scenario, config } = getDatePickerScenario(picker);

    useImperativeHandle(ref, () => {
      if (datePickerRef?.current) {
        return Object.assign(datePickerRef?.current as any, {
          setIsOpen: (arg0: boolean) => {
            if (!arg0) {
              onCalendarClose();
            }
            setIsOpen(arg0);
          },
        });
      }
      return null;
    });

    const dateTimePickerMachine = useMemo(
      () => getDateTimePickerMachine(scenario, config),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [scenario],
    );
    const [machineState, send] = useMachine(dateTimePickerMachine);

    useLayoutEffect(() => {
      if (open) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, [open]);

    useEffect(() => {
      setDate(value);
    }, [value]);

    useLayoutEffect(() => {
      if (isOpen) {
        // props not updating calendar properly while calendar open. So explicitly firing the onInputClick
        // @ts-ignore
        datePickerRef.current.onInputClick();
      }
    }, [isOpen, machineState.value]);

    format = format || DEFAULT_FORMAT[scenario];

    const onClickMonthPicker = useCallback(() => {
      send({ type: 'HEADER_MONTH' });
    }, [send]);

    const onClickYearPicker = useCallback(() => {
      send({ type: 'HEADER_YEAR' });
    }, [send]);

    const onDateInputChange = useCallback(
      (changeDate, event) => {
        send({ type: 'CLICK' });

        if (machineState.value === scenario) {
          onChange(changeDate, event);
          if (shouldCloseOnSelect) {
            setIsOpen(false);
          }
        }
        setDate(changeDate);
      },
      [send, machineState.value, scenario, onChange, shouldCloseOnSelect],
    );

    const getCustomHeader = (props) => {
      switch (machineState.value) {
        case 'yearPicker':
          return <CustomYearHeader {...props} datePickerRef={datePickerRef} />;

        case 'monthPicker':
          return (
            <CustomMonthHeader
              onClickYearPicker={onClickYearPicker}
              {...props}
            />
          );

        case 'quarterPicker':
          return (
            <CustomMonthHeader
              onClickYearPicker={onClickYearPicker}
              {...props}
            />
          );

        default:
          return (
            <CustomDateHeader
              onClickYearPicker={onClickYearPicker}
              onClickMonthPicker={onClickMonthPicker}
              {...props}
            />
          );
      }
    };

    const datePickerClassName = classnames({
      [styles.datePicker__disabled]: disabled,
    });

    if (viewMode) {
      if (date) return <span>{formatDate(date, format as string)}</span>;
      return <span>-</span>;
    }

    return (
      <DatePickerBase
        ref={datePickerRef}
        open={isOpen}
        disabled={disabled}
        allowSameDay
        placeholderText={placeholderText}
        dateFormat={format}
        selected={date ?? null}
        startDate={startDate ?? null}
        endDate={endDate ?? null}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        minDate={addMilliseconds(minMaxRelativeDate ?? new Date(), min)}
        maxDate={addMilliseconds(minMaxRelativeDate ?? new Date(), max)}
        onChange={onDateInputChange}
        onCalendarClose={onCalendarClose}
        onInputClick={() => !disabled && setIsOpen(true)}
        onClickOutside={() => !disabled && setIsOpen(false)}
        renderCustomHeader={getCustomHeader}
        showMonthYearPicker={machineState.value === 'monthPicker'}
        showQuarterYearPicker={machineState.value === 'quarterPicker'}
        showYearPicker={machineState.value === 'yearPicker'}
        showTimeInput={machineState.value === 'datePicker' && showTimeInput}
        wrapperClassName={styles.datePicker}
        popperClassName={styles.popper}
        data-test-id={dataTestId}
        todayButton="Today"
        shouldCloseOnSelect={shouldCloseOnSelect}
        customTimeInput={customTimeInput}
        customInput={
          customInput || (
            <Input
              iconRight={<CalendarIcon />}
              isOnChangeArgFirstEvent
              hideValidation
              onChange={onChange}
              data-test-id={dataTestId}
              disabled={disabled}
              showDisabledIcon={datepickerProps.showDisabledIcon}
              variant="block"
              onTouchStart={() => !disabled && setIsOpen(true)}
              classNames={datePickerClassName}
            />
          )
        }
        {...datepickerProps}
      />
    );
  },
);

export default BaseDateTime;
