import React, { useState } from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import { Text } from 'src/@vymo/ui/atoms';
import { ReactComponent as ChevronDown } from 'src/assets/icons/chevronDown.svg';
import { getModuleProps } from 'src/workspace/utils';
import { BreadcrumbProps, MenuItem } from './types';
import styles from './index.module.scss';

// eslint-disable-next-line react/function-component-definition
const Breadcrumb = ({
  separator = '/',
  items = [],
  className,
  'data-test-id': dataTestId = 'breadcrumb',
}: BreadcrumbProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>();

  const combinedClassName = `${styles.breadcrumb_container} ${className || ''}`;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement | HTMLAnchorElement>,
    onClick?: ((e: React.MouseEvent | React.KeyboardEvent) => void) | undefined,
  ) => {
    if (onClick && e.key === 'Enter') {
      onClick(e);
    }
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setShowMenu(false);
  };

  const navigation = (path) => {
    if (getModuleProps()?.onDetailsNavigation?.()) {
      getModuleProps()?.onDetailsNavigation?.();
    } else {
      window.location.href = path;
    }
  };

  const handleNavigation = (path, onBeforeNavigate, e) => {
    if (onBeforeNavigate) {
      onBeforeNavigate(navigation);
      e.preventDefault();
    } else {
      navigation(path);
    }
  };

  return (
    <nav
      aria-label="breadcrumb"
      className={combinedClassName}
      data-test-id={dataTestId}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <div data-test-id={`${dataTestId}-item`} className={item.className}>
            {index === items.length - 1 && !item.menu && (
              <Text bold>
                <span
                  onClick={(e) => item.onClick?.(e as React.MouseEvent)}
                  onKeyDown={(e) => handleKeyDown(e, item.onClick)}
                  onMouseEnter={(e) => item.onHover?.(e as React.MouseEvent)}
                  tabIndex={0}
                  role="button"
                >
                  {item.title}
                </span>
              </Text>
            )}
            {item.menu?.length && (
              <div
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <div
                  className={styles.menu_container}
                  data-test-id={`${dataTestId}-menu-item`}
                  role="button"
                  tabIndex={0}
                >
                  <span>{selectedMenuItem?.label || item.title}</span>
                  <ChevronDown />
                </div>

                {showMenu && (
                  <div
                    data-test-id={`${dataTestId}-menu-container`}
                    className={styles.menu}
                  >
                    {item.menu.map((menuItem) => (
                      <div
                        data-test-id={`${dataTestId}-menu-container-item`}
                        key={menuItem.value}
                        onClick={() => {
                          handleMenuItemClick(menuItem);
                        }}
                        onKeyDown={(e) => handleKeyDown(e)}
                        role="button"
                        tabIndex={0}
                      >
                        {menuItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!item.menu?.length && index !== items.length - 1 && (
              <span
                onClick={(e) =>
                  handleNavigation(item.path, item.onBeforeNavigate, e)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, () =>
                    handleNavigation(item.path, item.onBeforeNavigate, e),
                  )
                }
                onMouseEnter={(e) => item.onHover?.(e as React.MouseEvent)}
                role="button"
                tabIndex={0}
                className={styles.breadcrumb__link}
              >
                {item.title}
              </span>
            )}
          </div>

          {index !== items.length - 1 ? (
            <span className={styles.separator}>{separator}</span>
          ) : (
            ''
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
