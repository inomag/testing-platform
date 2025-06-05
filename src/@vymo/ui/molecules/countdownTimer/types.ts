export type TimerProps = {
  seconds: number;
  onComplete?: (...args) => void;
  classNames?: string;
};
