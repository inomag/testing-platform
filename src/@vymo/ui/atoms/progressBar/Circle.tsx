/* eslint-disable react/function-component-definition */
import * as React from 'react';
import classnames from 'classnames';
import { ProgressBarChildProps } from './types';
import styles from './index.module.scss';

function Circle({
  strokeColor,
  value,
  maxValue,
  trailColor,
  info,
  steps,
  variant,
  classNames,
  getStatusIcon,
  size,
  strokeRadius,
}: ProgressBarChildProps) {
  const getWidthInAccordanceWithSize = () => {
    if (size === 'small') return 'calc(var(--s-font-size)*5)';
    if (size === 'medium') return 'calc(var(--s-font-size)*10)';
    if (size === 'large') return 'calc(var(--s-font-size)*20)';
    return undefined;
  };

  const stepAngle = 360 / steps;
  const progressBarCircleOuterStyle = {
    backgroundImage:
      steps === 1
        ? `conic-gradient(${strokeColor} ${
            (value / maxValue) * 360
          }deg, transparent 0)`
        : `conic-gradient(${Array.from({ length: steps })
            .map(
              (_, index) =>
                `${
                  (index + 1) * stepAngle <= (value / maxValue) * 360
                    ? strokeColor
                    : trailColor
                } ${(index + 1) * stepAngle - 2}deg, transparent ${
                  (index + 1) * stepAngle
                }deg, ${
                  (index + 2) * stepAngle <= (value / maxValue) * 360
                    ? strokeColor
                    : trailColor
                } ${(index + 1) * stepAngle + 2}deg`,
            )
            .join(', ')}`,
  };

  const progressBarCircleInnerStyle = {
    backgroundImage: `conic-gradient(
        ${trailColor} 360deg,
        transparent 0
      )`,
  };

  return (
    <div
      data-test-id="progress-bar-circle"
      className={classnames(styles.progressBar__circle__wrapper, classNames)}
      style={{
        width: getWidthInAccordanceWithSize(),
      }}
    >
      <div
        data-test-id="progress-bar-stroke"
        className={`${styles.progressBar__circle__outer} ${
          strokeRadius ? styles.progressBar__circle__outer__radius : ''
        }`}
        style={progressBarCircleOuterStyle}
      >
        <div
          data-test-id="progress-bar-trail"
          className={`${styles.progressBar__circle__inner} ${
            strokeRadius ? styles.progressBar__circle__inner__radius : ''
          }`}
          style={progressBarCircleInnerStyle}
        >
          <div className={styles.progressBar__circle__innermost}>
            {getStatusIcon(variant) || (
              <span
                data-test-id="progress-bar-info"
                className={styles.progressBar__circle__text}
                title={info(value, maxValue).toString()}
                style={{ fontSize: `var(--${size[0]}-font-size)` }}
              >
                {info(value, maxValue)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Circle;
