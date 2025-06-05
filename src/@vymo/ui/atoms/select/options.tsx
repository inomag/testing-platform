import _ from 'lodash';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Loader from 'src/@vymo/ui/atoms/loader';
import Text from 'src/@vymo/ui/atoms/text';
import classNames from 'classnames';
import { ReactComponent as CaretDownRound } from 'src/assets/icons/caretDown.svg';
import { ReactComponent as CaretRightRound } from 'src/assets/icons/caretRight.svg';
import { ReactComponent as Check } from 'src/assets/icons/check.svg';
import { ReactComponent as Empty } from 'src/assets/icons/empty.svg';
import { ORIENTATION } from './constants';
import { getExpandedOptions, getOpenNodeIds, getUpdatedIndex } from './queries';
import { OptionsListProps } from './types';
import styles from './index.module.scss';

const Options = React.forwardRef((props: OptionsListProps, ref) => {
  const {
    options,
    style,
    onItemClick,
    isSelected = () => {},
    expandedNodesLevel = 0,
    isSearch,
    inputRef,
    showMenu,
    showNoData = true,
    loading = false,
    'data-test-id': dataTestId,
    onSearchInputChange,
    isMulti,
  } = props;

  const [openNodesId, setOpenNodesId] = useState([]) as any;
  const [position, setPosition] = useState({});
  const [orientation, setOrientation] = useState<string>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hideCursor, setHideCursor] = useState(false);
  const [search, setSearch] = useState(isSearch);

  const optionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(isSearch);
  }, [isSearch]);

  useEffect(() => {
    const flattenOptions = getExpandedOptions(
      openNodesId,
      options,
      search,
      expandedNodesLevel,
    );

    const openNodeIds = getOpenNodeIds(flattenOptions);

    setOpenNodesId(openNodeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAccordionClick = useCallback(
    (event, optionId) => {
      event.stopPropagation();
      const nodeId =
        optionId ??
        String(
          (event.currentTarget as HTMLInputElement).getAttribute('data-nodeid'),
        );
      if (openNodesId.includes(nodeId)) {
        const filterNodeIds = openNodesId.filter(
          (openNodeId) => openNodeId !== nodeId,
        );
        setOpenNodesId(filterNodeIds);
      } else {
        setOpenNodesId([...openNodesId, nodeId]);
      }
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    },
    [openNodesId, inputRef, setOpenNodesId],
  );

  const filteredOptions = useMemo(
    () => getExpandedOptions(openNodesId, options, search),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openNodesId, search],
  );

  useEffect(() => {
    if (search && inputRef?.current) {
      // @ts-ignore
      const { value = '' } = inputRef?.current ?? {};
      onSearchInputChange(value);
    }

    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(openNodesId), search, inputRef?.current?.value]);

  useImperativeHandle(ref as any, () => ({
    focus: (keyType) => {
      const index = getUpdatedIndex(
        selectedIndex,
        keyType,
        filteredOptions?.length,
      );
      setSelectedIndex(index);
      setHideCursor(true);
      const optionListElement = (optionListRef as RefObject<HTMLDivElement>)
        ?.current;
      const selectedElement = optionListElement?.children?.[index];
      const scrollY =
        Number(selectedElement?.getBoundingClientRect?.()?.height) * index;
      (optionListRef as RefObject<HTMLDivElement>).current?.scrollTo(
        0,
        scrollY,
      );
    },
    getSelectedIndex: () => selectedIndex,
    getSelectedOption: () => filteredOptions[selectedIndex],
    onAccordionClick,
    setOpenNodesId,
    setSearch,
    getOptionsList: () => filteredOptions,
  }));

  const onClickItem = (event) => {
    if (isMulti) {
      event.stopPropagation();
    }
    const optionId = (event.currentTarget as HTMLInputElement).getAttribute(
      'data-option-id',
    );
    const option = filteredOptions.find(({ id }) => id === optionId);

    onItemClick(option ?? { label: '', value: '' }, event);
  };

  const onMouseHoverListItem = useCallback((event: React.SyntheticEvent) => {
    const index = parseInt(
      (event.currentTarget as HTMLElement).getAttribute('data-index') ?? '',
      10,
    );
    setSelectedIndex(index);
    setHideCursor(false);
  }, []);

  useLayoutEffect(() => {
    if (showMenu) {
      const { bottom = 0, height = 0 } =
        (optionListRef as any)?.current?.getBoundingClientRect?.() ?? {};
      const leftOverHeight = window.innerHeight - bottom;

      const selectInputHeight = (
        inputRef.current as HTMLElement
      ).getBoundingClientRect().height;

      if (orientation === ORIENTATION.TOP || leftOverHeight < 30) {
        setOrientation(ORIENTATION.TOP);
        setPosition({ top: -(height + 3) - selectInputHeight });
      } else {
        setOrientation(ORIENTATION.BOTTOM);
        setPosition({ top: 3 });
      }
    } else {
      setOrientation('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, showMenu, filteredOptions]);

  const optionListClassName = classNames([styles.customSelect__optionsList], {
    [styles.customSelect__optionsList__hideCursor]: hideCursor,
  });

  if (!showNoData && !filteredOptions?.length) {
    return null;
  }

  return (
    <Loader
      visible={loading}
      className={styles.customSelect__optionsList__loader}
    >
      <div
        ref={optionListRef}
        className={optionListClassName}
        data-test-id={dataTestId}
        style={style || position}
        role="presentation"
        tabIndex={-1}
      >
        {filteredOptions?.length > 0 ? (
          // eslint-disable-next-line complexity
          filteredOptions.map((option, index) => (
            <div
              data-test-id={`${dataTestId}-${option.id}`}
              data-option-id={option.id}
              data-index={index}
              data-selected={selectedIndex === index}
              onMouseOver={onMouseHoverListItem}
              onClick={option.disabled ? _.noop : onClickItem}
              key={option.id}
              className={`${styles.customSelect__optionsList__item} ${
                isSelected(option) && [
                  styles.customSelect__optionsList__item__selected,
                ]
              }`}
              style={{
                paddingLeft: Number(option.depth)
                  ? (Number(option.depth) - 1) * 20
                  : 0,
              }}
              tabIndex={-1}
              role="presentation"
              onFocus={_.noop}
            >
              {option.hasChildren ? (
                <div
                  onClick={option.disabled ? _.noop : onAccordionClick}
                  className={`${
                    styles.customSelect__optionsList__item__collapsible
                  } ${
                    option.disabled && [
                      styles.customSelect__optionsList__item__disabled,
                    ]
                  }`}
                  data-nodeid={option.id}
                  role="presentation"
                >
                  <span>
                    {option.collapsed ? (
                      <CaretRightRound />
                    ) : (
                      <CaretDownRound />
                    )}
                  </span>
                  <span>
                    {option.icon && (
                      <span
                        className={
                          styles.customSelect__optionsList__item__notCollapsible__icon
                        }
                      >
                        {option.icon}
                      </span>
                    )}
                    {option.label ?? option.name}
                  </span>
                </div>
              ) : (
                <div
                  className={
                    styles.customSelect__optionsList__item__notCollapsible
                  }
                >
                  {option.icon && (
                    <div
                      className={
                        styles.customSelect__optionsList__item__notCollapsible__icon
                      }
                    >
                      {option.icon}
                    </div>
                  )}

                  <div
                    className={
                      styles.customSelect__optionsList__item__notCollapsible__label
                    }
                  >
                    <span>{option.label ?? option.name}</span>
                    <span>
                      <span
                        className={
                          styles.customSelect__optionsList__item__notCollapsible__label__subLabel
                        }
                      >
                        {option.subLabel}
                      </span>
                      {isSelected(option) && isMulti ? (
                        <Check
                          className={
                            styles.customSelect__optionsList__item__notCollapsible__label__iconSelected
                          }
                        />
                      ) : null}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            data-test-id={`${dataTestId}-empty`}
            className={styles.customSelect__optionsList__empty}
          >
            <Empty />
            <Text type="h5">No Data</Text>
          </div>
        )}
      </div>
    </Loader>
  );
});

export default React.memo(Options);
