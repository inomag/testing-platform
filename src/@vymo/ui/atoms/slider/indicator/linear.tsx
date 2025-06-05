import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import styles from '../index.module.scss';

function Linear({
  min,
  max,
  value,
  onChange = _.noop,
  displaySuffix,
  'data-test-id': dataTestId,
}) {
  const [sliderValue, setSliderValue] = useState(value);

  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // @ts-ignore
        setContainerWidth(containerRef.current.offsetWidth - 40);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue);
    onChange(newValue);
  };

  const normalizedValue = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div
      data-test-id={dataTestId}
      className={styles.sliderContainer}
      ref={containerRef}
    >
      <svg width="100%" height="30" viewBox={`0 0 ${containerWidth} 30`}>
        {/* Track */}
        <rect
          x="0"
          y="10"
          rx="5"
          width={containerWidth}
          className={styles.track}
        />
        {/* Filled Track */}
        <rect
          x="0"
          y="10"
          rx="5"
          width={`${(normalizedValue / 100) * containerWidth}`}
          className={styles.filledTrack}
        />
        {/* Knob */}
        <circle
          cy="13"
          r="10"
          cx={`${(normalizedValue / 100) * containerWidth}`}
          className={styles.knob}
        />
      </svg>
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleSliderChange}
        className={styles.hiddenInput}
        data-test-id={`${dataTestId}-input`}
      />
      <Text data-test-id={`${dataTestId}-text`} bold>
        {sliderValue} {displaySuffix}
      </Text>
    </div>
  );
}

export default Linear;
