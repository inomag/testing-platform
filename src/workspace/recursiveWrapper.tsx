import React, { cloneElement } from 'react';
import { RouterProvider } from 'react-router-dom';

function RecursiveWrapper({ router, fullPage, children }) {
  const wrappedChildren = React.Children.map(children, (child) => {
    const isRouter = child.props.id === 'router';
    const type = isRouter ? RouterProvider : child.type;

    let updatedProps = child.props;
    if (isRouter) {
      updatedProps = { ...child.props, router };
    }

    if (child.props && child.props.children) {
      return cloneElement(
        {
          ...child,
          type, // substitute original type
        },
        {
          ...updatedProps,
          // Wrap grandchildren too
          children: (
            <RecursiveWrapper fullPage={fullPage} router={router}>
              {child.props.children}
            </RecursiveWrapper>
          ),
        },
      );
    }
    return isRouter || !fullPage
      ? cloneElement(
          {
            ...child,
            type, // substitute original type
          },
          updatedProps,
        )
      : null;
  });

  return wrappedChildren;
}

export default RecursiveWrapper;
