import { noop } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import { ReactComponent as Checkmark } from 'src/assets/icons/Icon.svg';
import { CheckboxGroupProps, CheckboxProps } from './types';
import styles from './index.module.scss';

function Checkbox({
  id,
  onChange,
  disabled = false,
  label = '',
  size = 'medium',
  value = false,
  'data-test-id': dataTestId,
  className,
  indeterminate = false,
  ...additionalProps
}: React.PropsWithChildren<CheckboxProps>) {
  let checked = useMemo(() => Boolean(value), [value]);

  // Use ref to access the input element directly
  const checkboxRef: any = useRef(null);

  // Set indeterminate state when component mounts or updates
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // if selectedValue that means its coming from Checkbox Group
  // @ts-ignore
  if (additionalProps.selectedValues) {
    // @ts-ignore
    checked = additionalProps.selectedValues?.includes(value);
  }
  const handleCheckboxChange = useCallback(
    (event) => {
      if (onChange) {
        onChange(!checked, String(value), event);
      }
      return null;
    },
    [value, onChange, checked],
  );

  const wrapperClasses = classnames(
    styles.checkbox__wrapper,
    {
      [styles.checkbox__wrapper__disabled]: disabled,
      [styles[`checkbox__wrapper__${size}`]]: size,
    },
    className,
  );

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label data-test-id={`${dataTestId}-wrapper`} className={wrapperClasses}>
      <input
        id={id}
        type="checkbox"
        ref={checkboxRef}
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        className={classnames(styles.checkbox__wrapper__input)}
        data-test-id={`${dataTestId}-input`}
        onClick={(event) => event.stopPropagation()}
      />
      <span
        className={classnames(styles.checkbox__wrapper__checkmark)}
        data-test-id={`${dataTestId}-checkmark`}
      >
        <Checkmark />
      </span>
      <label
        className={classnames(styles.checkbox__wrapper__label)}
        data-test-id={`${dataTestId}-label`}
        htmlFor={id}
      >
        {label}
      </label>
    </label>
  );
}

function CheckboxGroup({
  children,
  onChange = noop,
  disabled = false,
  orientation = 'vertical',
  value = [],
  classNames,
  size = 'medium',
  'data-test-id': dataTestId,
}: React.PropsWithChildren<CheckboxGroupProps>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const handleCheckboxChange = useCallback(
    (checked: boolean, checkboxValue, event) => {
      let updatedSelectedValues: string[];
      if (checked) {
        updatedSelectedValues = [...selectedValues, checkboxValue];
      } else {
        updatedSelectedValues = selectedValues.filter(
          (selectedValue) => selectedValue !== checkboxValue,
        );
      }
      setSelectedValues(updatedSelectedValues);
      onChange(updatedSelectedValues, event);
    },
    [onChange, selectedValues],
  );

  return (
    <div
      data-test-id={`${dataTestId}-checkbox-group`}
      className={classnames(
        [styles['checkbox-group']],
        {
          [styles['checkbox-group__horizontal']]: orientation === 'horizontal',
        },
        classNames,
      )}
    >
      {children &&
        React.Children.map(children, (child, index) => {
          if (React.isValidElement<CheckboxProps>(child)) {
            return React.cloneElement(child, {
              // @ts-ignore
              selectedValues,
              onChange: handleCheckboxChange,
              disabled: disabled || child.props.disabled,
              size,
              'data-test-id': `${dataTestId}-${index}`,
              classNames: child.props.className,
              indeterminate: child.props.indeterminate,
            });
          }
          return null;
        })}
    </div>
  );
}

export { CheckboxGroup, Checkbox };
