import _ from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';
import { Button } from 'src/@vymo/ui/atoms';
import BaseDateTime from '../base';
import { DATE_TIME_FORMAT } from '../constants';
import TimePicker24Hour from '../timePicker/timePicker24Hour';
import { DatePickerProps } from './types';
import baseStyles from '../index.module.scss';
import styles from './index.module.scss';

const DatePickerWithTime = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<
    Omit<ReactDatePickerProps, 'value' | 'onChange'> & DatePickerProps
  >
>(
  (
    {
      value,
      onChange = _.noop,
      format,
      discreteTimeOptions = [],
      timeStep = {},
      'data-test-id': dataTestId,
      viewMode = false,
      ...datepickerProps
    },
    ref = null,
  ) => {
    const datePickerRef = useRef(null);

    const [okButtonDisable, setOkButtonDisable] = useState(!value);

    useImperativeHandle(ref, () => Object.assign(datePickerRef.current as any));

    format = format || DATE_TIME_FORMAT;

    const onChangeBaseDatePicker = useCallback(
      (arg0, event) => {
        onChange(arg0, event);
        setOkButtonDisable(false);
      },
      [onChange],
    );

    const getDateWithTimeFooter = useCallback(
      () => (
        <div className={styles.dateWithTimePicker__footer}>
          <Button
            size="small"
            disabled={okButtonDisable}
            onClick={(event) => {
              event.stopPropagation();
              if (datePickerRef.current) {
                // @ts-ignore
                datePickerRef.current.setIsOpen(false);
              }
            }}
          >
            Ok
          </Button>
        </div>
      ),
      [okButtonDisable],
    );

    return (
      <BaseDateTime
        ref={datePickerRef}
        value={value}
        onChange={onChangeBaseDatePicker}
        format={format}
        showTimeInput
        popperClassName={`${baseStyles.popper} ${styles.dateWithTimePicker}`}
        customTimeInput={
          //  @ts-ignore
          <TimePicker24Hour
            discreteTimeOptions={discreteTimeOptions}
            format={format as any}
            step={timeStep}
          />
        }
        shouldCloseOnSelect={false}
        todayButton={getDateWithTimeFooter()}
        data-test-id={dataTestId}
        viewMode={viewMode}
        {...datepickerProps}
      />
    );
  },
);

export default DatePickerWithTime;
