import * as React from 'react';
import classnames from 'classnames';
import { ProgressBarChildProps } from './types';
import styles from './index.module.scss';

export default function Line({
  strokeColor,
  value,
  maxValue,
  trailColor,
  info,
  steps,
  classNames,
  variant,
  getStatusIcon,
  size,
  showText,
  strokeRadius,
}: ProgressBarChildProps) {
  const getHeigthInAccordanceWithSize = () => {
    if (size === 'small') return 'var(--spacing-xs)';
    if (size === 'medium') return 'var(--spacing-s)';
    if (size === 'large') return 'var(--spacing-m)';
    return undefined;
  };

  return (
    <div
      data-test-id="progress-bar-line"
      className={classnames(styles.progressBar__wrapper, classNames)}
    >
      <div
        data-test-id="progress-bar-trail"
        className={`${styles.progressBar__outer} ${
          strokeRadius ? styles.progressBar__outer__radius : ''
        }`}
        style={{
          backgroundColor: steps !== 1 ? 'transparent' : trailColor,
          justifyContent: steps !== 1 ? 'space-between' : 'flex-start',
          height: getHeigthInAccordanceWithSize(),
        }}
      >
        {steps !== 1 ? (
          Array.from({ length: steps }, (_, index) => (
            <div
              data-test-id="progress-bar-inner"
              className={`${styles.progressBar__inner} ${
                strokeRadius ? styles.progressBar_inner__radius : ''
              }`}
              style={{
                width: `${steps !== 1 ? 100 / steps - 1 : 100}%`,
                backgroundColor:
                  parseFloat(((value / maxValue) * 100).toFixed(2)) >=
                  parseFloat(((100 / steps) * (index + 1)).toFixed(2))
                    ? strokeColor
                    : trailColor,
                height: getHeigthInAccordanceWithSize(),
              }}
            />
          ))
        ) : (
          <div
            data-test-id="progress-bar-stroke"
            className={`${styles.progressBar__inner} ${
              strokeRadius ? styles.progressBar__inner__radius : ''
            }`}
            style={{
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: strokeColor,
              height: getHeigthInAccordanceWithSize(),
            }}
          />
        )}
      </div>

      {showText &&
        (getStatusIcon(variant) || (
          <span
            data-test-id="progress-bar-info"
            className={styles.progressBar_text}
            title={info(value, maxValue).toString()}
            style={{ fontSize: `var(--${size[0]}-font-size)` }}
          >
            {info(value, maxValue)}
          </span>
        ))}
    </div>
  );
}
