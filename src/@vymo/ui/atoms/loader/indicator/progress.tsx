import React from 'react';
import Line from 'src/@vymo/ui/atoms/progressBar/Line';
import { Size } from 'src/@vymo/ui/atoms/progressBar/types';

interface ProgressLoaderProps {
  color?: string;
  size?: Size;
}

function ProgressLoader({
  color = 'var(--brand-primary)',
  size = 'small',
}: ProgressLoaderProps) {
  return (
    <Line
      value={80}
      maxValue={100}
      strokeColor={color}
      trailColor="var(--grey-200)"
      steps={1}
      size={size}
      showText={false}
      strokeRadius
      info={() => ''}
      getStatusIcon={() => null}
      variant="filled"
    />
  );
}

export default ProgressLoader;
