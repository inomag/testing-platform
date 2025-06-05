import moment from 'moment';

export const processTimeStamp = (timeStamp) => {
  const formattedDate = moment(timeStamp).format('MMM DD, YYYY'); // Oct 04, 2024
  const formattedTime = moment(timeStamp).format('hh:mm A');

  return { formattedTime, formattedDate };
};
