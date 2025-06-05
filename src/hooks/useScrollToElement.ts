import { RefObject, useCallback } from 'react';

function useScrollToElement(
  containerRef: RefObject<HTMLElement>,
  type: 'top' | 'center' = 'center',
) {
  const scrollToElement = useCallback(
    (element: HTMLElement) => {
      if (containerRef.current) {
        const container = containerRef.current;
        const { offsetTop, clientHeight: elementHeight } = element;
        const { clientHeight: containerHeight } = container;
        let scrollPosition = {};
        if (type === 'top') {
          scrollPosition = { top: offsetTop };
        } else {
          scrollPosition = {
            top: offsetTop - containerHeight / 2 + elementHeight / 2,
          };
        }

        // scroll the container to the element position
        container.scrollTo({
          ...scrollPosition,
          behavior: 'smooth',
        });
      }
    },
    [containerRef, type],
  );

  return scrollToElement;
}

export default useScrollToElement;
