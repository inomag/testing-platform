import React from 'react';
import styles from './index.module.scss';

interface DotsLoaderProps {
  height?: string;
  width?: string;
  color?: string;
}

function DotsLoader({
  height = '20px',
  width = '40px',
  color = 'currentColor',
}: DotsLoaderProps) {
  return (
    <div className={styles.dotsLoader} style={{ height, width, color }}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}

export default DotsLoader;
