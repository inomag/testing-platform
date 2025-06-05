import _ from 'lodash';
import React, {
  forwardRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import * as constants from './constants';
import Tag from './tag';
import type { Option, Props } from './types';
import styles from './index.module.scss';

const MultiTagInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<Props>
>(
  // eslint-disable-next-line complexity
  (
    {
      onChange = _.noop,
      value,
      onInputChange = _.noop,
      showInput = true,
      createTagOnEnter = true,
      'data-test-id': dataTestId,
      maxTagCount = false,
      disabled = false,
      viewMode = false,
      ...props
    },
    ref,
  ) => {
    const [options, setOptions] = React.useState<Option[]>(value);
    const [searchValue, setSearchValue] = React.useState<string>('');

    useEffect(() => {
      setOptions(value);
      setSearchValue('');
    }, [onInputChange, value]);

    const removeOption = useCallback(
      (option) =>
        (options as Option[]).filter(
          ({ value: selValue }) => selValue !== option,
        ),
      [options],
    );

    const onTagRemove = useCallback(
      (event: SyntheticEvent) => {
        event.stopPropagation();
        const tagElement = event.currentTarget
          .parentElement as HTMLInputElement;
        const removedOptions = tagElement.getAttribute('data-id');
        const newValue = removeOption(removedOptions);
        setOptions(newValue);
        onChange(newValue, event);
      },
      [onChange, removeOption],
    );

    const onChangeInput = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = event.target;
        setSearchValue(inputValue);
        onInputChange(searchValue);
      },
      [onInputChange, searchValue],
    );

    const onPressKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const keyType = event.key;

        if ([constants.ENTER].includes(keyType)) {
          onInputChange(searchValue);
          if (searchValue && createTagOnEnter) {
            const newValue = [
              ...options,
              { label: searchValue, value: searchValue },
            ];
            setOptions(newValue);
            onChange(newValue, event);
            setSearchValue('');
          }
        }
      },
      [createTagOnEnter, onChange, onInputChange, searchValue, options],
    );

    const inputAvaialbleSize = useMemo(
      () => Number(searchValue.length || constants.INPUT_SIZE),
      [searchValue],
    );

    return (
      <Input
        {...props}
        variant="custom"
        ref={!showInput ? ref : null}
        data-test-id={dataTestId}
        disabled={disabled}
        clearInputIcon={false}
        renderInputBase={
          <>
            <div data-test-id={`${dataTestId}-value`}>
              {((options as Option[]) || [])
                .slice(0, maxTagCount || options.length) // Take only the first 4 tags
                .map((tag) => (
                  <Tag
                    key={tag.value}
                    closable={!viewMode}
                    data-id={tag.value}
                    onClose={onTagRemove}
                    data-test-id={`${dataTestId}-${tag.value}`}
                    className={styles.tagInput__fontMedium}
                  >
                    <div>{`${tag.displayPrefix ?? ''}${tag.label}`}</div>
                  </Tag>
                ))}
              {maxTagCount &&
                !viewMode &&
                ((options as Option[]) || []).length > maxTagCount && (
                  <Tag
                    key="more"
                    closable={false}
                    data-id="more"
                    data-test-id={`${dataTestId}-more`}
                  >
                    <div>
                      + {((options as Option[]) || []).length - maxTagCount}{' '}
                      more
                    </div>
                  </Tag>
                )}
            </div>
            {showInput && !disabled && !viewMode && (
              <input
                type="text"
                className={styles.tagInput__input}
                onChange={onChangeInput}
                onKeyDown={onPressKeyDown}
                value={searchValue}
                ref={ref}
                size={inputAvaialbleSize}
                placeholder={!options.length ? props.placeholder : ''}
              />
            )}
          </>
        }
        viewMode={viewMode}
      />
    );
  },
);

// @ts-ignore
MultiTagInput.Tag = Tag;

export default React.memo(MultiTagInput);
