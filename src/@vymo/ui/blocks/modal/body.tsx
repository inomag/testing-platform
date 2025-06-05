import React from 'react';
import styles from './index.module.scss';

type BodyProps = {
  children: string | React.ReactNode;
  'data-test-id'?: string;
  className?: string;
};

function Body({
  children,
  'data-test-id': dataTestId,
  className = '',
}: React.PropsWithChildren<BodyProps>) {
  return (
    <div
      data-test-id={`${dataTestId}`}
      className={`${styles.modal__body} ${className}`}
    >
      {children}
    </div>
  );
}

export default Body;
