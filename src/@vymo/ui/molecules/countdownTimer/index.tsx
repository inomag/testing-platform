import React, { useEffect, useState } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import { ReactComponent as Timer } from 'src/assets/icons/timer.svg';
import { calculateTime, formatNumber, getTimeUnit } from './queries';
import { TimerProps } from './types';
import styles from './index.module.scss';

function CountdownTimer({
  seconds: totalSeconds,
  onComplete,
  classNames = '',
}: TimerProps) {
  const initialTime = calculateTime(totalSeconds);

  const [hours, setHours] = useState(initialTime.hours);
  const [minutes, setMinutes] = useState(initialTime.minutes);
  const [seconds, setSeconds] = useState(initialTime.seconds);
  const [isRunning, setIsRunning] = useState(true);

  // Addind a check to show hours only if the hours are greater than 0
  const shouldShowHours = hours > 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          setIsRunning(false);
          if (onComplete) {
            onComplete(true);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [hours, minutes, seconds, isRunning, onComplete]);

  return (
    <div className={`${styles.timer} ${classNames}`}>
      <div className={`${styles.timer__icon}`}>
        <Timer />
      </div>
      <span className={`${styles.timer__text}`}>
        <Text>{shouldShowHours && `${formatNumber(hours)} : `}</Text>
        <Text>
          {formatNumber(minutes)} : {formatNumber(seconds)}
        </Text>
        <Text>{` ${getTimeUnit(hours, minutes)}`}</Text>
      </span>
    </div>
  );
}

export default CountdownTimer;
