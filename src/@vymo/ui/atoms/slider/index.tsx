import _ from 'lodash';
import React from 'react';
import Angle from './indicator/angle';
import Linear from './indicator/linear';

function Slider({
  value = 50,
  onChange = _.noop,
  displaySuffix = '%',
  type = 'linear',
  min = 0,
  max = 100,
  'data-test-id': dataTestId = 'slider',
}) {
  if (type === 'linear') {
    return (
      <Linear
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        displaySuffix={displaySuffix}
        data-test-id={`linear-${dataTestId}`}
      />
    );
  }

  if (type === 'angle') {
    return (
      <Angle
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        displaySuffix={displaySuffix}
        data-test-id={`angle-${dataTestId}`}
      />
    );
  }

  return null;
}

export default Slider;
