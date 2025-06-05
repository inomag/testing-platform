import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type FooterProps = {
  children?: React.ReactNode;
  'data-test-id'?: string;
  position?: 'left' | 'right';
};

function Footer({
  children,
  'data-test-id': dataTestId,
  position = 'right',
}: React.PropsWithChildren<FooterProps>) {
  return (
    <div
      data-test-id={`${dataTestId}`}
      className={classNames(styles.modal__footer, styles[`${position}`])}
    >
      {children}
    </div>
  );
}

export default Footer;
