/* eslint-disable complexity */
import _ from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Loader from 'src/@vymo/ui/atoms/loader';
import Tag from 'src/@vymo/ui/atoms/tagInput/tag';
import classnames from 'classnames';
import { ReactComponent as CrossIcon } from 'src/assets/icons/cross.svg';
import { ReactComponent as EyeOff } from 'src/assets/icons/eyeOff.svg';
import { ReactComponent as EyeOn } from 'src/assets/icons/eyeOn.svg';
import { ReactComponent as LockIcon } from 'src/assets/icons/lock.svg';
import {
  displayDeModifierDefault,
  displayModifierDefault,
  MASK_DELAY,
} from './constants';
import { checkErrors, getSecureInputValue } from './queries';
import { InputProps } from './types';
import styles from './index.module.scss';

const Input = forwardRef<HTMLInputElement, React.PropsWithChildren<InputProps>>(
  (
    {
      label = '',
      id = '',
      type: inputType = 'text',
      iconLeft,
      iconRight,
      validations = [],
      required = false,
      onChange = () => {},
      classNames,
      subMessage = undefined,
      placeholder = '',
      value = '',
      'data-test-id': dataTestId,
      'data-index': dataIndex,
      hideValidation = false,
      disabled = false,
      onClick = () => {},
      isOnChangeArgFirstEvent = false,
      clearInputIcon = true,
      min,
      max,
      minLength,
      maxLength,
      displayModifier = displayModifierDefault,
      displayDeModifier = displayDeModifierDefault,
      size,
      showDisabledIcon = false,
      loading = false,
      variant = 'input',
      onFocus = _.noop,
      onBlur = _.noop,
      onMouseDown = _.noop,
      onKeyDown = _.noop,
      onTouchStart = _.noop,
      secureValue = false,
      showSecureValueIcon = true,
      onPaste = _.noop,
      renderInputBase,
      tag = null,
      viewMode = false,
    },
    ref,
  ) => {
    let inputMode;
    let type = inputType;
    if (inputType === 'number') {
      type = 'text';
      inputMode = 'numeric';
    }
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isHover, setisHover] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(value);

    const [maskedValue, setMaskedValue] = useState(value);
    const [showMaskValue, setShowMaskValue] = useState(false);
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const isFirsMount = useRef(true);

    const handleMaskValue = useCallback(
      (inputChangeValue: string | number, isFirstMount = false) => {
        const currentValue = String(inputChangeValue);

        if (isFirstMount) {
          setMaskedValue(currentValue.replace(/./g, '*'));
        } else {
          // clear previous timers
          if (timerId.current) {
            clearTimeout(timerId.current);
          }

          // mask all characters except the last one
          const maskAllExceptLast =
            currentValue.slice(0, -1).replace(/./g, '*') +
            currentValue.slice(-1);

          setMaskedValue(maskAllExceptLast);

          const newTimerId = setTimeout(() => {
            setMaskedValue(currentValue.replace(/./g, '*'));
          }, MASK_DELAY);

          timerId.current = newTimerId;
        }
      },
      [timerId],
    );

    useEffect(() => {
      handleMaskValue(value, isFirsMount.current);
      setInputValue(value);
      if (isFirsMount.current) {
        isFirsMount.current = false;
      }
    }, [handleMaskValue, value]);

    const displayValue =
      secureValue && !showMaskValue ? maskedValue : displayModifier(inputValue);

    const validate = useCallback(
      (val: string): { isValid: boolean; errors: string[] } => {
        const tempErrors: string[] = checkErrors(
          val,
          validations,
          label,
          required,
          minLength,
          maxLength,
        );

        if (!_.isEqual(errors, tempErrors)) {
          setErrors(tempErrors);
        }

        return { isValid: tempErrors.length === 0, errors: tempErrors };
      },
      [validations, label, required, minLength, maxLength, errors],
    );

    useImperativeHandle(
      ref,
      () =>
        Object.assign((inputRef.current as any) ?? {}, {
          checkValidity: () => validate(inputRef.current?.value || '').isValid,
          value: inputRef.current?.value,
          contains: inputRef.current?.contains.bind(inputRef.current),
        } as any),

      [validate, inputRef],
    );

    const handleValidate = useCallback((validValue: boolean) => {
      setTouched(true);
      setValid(validValue);
    }, []);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputChangeValue = event.target.value;
        if (inputType === 'number') {
          inputChangeValue = inputChangeValue.replace(/\D/g, '');
        }

        if (secureValue) {
          inputChangeValue = getSecureInputValue(inputChangeValue, inputValue);
        }

        setInputValue(inputChangeValue);

        handleMaskValue(inputChangeValue);

        let inputDeModifyValue = displayDeModifier(inputChangeValue);
        if (typeof inputDeModifyValue === 'string') {
          inputDeModifyValue = inputDeModifyValue.trimEnd();
        }

        const { isValid: validValue, errors: currentError } =
          validate(inputDeModifyValue);

        handleValidate(validValue);
        if (isOnChangeArgFirstEvent) {
          onChange(
            event,
            inputDeModifyValue,
            undefined,
            validValue,
            currentError,
          );
        } else {
          onChange(
            inputDeModifyValue,
            event,
            undefined,
            validValue,
            currentError,
          );
        }
      },
      [
        inputType,
        secureValue,
        handleMaskValue,
        displayDeModifier,
        validate,
        handleValidate,
        isOnChangeArgFirstEvent,
        inputValue,
        onChange,
      ],
    );

    const handleChangeClear = useCallback(
      (event: React.SyntheticEvent<SVGSVGElement>) => {
        const newValue = '';
        setInputValue(newValue);
        const { isValid: validValue, errors: currentError } =
          validate(newValue);
        handleValidate(validValue);
        // @ts-ignore
        event.target.value = '';

        handleMaskValue(newValue);

        if (isOnChangeArgFirstEvent) {
          onChange(event, newValue, undefined, validValue, currentError);
        } else {
          onChange(newValue, event, undefined, validValue, currentError);
        }
      },
      [
        handleMaskValue,
        handleValidate,
        isOnChangeArgFirstEvent,
        onChange,
        validate,
      ],
    );

    const handlePaste = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (secureValue) {
          event.preventDefault(); // Prevent paste if secureValue is true
        } else {
          onPaste(event);
        }
      },
      [onPaste, secureValue],
    );

    const handleCopy = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (secureValue) {
          event.preventDefault(); // Prevent copy if secureValue is true
        }
      },
      [secureValue],
    );

    const handleCut = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (secureValue) {
          event.preventDefault(); // Prevent cut if secureValue is true
        }
      },
      [secureValue],
    );

    const handleShowMaskValue = useCallback(() => {
      setShowMaskValue(!showMaskValue);
    }, [showMaskValue]);

    if (secureValue && !disabled && showSecureValueIcon) {
      clearInputIcon = false;
      iconRight = showMaskValue ? (
        <EyeOff
          onClick={handleShowMaskValue}
          data-test-id={`${dataTestId}-hideSecureValue`}
        />
      ) : (
        <EyeOn
          onClick={handleShowMaskValue}
          data-test-id={`${dataTestId}-showSecureValue`}
        />
      );
    }

    const clearInputIfValue =
      clearInputIcon && (displayValue || displayValue === 0);

    if (clearInputIfValue && isHover && !disabled) {
      iconRight = (
        <CrossIcon
          onClick={handleChangeClear}
          data-test-id={`${dataTestId}-clearInput`}
          className={classnames(styles.input__icon__close)}
        />
      );
    }

    if (loading) {
      iconRight = <Loader size="small" visible={loading} />;
    }
    if (disabled && showDisabledIcon) {
      iconRight = <LockIcon data-test-id={`${dataTestId}-lock-icon`} />;
    }

    const handleHover = useCallback(() => setisHover(true), []);
    const handleLeave = useCallback(() => setisHover(false), []);

    const inputClasses = classnames(classNames, styles.input, {
      [styles.input__error]:
        !hideValidation &&
        required &&
        validations.length > 0 &&
        touched &&
        !valid,
      [styles.input__success]:
        !hideValidation &&
        required &&
        validations.length > 0 &&
        touched &&
        valid,
      [styles.input__disabled]: disabled,
    });

    if (viewMode) {
      if (variant === 'custom') {
        return <div>{renderInputBase}</div>;
      }
      return iconLeft ? (
        <div
          className={classnames(styles.input__icon, styles.input__icon__left)}
          data-test-id={`${dataTestId}-icon`}
        >
          {`${iconLeft} ${displayValue}`}
        </div>
      ) : (
        <div>{displayValue}</div>
      );
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={styles.input__wrapper}
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        onMouseOver={handleHover}
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        onMouseOut={handleLeave}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onTouchStart={onTouchStart}
      >
        {label && (
          <label
            data-test-id={`${dataTestId}-label`}
            className={styles.input__label}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className={inputClasses}>
          {iconLeft && (
            <div
              className={classnames(
                styles.input__icon,
                styles.input__icon__left,
              )}
              data-test-id={`${dataTestId}-icon`}
            >
              {iconLeft}
            </div>
          )}

          {variant === 'custom' && (
            <div
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              ref={inputRef}
              className={`${styles.input__field} ${styles.input__field__custom}`}
              data-test-id={dataTestId}
            >
              {renderInputBase}
            </div>
          )}

          {variant === 'input' && (
            <input
              className={classnames(styles.input__field, {
                [styles.input__field__notSelectable]: secureValue,
              })}
              type={type}
              value={displayValue}
              onChange={handleChange}
              placeholder={placeholder}
              ref={inputRef}
              data-test-id={dataTestId}
              data-index={dataIndex}
              disabled={disabled}
              inputMode={inputMode}
              size={size}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCut}
              min={min}
              max={max}
              minLength={minLength}
              maxLength={maxLength}
            />
          )}

          {variant === 'block' && (
            <div
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              className={`${styles.input__field} ${styles.input__field__block} `}
              ref={inputRef}
              data-test-id={dataTestId}
              data-index={dataIndex}
            >
              {displayValue || (
                <div className={styles.input__field__block__placeholder}>
                  {placeholder}
                </div>
              )}
            </div>
          )}
          {tag && <Tag variant={tag.variant}>{tag.text}</Tag>}

          {iconRight && (
            <div
              className={classnames(
                styles.input__icon,
                styles.input__icon__right,
              )}
              data-test-id={`${dataTestId}-icon`}
            >
              {iconRight}
            </div>
          )}
        </div>
        {!hideValidation && touched && !valid && (
          <div className={styles.input__errors}>
            {errors.map((error, index) => (
              <div
                data-test-id={`${dataTestId}-error-${index}`}
                key={error}
                className={styles.input__error}
              >
                {error}
              </div>
            ))}
          </div>
        )}
        {subMessage && (
          <div
            data-test-id={`${dataTestId}-subMessage`}
            className={styles.input__sub__message}
          >
            {subMessage}
          </div>
        )}
      </div>
    );
  },
);

export default React.memo(Input);
