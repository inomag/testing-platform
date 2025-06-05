import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type Props = {
  lines?: number;
  avtar?: boolean;
  rect?: boolean;
  width?: number | 'auto' | '100%';
  height?: number | 'auto' | '100%';
  isMargin?: boolean;
  rounded?: boolean;
  'data-test-id'?: string;
};

function SkeletonLoader({
  lines,
  avtar,
  rect,
  width = 'auto',
  height = 'auto',
  isMargin = true,
  rounded = true,
  'data-test-id': dataTestId = 'skeleton',
}: Props) {
  const skeltonClasses = classNames(styles.skeleton, {
    [styles.skeleton__margin]: isMargin,
    [styles.skeleton__rounded]: rounded,
  });
  return (
    <div
      data-test-id={dataTestId}
      className={skeltonClasses}
      style={{ width, height }}
    >
      {avtar && (
        <div
          data-test-id={`${dataTestId}-avtar`}
          className={styles.skeleton__avtar}
        />
      )}

      {lines && (
        <div
          data-test-id={`${dataTestId}-lines`}
          className={styles.skeleton__lines}
        >
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              data-test-id={`${dataTestId}-line`}
              className={styles.skeleton__lines__textLine}
            />
          ))}
        </div>
      )}

      {rect && (
        <div
          data-test-id={`${dataTestId}-rect`}
          className={styles.skeleton__rect}
        />
      )}
    </div>
  );
}

export default SkeletonLoader;
