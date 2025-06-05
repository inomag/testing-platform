import React, { forwardRef } from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

type Props = {
  children: React.PropsWithChildren<React.ReactNode>;
  onClose?: (arg0?) => void;
  className?: string;
  closable?: boolean;
  'data-test-id'?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | null;
  bold?: boolean;
};

const Tag = forwardRef<HTMLInputElement, Props>(
  (
    {
      children,
      onClose = () => {},
      className,
      closable,
      'data-test-id': dataTestId = '',
      variant = 'default',
      bold = false,
      ...data
    },
    ref,
  ) => {
    const handleClose = (event: React.SyntheticEvent) => {
      event.stopPropagation();
      onClose(event);
    };

    const tagClasses = classnames(
      styles.tagInput__tag,
      styles[`tagInput__tag__${variant}`],
      {
        [styles.tagInput__tag__bold]: bold,
      },
    );
    return (
      <span
        data-test-id={dataTestId}
        className={`${tagClasses} ${className}`}
        ref={ref as any}
        {...data}
      >
        {children}
        {closable && (
          <span
            data-test-id={`${dataTestId}-close`}
            role="presentation"
            className={styles.tagInput__tag__close}
            onClick={handleClose}
          >
            &#x2715;
          </span>
        )}
      </span>
    );
  },
);

export default Tag;
