import _ from 'lodash';
import React, {
  forwardRef,
  MutableRefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import TagInput from 'src/@vymo/ui/atoms/tagInput';
import classnames from 'classnames';
import { ReactComponent as CaretUpRound } from 'src/assets/icons/caretUp.svg';
import { ReactComponent as CaretDownRound } from 'src/assets/icons/down.svg';
import { ReactComponent as Search } from 'src/assets/icons/search.svg';
import { isNodeDescendant } from 'src/workspace/utils';
import * as constants from './constants';
import OptionsList from './options';
import { getFlattenOptions, getOpenNodeIds, getSearchResult } from './queries';
import { Option, SelectProps } from './types';
import styles from './index.module.scss';

const emptySelectValue = [];

const Select = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<SelectProps>
>(
  // eslint-disable-next-line max-lines-per-function
  (
    {
      placeholder = '',
      options = [],
      value = emptySelectValue,
      expandedNodesLevel = 1,
      multi: isMulti,
      search: isSearchable = false,
      onChange = _.noop,
      disabled = false,
      'data-test-id': dataTestId = 'select',
      onSearchInputChange = _.noop,
      optionsListLoading = false,
      loading = false,
      clearInputIcon = false,
      showDisabledIcon = false,
      viewMode = false,
      classNames = '',
    },
    ref,
  ) => {
    if (loading) {
      disabled = true;
    }

    const [showMenu, setShowMenu] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [selectedValue, setSelectedValue] =
      useState<Array<Option>>(emptySelectValue);
    const [searchValue, setSearchValue] = useState('');
    const [isFocussed, setIsFocussed] = useState(false);

    const optionsListRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef() as MutableRefObject<any>;

    useImperativeHandle(ref as any, () => ({
      // @ts-ignore
      getOptionsList: optionsListRef.current?.getOptionsList,
    }));

    useEffect(() => {
      setSearchValue('');
      if (showMenu && inputRef.current) {
        inputRef.current.focus();
      }
    }, [showMenu]);

    const flattenOptions = useMemo(() => {
      const flattenOptionsData = getFlattenOptions(options);
      const openNodeIds = getOpenNodeIds(flattenOptionsData);
      // @ts-expect-error useImperative hook
      optionsListRef?.current?.setOpenNodesId?.(openNodeIds);

      return flattenOptionsData;
    }, [options]);

    useEffect(() => {
      if (value) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        value = Array.isArray(value) ? value : [value];

        const defaultValueLabel = flattenOptions.filter(
          // @ts-ignore
          ({ value: optionValue }) =>
            (value as Array<any>).find(
              (selectedKey) =>
                selectedKey === optionValue ||
                // this would work for form where value is object or Array of object
                selectedKey?.value === optionValue,
            ),
        );

        if (defaultValueLabel.length === 0 && flattenOptions.length === 1) {
          defaultValueLabel.push(flattenOptions?.[0]);
        }

        setSelectedValue(defaultValueLabel);
      } else {
        setSelectedValue(emptySelectValue);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const onClickOutsideHandler = useCallback(
      (event) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target) &&
          !isNodeDescendant(inputRef.current, event.target) &&
          showMenu
        ) {
          setShowMenu(false);
          setIsSearch(false);
          setIsFocussed(false);
          inputRef.current.blur();
        }
      },
      [showMenu],
    );

    useEffect(() => {
      window.addEventListener('click', onClickOutsideHandler);
      return () => {
        window.removeEventListener('click', onClickOutsideHandler);
      };
    }, [onClickOutsideHandler]);

    const onFocusEvent = useCallback(() => {
      setIsFocussed(true);
    }, []);

    const onBlurEvent = useCallback(() => {
      setIsFocussed(false);
    }, []);

    const handleInputClick = useCallback(() => {
      setShowMenu(!showMenu);
      // @ts-expect-error useImperative hook
      optionsListRef?.current?.setOpenNodesId?.([]);
    }, [showMenu]);

    const removeOption = useCallback(
      (option) =>
        selectedValue.filter(({ value: selValue }) => selValue !== option),
      [selectedValue],
    );

    const onItemClick = useCallback(
      (option: Option, event: SyntheticEvent) => {
        let newValue;
        if (isMulti) {
          const isItemAlreadySelected =
            selectedValue.findIndex((o) => o.value === option.value) >= 0;
          if (isItemAlreadySelected) {
            newValue = removeOption(option.value);
          } else {
            newValue = [...selectedValue, option];
          }
          setSelectedValue(newValue);
          onChange(newValue, event);
        } else {
          setSelectedValue([option]);
          onChange([option], event);
          setShowMenu(false);
          setIsFocussed(false);
        }

        setIsSearch(false);
        setSearchValue('');
      },
      [isMulti, onChange, removeOption, selectedValue],
    );

    const isSelected = useCallback(
      (option) => {
        if (isMulti) {
          return (
            selectedValue.filter((o) => o.value === option.value).length > 0
          );
        }

        if (!selectedValue[0]) {
          return false;
        }
        return selectedValue[0].value === option.value;
      },
      [isMulti, selectedValue],
    );

    const onSearch = useCallback(
      (searchInputValue) => {
        if (isSearchable) {
          if (searchInputValue) {
            setIsSearch(true);
          } else {
            setIsSearch(false);
          }

          setSearchValue(searchInputValue);
          setShowMenu(true);
          const filterResult = getSearchResult(
            flattenOptions,
            searchInputValue,
          );
          const openNodeIds = getOpenNodeIds(filterResult);
          // @ts-expect-error useImperative hook
          optionsListRef?.current?.setOpenNodesId?.(openNodeIds);
        }
      },
      [flattenOptions, isSearchable],
    );

    const onPressKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const keyType = event.key;
        if (
          !showMenu ||
          (showMenu &&
            ![
              constants.ENTER,
              constants.ARROW_DOWN,
              constants.ARROW_UP,
            ].includes(keyType))
        ) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        const optionList = optionsListRef?.current;
        if ([constants.ENTER].includes(keyType)) {
          // @ts-expect-error useImperative hook
          const option = optionList?.getSelectedOption();

          if (!option) {
            return;
          }

          if (option.hasChildren) {
            // @ts-expect-error useImperative hook
            optionList?.onAccordionClick(event, option.id);
          } else {
            onItemClick(option, event as SyntheticEvent);
            if (!isMulti) {
              setShowMenu(false);
              inputRef.current.blur();
            }
          }
        }

        if (
          keyType === constants.ARROW_UP ||
          keyType === constants.ARROW_DOWN
        ) {
          // @ts-expect-error useImperative hook
          optionList?.focus(keyType);
        }
      },

      [isMulti, onItemClick, showMenu],
    );

    const getSelectIcon = useCallback(() => {
      if (showMenu) {
        if (isSearchable) {
          return <Search />;
        }
        return <CaretUpRound />;
      }
      return <CaretDownRound />;
    }, [showMenu, isSearchable]);

    const selectClassName = classnames(classNames, {
      [styles.customSelect__disabled]: disabled,
      [styles.customSelect__focused]: isFocussed,
    });

    const selectValue = useMemo(() => {
      if (showMenu) {
        return searchValue;
      }
      return selectedValue?.[0]
        ? `${selectedValue?.[0]?.displayPrefix ?? ''}${
            selectedValue?.[0]?.label
          }`
        : '';
    }, [searchValue, selectedValue, showMenu]);

    const onChangeMultiSelect = useCallback(
      (multiselectValue: Option[]) => {
        setSelectedValue(multiselectValue);
        onChange(multiselectValue);
      },
      [onChange],
    );

    const getSelectInput = useCallback(
      () =>
        isMulti ? (
          <TagInput
            data-test-id={dataTestId}
            ref={inputRef}
            onKeyDown={onPressKeyDown}
            onClick={handleInputClick}
            classNames={selectClassName}
            onFocus={onFocusEvent}
            onBlur={onBlurEvent}
            loading={loading}
            iconRight={getSelectIcon()}
            onChange={onChangeMultiSelect}
            value={selectedValue}
            placeholder={placeholder}
            clearInputIcon
            showInput={isSearchable}
            createTagOnEnter={false}
            onInputChange={onSearch}
            disabled={disabled}
            showDisabledIcon={showDisabledIcon}
            viewMode={viewMode}
          />
        ) : (
          <Input
            data-test-id={dataTestId || 'select-field'}
            ref={inputRef}
            onKeyDown={onPressKeyDown}
            onClick={handleInputClick}
            classNames={selectClassName}
            onFocus={onFocusEvent}
            onBlur={onBlurEvent}
            loading={loading}
            iconLeft={selectedValue?.[0]?.icon}
            iconRight={getSelectIcon()}
            onChange={onSearch}
            placeholder={selectedValue?.[0]?.label ?? placeholder}
            value={selectValue}
            variant={isSearchable ? 'input' : 'block'}
            clearInputIcon={clearInputIcon}
            disabled={disabled}
            showDisabledIcon={showDisabledIcon}
            viewMode={viewMode}
          />
        ),

      [
        clearInputIcon,
        dataTestId,
        getSelectIcon,
        handleInputClick,
        isMulti,
        isSearchable,
        loading,
        onBlurEvent,
        onChangeMultiSelect,
        onFocusEvent,
        onPressKeyDown,
        onSearch,
        placeholder,
        selectClassName,
        selectValue,
        selectedValue,
        disabled,
        showDisabledIcon,
        viewMode,
      ],
    );
    return (
      <div style={{ position: 'relative' }}>
        {getSelectInput()}
        {showMenu && (
          <OptionsList
            data-test-id={`${dataTestId}-optionList`}
            ref={optionsListRef}
            isSelected={isSelected}
            options={options}
            onItemClick={onItemClick}
            expandedNodesLevel={expandedNodesLevel}
            isSearch={isSearch}
            isMulti={Boolean(isMulti)}
            inputRef={inputRef}
            showMenu={showMenu}
            loading={optionsListLoading}
            onSearchInputChange={onSearchInputChange}
          />
        )}
      </div>
    );
  },
);

export default React.memo(Select);
