import React from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import Button from 'src/@vymo/ui/atoms/button';
import { format } from 'date-fns';
import styles from './index.module.scss';

function CustomDateHeader({
  onClickMonthPicker,
  onClickYearPicker,
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  decreaseYear,
  increaseYear,
  prevYearButtonDisabled,
  nextYearButtonDisabled,
}: ReactDatePickerCustomHeaderProps & {
  onClickMonthPicker: () => void;
  onClickYearPicker: () => void;
}) {
  const year = date.getFullYear();
  const monthName = format(date, 'MMMM');

  return (
    <div className={styles.customHeader}>
      <div className={styles.customHeader__nav__left}>
        <Button
          onClick={decreaseYear}
          type="text"
          disabled={prevYearButtonDisabled}
          className={styles.customHeader__nav__left__button}
        >
          {'<<'}
        </Button>
        <Button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          type="text"
          className={styles.customHeader__nav__left__button}
        >
          {'<'}
        </Button>
      </div>

      <div className={styles.customHeader__content}>
        <Button type="text" onClick={onClickMonthPicker}>
          {monthName}
        </Button>
        <Button type="text" onClick={onClickYearPicker}>
          {year}
        </Button>
      </div>
      <div className={styles.customHeader__nav__right}>
        <Button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          type="text"
          className={styles.customHeader__nav__right__button}
        >
          {'>'}
        </Button>
        <Button
          onClick={increaseYear}
          disabled={nextYearButtonDisabled}
          type="text"
          className={styles.customHeader__nav__right__button}
        >
          {'>>'}
        </Button>
      </div>
    </div>
  );
}

export default CustomDateHeader;
