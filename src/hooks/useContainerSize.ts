import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

// Takes Ref of a container and get,set container view
// TODO Make it more functional in ways to deal with more cases
function useContainerSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
] {
  const [ref, containerRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const handleSize = useCallback(() => {
    const viewPortHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    const calculatedHeight =
      viewPortHeight - Number(ref?.getBoundingClientRect?.()?.y || 0);

    const viewPortWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const calculatedWidth =
      viewPortWidth - Number(ref?.getBoundingClientRect?.()?.x || 0);

    if (
      calculatedWidth <= viewPortWidth &&
      calculatedHeight <= viewPortHeight
    ) {
      setSize({
        width: calculatedWidth || 0,
        height: calculatedHeight || 0,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleSize);

    return () => window.removeEventListener('resize', handleSize);
  });

  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [containerRef, size];
}

export default useContainerSize;
