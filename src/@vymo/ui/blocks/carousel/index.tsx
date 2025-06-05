import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from 'src/@vymo/ui/atoms';
import ImageLoader from 'src/@vymo/ui/blocks/imageLoader';
import { ReactComponent as ChevronRight } from 'src/assets/icons/chevron_right.svg';
import { ReactComponent as ChevronLeft } from 'src/assets/icons/chevronLeft.svg';
import { Props } from './types';
import styles from './index.module.scss';

function Carousel({
  slides = [],
  showNavArrows = true,
  showNavDots = true,
  autoSlide = false,
  autoSlideInterval = 3000,
  className,
  'data-test-id': dataTestId = 'carousel',
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const resetAutoSlide = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    if (autoSlide) {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, autoSlideInterval);
    }
  }, [autoSlide, autoSlideInterval, slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetAutoSlide();
  }, [slides.length, resetAutoSlide]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetAutoSlide();
  }, [slides.length, resetAutoSlide]);

  const goToSlide = useCallback(
    (index) => {
      setCurrentIndex(index);
      resetAutoSlide();
    },
    [resetAutoSlide],
  );

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    resetAutoSlide();

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [resetAutoSlide]);

  return (
    <div
      data-test-id={dataTestId}
      className={`${className} ${styles.carousel}`}
      {...handlers}
    >
      <div className={styles.carousel__container}>
        <div
          className={styles.carousel__container__inner}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              className={`${styles.carousel__container__inner__slide} ${
                index === currentIndex
                  ? styles.carousel__container__inner__slideActive
                  : ''
              }`}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              data-test-id={`${dataTestId}-slide`}
            >
              <ImageLoader src={slide} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>

        {showNavArrows && slides.length > 1 && (
          <>
            <Button
              type="text"
              className={styles.carousel__container__prevButton}
              onClick={handlePrev}
              iconProps={{ icon: <ChevronLeft />, iconPosition: 'left' }}
              data-test-id={`${dataTestId}-arrow-left`}
            />
            <Button
              type="text"
              className={styles.carousel__container__nextButton}
              onClick={handleNext}
              iconProps={{ icon: <ChevronRight />, iconPosition: 'left' }}
              data-test-id={`${dataTestId}-arrow-right`}
            />
          </>
        )}
      </div>
      {showNavDots && slides.length > 1 && (
        <div
          data-test-id={`${dataTestId}-nav-dots`}
          className={styles.carousel__dotsNavigation}
        >
          {slides.map((_, index) => (
            <span
              role="presentation"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`${styles.carousel__dotsNavigation__dot} ${
                index === currentIndex
                  ? styles.carousel__dotsNavigation__activeDot
                  : ''
              }`}
              data-test-id={`${dataTestId}-nav-dot`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
