import React from 'react';
import classnames from 'classnames';
import { CardProps } from './types';
import styles from './index.module.scss';

function Card({ children, hasError = false, classNames }: CardProps) {
  const classes = classnames(
    [styles['card-container']],
    {
      [styles['card-container__has_error']]: !!hasError,
    },
    classNames,
  );
  return (
    <div className={classes} data-test-id="card-container">
      {children}
    </div>
  );
}

export default Card;
