import { setHours, setMinutes, setSeconds } from 'date-fns';

export const getDateFromTime = (
  show12Hours,
  newHours,
  newMinutes,
  newSeconds,
  newPeriod,
) => {
  let date = new Date();
  if (show12Hours && newHours) {
    const hours24 = newPeriod === 'PM' ? (newHours % 12) + 12 : newHours % 12;
    date = setHours(date, hours24);
  } else {
    date = setHours(date, newHours);
  }
  if (newMinutes) {
    date = setMinutes(date, newMinutes);
  }
  if (newSeconds) {
    date = setSeconds(date, newSeconds);
  }

  return date;
};
