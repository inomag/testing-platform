import React from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import Button from 'src/@vymo/ui/atoms/button';
import styles from './index.module.scss';

function CustomMonthHeader({
  'data-test-id': dataTestId = 'month-header',
  onClickYearPicker,
  date,
  decreaseYear,
  increaseYear,
  prevYearButtonDisabled,
  nextYearButtonDisabled,
}: ReactDatePickerCustomHeaderProps & {
  'data-test-id'?: string;
  onClickYearPicker: () => void;
}) {
  const year = date.getFullYear();

  return (
    <div data-test-id={dataTestId} className={styles.customHeader}>
      <div
        data-test-id={`${dataTestId}-nav-left-wrapper`}
        className={styles.customHeader__nav__left}
      >
        <Button
          onClick={decreaseYear}
          type="text"
          disabled={prevYearButtonDisabled}
          className={styles.customHeader__nav__left__button}
        >
          {'<'}
        </Button>
      </div>

      <div
        data-test-id={`${dataTestId}-content-wrapper`}
        className={styles.customHeader__content}
      >
        <Button type="text" onClick={onClickYearPicker}>
          {year}
        </Button>
      </div>
      <div
        data-test-id={`${dataTestId}-nav-right-wrapper`}
        className={styles.customHeader__nav__right}
      >
        <Button
          onClick={increaseYear}
          disabled={nextYearButtonDisabled}
          type="text"
          className={styles.customHeader__nav__right__button}
        >
          {'>'}
        </Button>
      </div>
    </div>
  );
}

export default CustomMonthHeader;
