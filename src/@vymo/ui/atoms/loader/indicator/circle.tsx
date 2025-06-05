import React from 'react';
import { BaseProps } from '../types';

//  these properties can be changed from theming if required
const RADIUS = 20;
const STROKEWIDTH = 2;

const getPath = (radius: number): string =>
  [`M${radius} 0c0-9.94-8.06`, radius, radius, radius].join('-');

const getViewBoxSize = (
  strokeWidth: number,
  secondaryStrokeWidth: number,
  radius: number,
): string => {
  const maxStrokeWidth = Math.max(strokeWidth, secondaryStrokeWidth);
  const startingPoint = -radius - maxStrokeWidth / 2 + 1;
  const endpoint = radius * 2 + maxStrokeWidth;
  return [startingPoint, startingPoint, endpoint, endpoint].join(' ');
};

function CircleLoader({ height, width, color }: BaseProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={getViewBoxSize(Number(STROKEWIDTH), Number(STROKEWIDTH), RADIUS)}
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth={Number(STROKEWIDTH)}>
          <circle
            strokeOpacity=".5"
            cx="0"
            cy="0"
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKEWIDTH}
          />
          <path d={getPath(RADIUS)}>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
}

export default CircleLoader;
