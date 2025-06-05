import React from 'react';
import classnames from 'classnames';
import { DividerProps } from './types';
import styles from './index.module.scss';

function Divider({ classNames, 'data-test-id': dataTestId }: DividerProps) {
  const dividerClasses = classnames(styles.divider, classNames);
  return <div className={dividerClasses} data-test-id={dataTestId} />;
}

export default Divider;
