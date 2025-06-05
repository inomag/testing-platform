/* eslint-disable complexity */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import { checkErrors, getTextAreaId } from './queries';
import { TextAreaProps } from './type';
import styles from './index.module.scss';

const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.PropsWithChildren<TextAreaProps>
>(
  (
    {
      label = '',
      id = '',
      validations = [],
      required = false,
      onChange = () => {},
      classNames,
      subMessage = undefined,
      placeholder = '',
      value,
      'data-test-id': dataTestId,
      'data-index': dataIndex,
      hideValidation = false,
      disabled = false,
      onClick = () => {},
      min,
      max,
      minLines = 3,
      charactersPerLine,
      resize = true,
      viewMode = false,
    },
    ref,
  ) => {
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const textAreaId = getTextAreaId(label, id);

    const validate = useCallback(
      (val: string): { isValid: boolean; errors: string[] } => {
        const tempErrors: string[] = checkErrors(
          val,
          validations,
          label,
          required,
          min,
          max,
        );
        setErrors(tempErrors);

        return { isValid: tempErrors.length === 0, errors: tempErrors };
      },
      [label, required, validations, min, max],
    );

    useImperativeHandle(
      ref,
      () =>
        ({
          get element() {
            return textAreaRef.current;
          },
          checkValidity: () =>
            validate(textAreaRef.current?.value || '').isValid,
          value: textAreaRef.current?.value,
          contains: textAreaRef.current?.contains.bind(textAreaRef.current),
        } as any),
      [validate, textAreaRef],
    );

    const handleTextAreaChange = useCallback((validValue: boolean) => {
      setTouched(true);
      setValid(validValue);
    }, []);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        const { isValid: validValue, errors: currentError } =
          validate(newValue);
        handleTextAreaChange(validValue);
        onChange(newValue, event, undefined, validValue, currentError);
      },
      [handleTextAreaChange, onChange, validate],
    );

    const textAreaParentClasses = classnames(
      [styles.texArea],
      {
        [styles.texArea__error]:
          required && validations.length > 0 && touched && !valid,
        [styles.texArea__success]:
          required && validations.length > 0 && touched && valid,
        [styles.texArea__disabled]: disabled,
      },
      classNames,
    );

    const textAreaClasses = classnames(
      [styles.texArea__field],
      {
        [styles.texArea__resizeNone]: !resize,
      },
      classNames,
    );

    if (viewMode) {
      return <div>{value}</div>;
    }

    return (
      <div className={styles.texArea__wrapper}>
        {label && (
          <label
            className={styles.texArea__label}
            htmlFor={id}
            data-test-id={`${dataTestId}_label`}
          >
            {label}
          </label>
        )}
        <div className={textAreaParentClasses}>
          <textarea
            id={textAreaId}
            className={textAreaClasses}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            ref={textAreaRef}
            data-test-id={dataTestId}
            data-index={dataIndex}
            disabled={disabled}
            onClick={onClick}
            rows={minLines}
            cols={charactersPerLine}
          />
        </div>
        {!hideValidation && touched && !valid && (
          <div className={styles.texArea__errors}>
            {errors.map((error, index) => (
              <div
                data-test-id={`${dataTestId}-error-${index}`}
                data-testid="text-area-error"
                key={error}
                className={styles.texArea__error}
              >
                {error}
              </div>
            ))}
          </div>
        )}
        {subMessage && (
          <div
            data-test-id={`${dataTestId}-subMessage`}
            className={styles.texArea__sub__message}
          >
            {subMessage}
          </div>
        )}
      </div>
    );
  },
);

export default React.memo(TextArea);
