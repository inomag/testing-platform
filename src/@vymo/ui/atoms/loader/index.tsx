import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { getAppTheme } from 'src/designTokens/themes';
import { getAppRootElement } from 'src/workspace/utils';
import { loaderSize } from './constants';
import CircleLoader from './indicator/circle';
import DotsLoader from './indicator/dots';
import { LoaderProps } from './types';
import styles from './index.module.scss';

const appTheme = getAppTheme();
const getDefaultThemeLoader = (height, width, color) => {
  const clientLoader = appTheme.config.loader;
  switch (clientLoader) {
    case 'dots':
      return <DotsLoader height={height} width={width} color={color} />;
    default:
      return <CircleLoader height={height} width={width} color={color} />;
  }
};

function Loader({
  color = 'var(--brand-primary)',
  className,
  visible = true,
  icon,
  delay = 10,
  fullPage = false,
  children = null,
  size = 'medium',
}: React.PropsWithChildren<LoaderProps>) {
  const [loading, setLoading] = useState(false);
  fullPage = fullPage && !children;

  const loaderWrapperClasses = classNames(styles.loader__wrapper, className, {
    [styles.loader__wrapper__fullPage]: fullPage,
  });

  const loaderClasses = classNames(styles.loader, {
    [styles.loader__fullPage]: fullPage,
    [styles.loader__component]: children,
  });

  delay = fullPage ? 0 : delay;

  const { height, width } = loaderSize[size];

  useEffect(() => {
    let loadingTimer;
    if (delay) {
      loadingTimer = setTimeout(() => {
        setLoading(visible);
      }, delay);
    } else {
      setLoading(visible);
    }

    return () => clearTimeout(loadingTimer);
  }, [delay, visible]);

  const getLoader = useCallback(
    () => (
      <div className={loaderWrapperClasses}>
        {children}
        {loading && (
          <div
            className={loaderClasses}
            data-test-id="loader"
            aria-label="loading"
          >
            {
              (icon ||
                getDefaultThemeLoader(height, width, color)) as ReactElement
            }
          </div>
        )}
      </div>
    ),
    [
      children,
      color,
      height,
      icon,
      loaderClasses,
      loaderWrapperClasses,
      loading,
      width,
    ],
  );

  if (fullPage && loading) {
    return createPortal(getLoader(), getAppRootElement());
  }

  return getLoader();
}
export default Loader;
