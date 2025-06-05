export type Props = {
  slides: Array<string>;
  showNavArrows?: boolean;
  showNavDots?: boolean;
  autoSlide?: boolean;
  autoSlideInterval?: number;
  className?: React.CSSProperties | string;
  'data-test-id'?: string;
};
