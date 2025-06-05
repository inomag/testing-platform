import React, { useMemo } from 'react';
import classnames from 'classnames';
import { ChipProps } from './types';
import styles from './index.module.scss';

function Chip({
  type,
  label,
  iconProps,
  'data-test-id': dataTestId,
  classNames,
  bold = false,
}: ChipProps) {
  const renderChipContent = useMemo(
    () => (
      <>
        {iconProps && iconProps.icon && iconProps.iconPosition === 'left' && (
          <span data-testid="icon" className={styles.chip__icon}>
            {iconProps.icon}
          </span>
        )}
        {label}
        {iconProps && iconProps.icon && iconProps.iconPosition === 'right' && (
          <span data-testid="icon" className={styles.chip__icon}>
            {iconProps.icon}
          </span>
        )}
      </>
    ),
    [iconProps, label],
  );
  const classes = classnames(
    styles.chip,
    styles[type],
    {
      [styles.icon__left]:
        iconProps && iconProps.icon && iconProps.iconPosition === 'left',
      [styles.icon__right]:
        iconProps && iconProps.icon && iconProps.iconPosition === 'right',
      [styles.chip__bold]: !!bold,
    },
    classNames,
  );
  return (
    <div className={classes} data-test-id={dataTestId}>
      {renderChipContent}
    </div>
  );
}

export default Chip;
