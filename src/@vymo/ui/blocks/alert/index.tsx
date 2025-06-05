import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import className from 'classnames';
import { ReactComponent as Close } from 'src/assets/icons/cross.svg';
import { ReactComponent as Error } from 'src/assets/icons/error.svg';
import { ReactComponent as Info } from 'src/assets/icons/infoCircle.svg';
import { ReactComponent as Success } from 'src/assets/icons/successCircle.svg';
import { ReactComponent as Warning } from 'src/assets/icons/warningCircle.svg';
import { AlertProps } from './types';
import styles from './index.module.scss';

function Alert({
  title,
  children,
  icon,
  closeable = false,
  duration,
  banner = false,
  classNames,
  variant,
  outlined = false,
  'data-test-id': dataTestId,
  onClose = _.noop,
}: React.PropsWithChildren<AlertProps>) {
  // eslint-disable-next-line
  const [visible, setVisible] = useState(true);

  const onCloseClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setVisible(false);
  }, [onClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (duration) {
      timer = setTimeout(() => {
        onCloseClick();
      }, duration);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [duration, onCloseClick]);

  if (!visible) {
    return null;
  }

  const alertClasses = className(
    styles.alert,
    {
      [styles.alert__alertWrapper]: !banner,
      [styles[`alert__${variant}`]]: variant,
      [styles.alert__outlined]: outlined,
    },
    classNames,
  );

  const getIcon = () => {
    switch (variant) {
      case 'info':
        return <Info />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'success':
        return <Success />;
      default:
        return icon;
    }
  };

  return (
    <div data-test-id={`${dataTestId}-wrapper`} className={alertClasses}>
      <div className={styles.alert__icon}>{getIcon()}</div>
      <div className={styles.alert__section}>
        {title && (
          <Text data-test-id={`${dataTestId}-message`} type="h6">
            {title}
          </Text>
        )}
        {children && (
          <Text data-test-id={`${dataTestId}-description`}>{children}</Text>
        )}
      </div>

      <div className={styles.alert__action}>
        {closeable && (
          <Button
            data-test-id={`${dataTestId}-close-button`}
            className={className(styles.alert__close)}
            onClick={onCloseClick}
            iconProps={{ icon: <Close />, iconPosition: 'right' }}
            type="text"
          />
        )}
      </div>
    </div>
  );
}

export default Alert;
