import _ from 'lodash';
import { distance } from 'fastest-levenshtein';
import * as constants from './constants';
import { FlatOptions, Option } from './types';

export const getIsNodeCollapsed = (
  openedNodeIds,
  updateId,
  depth,
  expandedNodesLevel,
) => !(depth < expandedNodesLevel || openedNodeIds.includes(updateId));

// eslint-disable-next-line max-lines-per-function
export const getExpandedOptions = (
  openedNodeIds: Array<string>,
  optionList: Array<Option>,
  isSearch: boolean = false,
  expandedNodesLevel: number = 0,
  result: FlatOptions = [],
  id: string = '',
  depth: number = 1,
  editorProps?: Object | null,
): FlatOptions => {
  // eslint-disable-next-line complexity
  optionList.forEach((eachOption) => {
    const option = { ...eachOption };
    let updatedId;
    option.label = String(option.name || option.label);
    option.value = String(option.code || option.value);
    if (depth === 1) {
      // @ts-ignore
      updatedId = option.value;
    } else {
      updatedId = id
        ? // @ts-ignore
          `${id}__${option.value}`
        : // @ts-ignore
          option.value;
    }
    const collapsed = getIsNodeCollapsed(
      openedNodeIds,
      updatedId,
      depth,
      expandedNodesLevel,
    );

    const { options } = option;
    editorProps = editorProps || option.editorProps;
    if ((isSearch && !collapsed) || !isSearch) {
      result.push({
        ..._.omit(option, 'options'),
        depth,
        hasChildren: options && options.length > 0,
        collapsed,
        id: updatedId,
        // @ts-ignore
        editorProps,
      });

      if (!collapsed && options && !option.disabled) {
        depth += 1;
        updatedId = id
          ? // @ts-ignore
            `${id}__${option.value || option.code}`
          : // @ts-ignore
            option.value || option.code;
        getExpandedOptions(
          openedNodeIds,
          options,
          isSearch,
          expandedNodesLevel,
          result,
          updatedId,
          depth,
          editorProps,
        );
        depth -= 1;
      }
    }
  });
  if (depth === 1) {
    return result as any;
  }
  return [];
};

export const getFlattenOptions = (
  optionList: Array<Option>,
  result: FlatOptions = [],
  id = '',
  depth = 1,
  editorProps?: Object | null,
) => {
  // eslint-disable-next-line complexity
  optionList.forEach((option) => {
    if (!Object.isExtensible(option)) {
      option = { ...option };
    }
    const { options } = option;
    option.value = String(option.code || option.value);
    option.label = String(option.name || option.label);
    let updatedId;
    if (depth === 1) {
      // @ts-ignore
      updatedId = option.value;
    } else {
      updatedId = id
        ? // @ts-ignore
          `${id}__${option.value}`
        : // @ts-ignore
          option.value;
    }

    editorProps = editorProps || option.editorProps;
    result.push({
      ...option,
      hasChildren: options && options.length > 0,
      id: updatedId,
      editorProps,
    });
    if (options) {
      depth += 1;

      updatedId = id
        ? // @ts-ignore
          `${id}__${option.value}`
        : // @ts-ignore
          option.value;
      getFlattenOptions(options, result, updatedId, depth, editorProps);
      depth -= 1;
    }
  });
  return result as Array<any>;
};
// will only search for last depth nodesfor which hasChildren is false
export const getSearchResult = (
  flattenOptions: FlatOptions,
  searchQuery: string,
) => {
  const result = _.chain(flattenOptions)
    .filter((option) => !option.hasChildren)
    .map((option) => {
      const searchWordDistance = distance(
        String(option.label?.toLowerCase?.()),
        searchQuery?.toLowerCase?.(),
      );
      return {
        ...option,
        searchWordDistance,
      };
    })
    .filter(
      ({ searchWordDistance, hasChildren, ...option }) =>
        searchWordDistance <=
        Number(option?.label?.length) - Number(searchQuery?.length),
    )
    .sortBy('searchWordDistance')
    .value();
  return result;
};

// this block will generate all the ids in array format from parent node to the child node
export const getOpenNodeIds = (flattenOptions: FlatOptions) => {
  let openNodeIds: any = [];

  flattenOptions.forEach((option) => {
    if (option?.id) {
      if (Number(option.id?.indexOf?.('__')) > -1) {
        const nodeIds = option?.id?.split?.('__').reduce((acc, id, index) => {
          if (index === 0) {
            acc.push(id);
          } else {
            const updatedId = `${acc[index - 1]}__${id}`;
            acc.push(updatedId);
          }
          return acc;
        }, [] as Array<string>);
        openNodeIds = [...openNodeIds, ...(nodeIds as Array<string>)];
      } else {
        openNodeIds = [...openNodeIds, option?.id];
      }
    }
  });
  return _.uniq(openNodeIds);
};

export const getTextWidth = (text: string, font?) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font || getComputedStyle(document.body).font;

    return context.measureText(text).width;
  }
  return null;
};

export const getInputAvaialbleSize = (width: number) => {
  const characterWidth = Number(getTextWidth('a'));
  return width / characterWidth;
};

export const getUpdatedIndex = (
  selectedIndex: number,
  type: string,
  optionsLength: number,
) => {
  let updatedIndex = 0;
  if (type === constants.ARROW_UP) {
    updatedIndex = selectedIndex === 0 ? optionsLength - 1 : selectedIndex - 1;
  }
  if (type === constants.ARROW_DOWN) {
    updatedIndex = selectedIndex < optionsLength - 1 ? selectedIndex + 1 : 0;
  }
  return updatedIndex;
};
