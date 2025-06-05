export const getFlatComponentsList = (components) =>
  Object.keys(components).reduce((acc, componentType) => {
    const componentListByType = components[componentType];
    acc = { ...acc, ...componentListByType };
    return acc;
  }, {});

export const getBannerVariant = (status) => {
  switch (status) {
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'error':
      return 'error';
    default:
      return 'info';
  }
};

export const getComponentProps = (componentType, elementType = '') =>
  // @ts-ignore
  COMPONENT_PROPS[`${componentType}/${_.camelCase(elementType.toLowerCase())}`]
    ?.props ?? [];
