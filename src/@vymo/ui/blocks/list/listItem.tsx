import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

function ListItem({
  children,
  isSelected = false,
  isHover = false,
  onItemClick = _.noop,
  onItemHover = _.noop,
  className,
  'data-test-id': dataTestId = 'list-item',
  scrollBehaviour,
}: React.PropsWithChildren<{
  isSelected?: boolean;
  isHover?: boolean;
  onItemClick?: () => void;
  onItemHover?: () => void;
  className?: string;
  'data-test-id'?: string;
  scrollBehaviour?: 'smooth' | 'instant';
}>) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (isSelected && itemRef.current) {
      // @ts-ignore
      itemRef.current.scrollIntoView({
        behavior: scrollBehaviour,
        block: 'nearest',
      });
    }
  }, [isSelected, scrollBehaviour]);

  const listClassNames = classNames(className, {
    [styles.listItem]: true,
    [styles.listItem__selected]: isSelected,
    [styles.listItem__hover]: isHover,
  });

  return (
    <div
      ref={itemRef}
      className={listClassNames}
      data-test-id={dataTestId}
      onClick={onItemClick}
      onMouseOver={onItemHover}
      onFocus={_.noop}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={_.noop}
      role="listbox"
    >
      {children}
    </div>
  );
}

export default ListItem;
