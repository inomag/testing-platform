import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import styles from '../index.module.scss';

function Dot({
  min,
  max,
  value,
  onChange = _.noop,
  displaySuffix,
  'data-test-id': dataTestId,
}) {
  const [sliderValue, setSliderValue] = useState(value);

  // TODO - make it responsive for width less than 400px;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    setSliderValue(max - newValue);
    onChange(max - newValue);
  };

  const onClickReset = () => {
    setSliderValue(min);
    onChange(min);
  };

  const normalizedValue = ((sliderValue - min) / (max - min)) * 100;

  const translateX = (1 / 2 - normalizedValue / 100) * 400;
  return (
    <div
      data-test-id={dataTestId}
      className={styles.angle__container}
      ref={containerRef}
    >
      <div className={styles.angle__container__svg}>
        <svg
          width="100%"
          height="30"
          viewBox="0 0 404 30"
          aria-hidden="true"
          focusable="false"
          style={{
            transform: `translateX(${translateX}px)`,
            transformOrigin: 'left center',
          }}
        >
          <path d="M2 24 l2 3 l-2 -1 l-2 1 z" />
          <rect
            rx="4"
            ry="4"
            y="24"
            className={styles.angle__container__rect}
          />
          <path
            fillRule="evenodd"
            d="M 0 28 a 2 2 0 1 0 0 -1 M 11.25 28 a 0.75 0.75 0 1 0 0 -1 M 21.25 28 a 0.75 0.75 0 1 0 0 -1 M 31.25 28 a 0.75 0.75 0 1 0 0 -1 M 41.25 28 a 0.75 0.75 0 1 0 0 -1 M 50 28 a 2 2 0 1 0 0 -1 M 61.25 28 a 0.75 0.75 0 1 0 0 -1 M 71.25 28 a 0.75 0.75 0 1 0 0 -1 M 81.25 28 a 0.75 0.75 0 1 0 0 -1 M 91.25 28 a 0.75 0.75 0 1 0 0 -1 M 100 28 a 2 2 0 1 0 0 -1 M 111.25 28 a 0.75 0.75 0 1 0 0 -1 M 121.25 28 a 0.75 0.75 0 1 0 0 -1 M 131.25 28 a 0.75 0.75 0 1 0 0 -1 M 141.25 28 a 0.75 0.75 0 1 0 0 -1 M 150 28 a 2 2 0 1 0 0 -1 M 161.25 28 a 0.75 0.75 0 1 0 0 -1 M 171.25 28 a 0.75 0.75 0 1 0 0 -1 M 181.25 28 a 0.75 0.75 0 1 0 0 -1 M 191.25 28 a 0.75 0.75 0 1 0 0 -1 M 200 28 a 2 2 0 1 0 0 -1 M 211.25 28 a 0.75 0.75 0 1 0 0 -1 M 221.25 28 a 0.75 0.75 0 1 0 0 -1 M 231.25 28 a 0.75 0.75 0 1 0 0 -1 M 241.25 28 a 0.75 0.75 0 1 0 0 -1 M 250 28 a 2 2 0 1 0 0 -1 M 261.25 28 a 0.75 0.75 0 1 0 0 -1 M 271.25 28 a 0.75 0.75 0 1 0 0 -1 M 281.25 28 a 0.75 0.75 0 1 0 0 -1 M 291.25 28 a 0.75 0.75 0 1 0 0 -1 M 300 28 a 2 2 0 1 0 0 -1 M 311.25 28 a 0.75 0.75 0 1 0 0 -1 M 321.25 28 a 0.75 0.75 0 1 0 0 -1 M 331.25 28 a 0.75 0.75 0 1 0 0 -1 M 341.25 28 a 0.75 0.75 0 1 0 0 -1 M 350 28 a 2 2 0 1 0 0 -1 M 361.25 28 a 0.75 0.75 0 1 0 0 -1 M 371.25 28 a 0.75 0.75 0 1 0 0 -1 M 381.25 28 a 0.75 0.75 0 1 0 0 -1 M 391.25 28 a 0.75 0.75 0 1 0 0 -1 M 400 28 a 2 2 0 1 0 0 -1"
          />
        </svg>
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleSliderChange}
          className={styles.angle__container__hiddenInput}
          data-test-id={`${dataTestId}-input`}
        />
      </div>
      <Button
        type="text"
        onClick={onClickReset}
        className={styles.angle__container__reset}
      />
      <Text
        data-test-id={`${dataTestId}-text`}
        classNames={styles.angle__container__text}
        bold
      >
        {sliderValue} {displaySuffix}
      </Text>
    </div>
  );
}

export default Dot;
