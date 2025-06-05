// Converting the default seconds from the props to hours, minutes and seconds
export const calculateTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, seconds: remainingSeconds };
};

export const formatNumber = (num: number): string =>
  num.toString().padStart(2, '0');

// Get the time unit to show in the timer
export const getTimeUnit = (hours, minutes) => {
  if (hours > 0) return 'hrs';
  if (minutes > 0) return 'mins';
  return 'secs';
};
