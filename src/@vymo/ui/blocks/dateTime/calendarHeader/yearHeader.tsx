import React, { useLayoutEffect, useState } from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import Button from 'src/@vymo/ui/atoms/button';
import styles from './index.module.scss';

function CustomYearHeader({
  'data-test-id': dataTestId = 'year-header',
  date,
  decreaseYear,
  increaseYear,
  prevYearButtonDisabled,
  nextYearButtonDisabled,
}: ReactDatePickerCustomHeaderProps & {
  'data-test-id'?: string;
}) {
  const year = date.getFullYear();

  const [header, setHeader] = useState({
    startYear: '',
    endYear: '',
  });

  useLayoutEffect(() => {
    const startYear =
      document.querySelector(
        '.react-datepicker__year-wrapper > .react-datepicker__year-text:first-child',
      )?.innerHTML ?? '';

    const endYear =
      document.querySelector(
        '.react-datepicker__year-wrapper > .react-datepicker__year-text:last-child',
      )?.innerHTML ?? '';

    setHeader({
      startYear,
      endYear,
    });
  }, [year]);

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
        {header.startYear} - {header.endYear}
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

export default CustomYearHeader;
