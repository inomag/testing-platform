import React, { useEffect, useState } from 'react';
import ListItem from './listItem';
import styles from './index.module.scss';

function List({
  children,
  onItemClick,
  selectedIndex: selectedListIndex,
  showSelected = false,
  className,
  'data-test-id': dataTestId = 'list',
  scrollBehaviour = 'smooth',
}: React.PropsWithChildren<{
  onItemClick?: (index: number) => void;
  selectedIndex?: number;
  showSelected?: boolean;
  className?: string;
  'data-test-id'?: string;
  scrollBehaviour?: 'smooth' | 'instant';
}>) {
  const [selectedIndex, setSelectedIndex] = useState(selectedListIndex);
  const [hoverIndex, setHoverIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(selectedListIndex);
  }, [selectedListIndex]);

  const handleClick = (index) => {
    setSelectedIndex(index);
    if (onItemClick) {
      onItemClick(index);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setHoverIndex((prevIndex) =>
        prevIndex < React.Children.count(children) - 1
          ? prevIndex + 1
          : prevIndex,
      );
    } else if (event.key === 'ArrowUp') {
      setHoverIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (event.key === 'Enter') {
      if (onItemClick) {
        onItemClick(Number(selectedIndex));
      }
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-test-id={dataTestId}
      className={`${className} ${styles.list}`}
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(children, (child, index) =>
        // @ts-ignore
        React.cloneElement(child, {
          index,
          isSelected: showSelected && selectedIndex === index,
          isHover: hoverIndex === index,
          onItemClick: () => {
            // @ts-ignore
            child?.props?.onItemClick?.();
            handleClick(index);
          },
          onItemHover: () => setHoverIndex(index),
          scrollBehaviour,
          // @ts-ignore
          'data-test-id': child?.props?.['data-test-id']
            ? // @ts-ignore
              `${child?.props?.['data-test-id']}-${dataTestId}-item`
            : `${dataTestId}-item`,
        }),
      )}
    </div>
  );
}

List.Item = ListItem;

export default List;
