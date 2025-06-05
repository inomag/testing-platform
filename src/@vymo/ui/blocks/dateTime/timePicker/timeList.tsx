import _ from 'lodash';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import useScrollToElement from 'src/hooks/useScrollToElement';
import styles from './index.module.scss';

function TimeList({ options, onItemClick, value }) {
  const timeListRef = useRef(null);
  const scrollToElement = useScrollToElement(timeListRef, 'top');

  const onClickItem = useCallback(
    (event) => {
      event.stopPropagation();
      const element = event.currentTarget as HTMLInputElement;
      const optionValue = element.getAttribute('data-option-id');
      onItemClick(optionValue);
      scrollToElement(element);
    },
    [onItemClick, scrollToElement],
  );

  useLayoutEffect(() => {
    if (timeListRef.current) {
      const element = (timeListRef.current as HTMLElement).querySelector(
        `[data-option-id="${value}"]`,
      ) as HTMLElement;

      if (element) {
        scrollToElement(element);
      }
    }
  }, [scrollToElement, value]);

  return (
    <div ref={timeListRef} className={styles.timePicker__list}>
      {options.map((option) => (
        <div
          key={option.value}
          className={styles.timePicker__list__item}
          onClick={option.disabled ? _.noop : onClickItem}
          tabIndex={-1}
          data-selected={option.value === value}
          data-option-id={String(option.value)}
          role="presentation"
        >
          {option.icon && (
            <span className={styles.timePicker__list__item__icon}>
              {option.icon}
            </span>
          )}
          {option.label ?? option.name}
        </div>
      ))}
    </div>
  );
}

export default TimeList;
