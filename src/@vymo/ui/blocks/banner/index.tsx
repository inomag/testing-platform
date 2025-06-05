import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Alert from 'src/@vymo/ui/blocks/alert';
import { AlertProps } from 'src/@vymo/ui/blocks/alert/types';
import classnames from 'classnames';
import { getAppRootElement } from 'src/workspace/utils';
import styles from './index.module.scss';

function Banner({
  children,
  message,
  position,
  classNames,
  'data-test-id': dataTestId = 'banner',
  ...props
}: React.PropsWithChildren<Omit<AlertProps, 'title'>> & {
  message?: React.ReactNode;
  position?:
    | 'top'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'topCenter'
    | 'bottomCenter';
}) {
  const bannerRef = useRef<any>(null);

  useEffect(
    () => () => {
      if (bannerRef?.current?.children?.length === 0) {
        bannerRef.current.remove();
      }
    },
    [],
  );

  useMemo(() => {
    const root = getAppRootElement();
    const bannerDiv = root.querySelector(`#banner-div-${position}`);
    if (root && !bannerDiv) {
      bannerRef.current = document.createElement('div');
      bannerRef.current.classList.add(
        styles.banner,
        styles.rootBanner,
        styles[`banner__${position}`],
      );
      bannerRef.current.id = `banner-div-${position}`;
      root.appendChild(bannerRef.current);
    } else if (!bannerRef.current) {
      bannerRef.current = bannerDiv;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bannerClasses = classnames({
    [styles.banner]: children,
    [styles.componentBanner]: children,
    [styles[`banner__${position}`]]: children,
  });

  const bannerWrapperClasses = classnames(
    {
      [styles.componentBannerWrapper]: children,
    },
    classNames,
  );

  if (!children && bannerRef.current && message) {
    return createPortal(
      <Alert banner {...props}>
        {message}
      </Alert>,
      bannerRef.current,
    );
  }

  if (children)
    return (
      <div data-test-id={dataTestId} className={bannerWrapperClasses}>
        {children}
        {message && (
          <Alert
            {...props}
            banner
            classNames={bannerClasses}
            data-test-id={dataTestId}
          >
            {message}
          </Alert>
        )}
      </div>
    );

  return null;
}

export default Banner;
