import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import {
  Option as OptionProps,
  RadioButtonProps,
  RadioGroupProps,
} from './types';
import styles from './index.module.scss';

export const Option = React.memo(
  ({
    id,
    name,
    value,
    label,
    checked,
    onChange,
    className = '',
    disabled = false,
    'data-test-id': dataTestId,
    radioDivClasses = '',
    variant,
  }: RadioButtonProps) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(
            [
              {
                code: value,
                name: typeof label === 'string' ? label : value,
              },
            ],
            event,
          );
        }
      },
      [label, onChange, value],
    );

    return (
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label
        data-test-id={`option-${dataTestId}`}
        className={classnames(styles['radio-button'], radioDivClasses)}
      >
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={classnames(styles['radio-button__input'], className, {
            [styles['radio-button__input__filled']]: variant === 'filled',
          })}
          data-test-id={`input-${dataTestId}-${id}`}
        />
        <span
          data-test-id={`checkmark-${dataTestId}-${id}`}
          data-selected={checked}
          className={classnames(styles['radio-button__custom-circle'], {
            [styles['radio-button__custom-circle--checked']]: checked,
            [styles['radio-button__custom-circle--filled']]:
              variant === 'filled',
            [styles['radio-button__custom-circle--disabled']]: disabled,
          })}
        />
        <label
          data-test-id={`label-${dataTestId}-${id}`}
          htmlFor={id}
          className={classnames(styles['radio-button__label'], {
            [styles['radio-button__label--checked']]: checked,
            [styles['radio-button__label__filled']]: variant === 'filled',
            [styles['radio-button__label--disabled']]: disabled,
          })}
        >
          {label}
        </label>
      </label>
    );
  },
);

export const RadioGroup = React.memo(
  ({
    name,
    value = '',
    orientation = 'horizontal',
    onChange,
    disabled = false,
    classNames = '',
    children,
    type = 'radio',
    variant = 'primary',
    'data-test-id': dataTestId,
    viewMode = false,
  }: React.PropsWithChildren<RadioGroupProps>) => {
    const [state, setState] = useState<string>(value);
    const classes = classnames(
      styles['radio-group'],
      styles[`radio-group__${orientation}`],
      classNames,
      { [styles['radio-group__tabs']]: type === 'tabs' },
      { [styles['radio-group__chip-radio']]: type === 'chipRadio' },
    );

    const radioDivClasses = useCallback(
      (checked: boolean) =>
        classnames(styles['radio-button-div'], {
          [styles.radioButtonDiv__chipRadio]: type === 'chipRadio',
          [styles.radioButtonDiv__chipRadio__checked]:
            type === 'chipRadio' && checked,
        }),
      [type],
    );

    useEffect(() => {
      setState(value);
    }, [value]);

    const handleChange = useCallback(
      (
        newValue: OptionProps[] | undefined,
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        if (newValue?.[0]?.code) {
          setState(newValue[0].code);
          if (onChange) {
            onChange(newValue, event);
          }
        }
      },
      [onChange],
    );

    const renderContent = () => {
      if (React.Children.count(children) === 0) {
        return <div>{state}</div>;
      }

      if (viewMode) {
        return React.Children.map(children, (child) => {
          if (
            React.isValidElement<RadioButtonProps>(child) &&
            child.props?.value === state
          ) {
            return <div>{child.props?.label}</div>;
          }
          return null;
        });
      }

      return React.Children.map(children, (child, index) => {
        if (!React.isValidElement<RadioButtonProps>(child)) return null;

        const isChecked = state === child.props?.value;
        const childClasses =
          isChecked && type === 'tabs'
            ? `${styles['active-tab']} ${child.props?.className}`
            : child.props?.className;

        return React.cloneElement(child, {
          key: `${name}_${child.props?.value}`,
          id: `${name}_${index}`,
          name,
          checked: isChecked,
          onChange: handleChange,
          disabled: disabled || child.props?.disabled,
          label: child.props?.label,
          className: childClasses,
          'data-test-id': dataTestId,
          radioDivClasses: radioDivClasses(isChecked),
          variant,
        });
      });
    };

    return (
      <div data-test-id={`radio-group-${dataTestId}`} className={classes}>
        {renderContent()}
      </div>
    );
  },
);

export default React.memo(RadioGroup);
