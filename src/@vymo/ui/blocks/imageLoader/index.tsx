import React, { useState } from 'react';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import { getSrcUrl } from './queries';
import styles from './index.module.scss';

type Props = {
  src: string;
  alt: string;
  height?: number | '100%';
  width?: number | '100%';
  className?: string;
};

function ImageLoader({
  src,
  alt,
  height = '100%',
  width = '100%',
  className,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`${styles.imageLoaderWrapper}`} style={{ height, width }}>
      {!isLoaded && <SkeletonLoader rect height={height} width={width} />}

      <img
        src={getSrcUrl(src)}
        alt={alt}
        height={height}
        width={width}
        className={`${styles.imageLoaderWrapper__image} ${className} ${
          isLoaded
            ? styles.imageLoaderWrapper__image__visible
            : styles.imageLoaderWrapper__image__hidden
        }`}
        onLoad={handleImageLoad}
        onError={handleImageLoad}
      />
    </div>
  );
}

export default ImageLoader;
