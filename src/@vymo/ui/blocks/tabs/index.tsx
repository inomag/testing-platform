/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

export interface TabProps {
  items: { key: string; label: string; children: React.ReactNode }[];
  defaultKey: string;
  onChange?: (key: string) => void;
  classNames?: string;
  'data-test-id'?: string;
}

function TabLayout({
  items,
  defaultKey,
  onChange = _.noop,
  classNames,
  'data-test-id': dataTestId,
}: TabProps) {
  const [selectedTab, setSelectedTab] = useState(defaultKey);

  useEffect(() => {
    setSelectedTab(defaultKey);
  }, [defaultKey]);

  const getSelectedTabContent = useCallback(() => {
    const selectedItem = items.find((item) => item.key === selectedTab);
    return selectedItem?.children;
  }, [items, selectedTab]);

  const getTabClasses = useCallback(
    (key: string) =>
      selectedTab === key
        ? `${styles.tabWrapper__tabs__link} ${styles.tabWrapper__tabs__link__selected}`
        : styles.tabWrapper__tabs__link,
    [selectedTab],
  );

  return (
    <div className={classNames} data-test-id={dataTestId}>
      <div className={styles.tabWrapper__tabs__wrapper}>
        {items.map((item) => (
          <div
            data-test-id={`${dataTestId}-${item.key}`}
            onClick={() => {
              if (selectedTab !== item.key) {
                setSelectedTab(item.key);
                onChange?.(item.key);
              }
            }}
            className={getTabClasses(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className={styles.tabWrapper__content}>
        {getSelectedTabContent()}
      </div>
    </div>
  );
}

export default TabLayout;
