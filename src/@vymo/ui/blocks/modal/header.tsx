import React from 'react';
import styles from './index.module.scss';

type HeaderProps = {
  children?: string | React.ReactNode;
  'data-test-id'?: string;
  className?: string;
};

function Header({
  children,
  'data-test-id': dataTestId,
  className = '',
}: React.PropsWithChildren<HeaderProps>) {
  return (
    <div
      data-test-id={`${dataTestId}`}
      className={`${styles.modal__header} ${className}`}
    >
      {children}
    </div>
  );
}

export default Header;
