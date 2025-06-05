import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { ReactComponent as ChevronDown } from 'src/assets/icons/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'src/assets/icons/chevron_up.svg';
import { NavigationItem, NavigationProps } from './types';
import styles from './index.module.scss';

export function Navigation({ items, defaultKey = '' }: NavigationProps) {
  const findDefaultMenuItem = (
    menuItems: NavigationItem[],
  ): NavigationItem | null => {
    // eslint-disable-next-line no-restricted-syntax
    for (const menuItem of menuItems) {
      if (menuItem.key === defaultKey) return menuItem;
      if (menuItem.items) {
        const subItem = findDefaultMenuItem(menuItem.items);
        if (subItem) return subItem;
      }
    }
    return null;
  };

  const defaultMenuItem = findDefaultMenuItem(items);
  const [selected, setSelected] = useState<NavigationItem | null>(
    defaultMenuItem,
  );
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(
    new Set(defaultMenuItem ? [defaultMenuItem.key] : []),
  );

  const onClickMenu = (option: NavigationItem) => {
    if (option.items?.length) {
      setExpandedMenus((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(option.key)) {
          newSet.delete(option.key);
        } else {
          newSet.add(option.key);
        }
        return newSet;
      });
    } else {
      setSelected(option);
    }
  };

  useEffect(() => {
    if (selected?.onClick) {
      selected.onClick(selected.key);
    }
  }, [selected]);

  const isParentOfSelected = useCallback(
    (option: NavigationItem) => {
      if (!selected) return false;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const checkParent = (items: NavigationItem[]): boolean =>
        items.some(
          (item) =>
            item.key === selected.key ||
            (item.items ? checkParent(item.items) : false),
        );
      return option.items ? checkParent(option.items) : false;
    },
    [selected],
  );

  const menuItemClasses = useCallback(
    (option) =>
      classnames(styles.navigation__item, {
        [styles.navigation__item__selected]: selected?.key === option.key,
        [styles.navigation__item__childSelected]: isParentOfSelected(option),
      }),
    [isParentOfSelected, selected?.key],
  );

  const menuItemContainerClasses = useCallback(
    (option) =>
      classnames(styles.navigation__item__backDrop, {
        [styles.navigation__item__backDrop__selected]:
          selected?.key === option.key,
      }),
    [selected],
  );

  const renderMenuItems = (menuItems: NavigationItem[], level = 0) => (
    <div className={styles.navigation__sub}>
      {menuItems.map((item) => (
        <div key={item.key}>
          <div
            className={menuItemClasses(item)}
            role="button"
            tabIndex={0}
            onClick={() => onClickMenu(item)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && onClickMenu(item)
            }
          >
            <span className={menuItemContainerClasses(item)} />
            <span
              className={styles.navigation__item__name}
              style={{
                paddingLeft: `${level * 16}px`,
              }}
            >
              {item.icon ? item.icon : ''} {item.value}
            </span>
            {Number(item.items?.length) > 0 &&
              (expandedMenus.has(item.key) ? (
                <ChevronUp className={styles.navigation__chevron} />
              ) : (
                <ChevronDown className={styles.navigation__chevron} />
              ))}
          </div>
          {item.items &&
            expandedMenus.has(item.key) &&
            renderMenuItems(item.items, level + 1)}
        </div>
      ))}
    </div>
  );

  return <div className={styles.navigation}>{renderMenuItems(items)}</div>;
}
