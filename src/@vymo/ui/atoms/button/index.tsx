import React, { forwardRef } from 'react';
import Loader from 'src/@vymo/ui/atoms/loader';
import classnames from 'classnames';
import { ButtonProps } from './types';
import styles from './index.module.scss';

function renderButtonContent({
  children,
  iconProps,
  loading,
  type,
}: React.PropsWithChildren<ButtonProps>) {
  return (
    <>
      {iconProps && iconProps.icon && iconProps.iconPosition === 'left' && (
        <span data-testid="icon" className={styles.button__icon}>
          {iconProps.icon}
        </span>
      )}
      {children}
      {iconProps && iconProps.icon && iconProps.iconPosition === 'right' && (
        <span data-testid="icon" className={styles.button__icon}>
          {iconProps.icon}
        </span>
      )}
      {loading && (
        <Loader
          visible
          size="small"
          delay={0}
          color={type === 'primary' ? 'var(--color-neutral-100)' : undefined}
        />
      )}
    </>
  );
}

const Button = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<ButtonProps>
>(
  // eslint-disable-next-line complexity
  (
    {
      children,
      type = 'primary',
      size = 'medium',
      rounded = false,
      disabled = false,
      onClick = () => {},
      onMouseDown = () => {},
      linkProps,
      iconProps,
      variant = 'default',
      className,
      loading = false,
      'data-test-id': dataTestId,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      disabled = true;
    }
    const buttonClasses = classnames(
      styles.button,
      styles[`button__${type}`],
      styles[`button__${size}`],
      styles[`button__${variant}`],
      {
        [styles.button__rounded]: rounded,
        [styles.button__disabled]: disabled,
        [styles.button__iconLeft]:
          iconProps && iconProps.icon && iconProps.iconPosition === 'left',
        [styles.button__iconRight]:
          iconProps && iconProps.icon && iconProps.iconPosition === 'right',
        [styles[`button__outlined__${variant}`]]: type === 'outlined',
        [styles[`button__text__${variant}`]]: type === 'text',
      },
      className,
    );

    if (type === 'link') {
      return (
        // TODO @swapnil make this button and link styles
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <a
          data-testid="link-button"
          data-test-id={dataTestId}
          {...linkProps}
          className={buttonClasses}
          onClick={onClick}
        >
          {renderButtonContent({ children, iconProps, loading, type })}
        </a>
      );
    }

    return (
      <button
        ref={ref as any}
        type="button"
        className={buttonClasses}
        onClick={onClick}
        onMouseDown={onMouseDown}
        disabled={disabled}
        data-testid="button"
        data-test-id={dataTestId}
        {...props}
      >
        {renderButtonContent({ children, iconProps, loading, type })}
      </button>
    );
  },
);

export default React.memo(Button);
