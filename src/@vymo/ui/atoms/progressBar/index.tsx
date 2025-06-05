import React, { useCallback } from 'react';
import { ReactComponent as DangerStatusIcon } from 'src/assets/icons/danger_status.svg';
import { ReactComponent as SuccessStatusIcon } from 'src/assets/icons/success_status.svg';
import { ReactComponent as WarningStatusIcon } from 'src/assets/icons/warning_status.svg';
import Circle from './Circle';
import Line from './Line';
import {
  ProgressBarChildProps,
  ProgressBarProps,
  Type,
  Variant,
} from './types';

function ProgressBar({
  type = Type.Line,
  variant,
  strokeColor = 'var(--brand-primary)',
  value,
  maxValue = 100,
  trailColor = 'var(--brand-primary)',
  info = (val, maxVal) => `${((val / maxVal) * 100).toFixed(0)}%`,
  steps = 1,
  size = 'medium',
  classNames = '',
  showText = true,
  strokeRadius = true,
}: ProgressBarProps) {
  const getStatusIcon = useCallback(
    (variantType: Variant | undefined): React.ReactNode => {
      const iconStyle = {
        width: `var(--${size[0]}-font-size)`,
        aspectRatio: 1 / 1,
      };

      if (variantType === 'error') {
        return (
          <DangerStatusIcon
            data-test-id="status-icon-danger"
            style={iconStyle}
          />
        );
      }
      if (variantType === 'success') {
        return (
          <SuccessStatusIcon
            data-test-id="status-icon-success"
            style={iconStyle}
          />
        );
      }
      if (variantType === 'warning') {
        return (
          <WarningStatusIcon
            data-test-id="status-icon-warning"
            style={iconStyle}
          />
        );
      }
      return null;
    },
    [size],
  );

  if (variant) {
    trailColor = `1px solid var(--border-default)`;
    strokeColor = `var(--text-status-${variant})`;
  }

  const trailColorTransluscent = `rgb(from ${trailColor} r g b / 0.2)`;

  const childProps: ProgressBarChildProps = {
    strokeColor,
    value,
    maxValue,
    trailColor: trailColorTransluscent,
    info,
    steps,
    classNames,
    getStatusIcon,
    size,
    variant,
    showText,
    strokeRadius,
  };

  return type === Type.Line ? (
    <Line {...childProps} />
  ) : (
    <Circle {...childProps} />
  );
}

export default React.memo(ProgressBar);
