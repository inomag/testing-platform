import React, { useMemo } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import moment from 'moment';
import calendarIcon from 'src/assets/icons/calendarBold.svg';
import { ReactComponent as NavigateIcon } from 'src/assets/icons/navigate.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { MeetingSectionProp } from '../types';
import styles from '../index.module.scss';

function MeetingSection({
  startDate,
  endDate,
  format = 'DD-MM-YYYY HH:mm:ss',
  meeting,
  info,
}: MeetingSectionProp) {
  const formattedDate = useMemo(() => {
    const parsedStartDate = moment(startDate, format);
    const parsedEndDate = moment(endDate, format);
    return {
      dateString: parsedStartDate.format('MMMM D, YYYY'),
      startTime: parsedStartDate.format('h:mm A'),
      endTime: parsedEndDate.format('h:mm A'),
    };
  }, [endDate, format, startDate]);
  const { dateString, startTime, endTime } = formattedDate;
  const isOnline = !!meeting?.online?.link;
  const isOffline = !!meeting?.offline?.link;

  return (
    <div className={styles['meeting-section']} data-test-id="meeting-section">
      <div className={styles['meeting-details']}>
        {dateString && (
          <div className={styles['meeting-schedule-container']}>
            <div className={styles['calendar-icon-container']}>
              <img
                src={calendarIcon}
                alt="calendar"
                className={styles['calendar-icon']}
              />
            </div>
            <div className={styles['meeting-schedule']}>
              <Text bold>{dateString}</Text>
              <Text>
                {startTime} - {endTime}
              </Text>
            </div>
          </div>
        )}
        {Array.isArray(info) &&
          info.map((infoItem) => (
            <div>
              <Text>{infoItem.label}</Text> - <Text bold>{infoItem.value}</Text>
            </div>
          ))}
        {isOffline && (
          <div>
            <Text>{locale(Keys.LOCATION)}</Text> -{' '}
            <Text bold>{meeting?.offline?.address}</Text>
          </div>
        )}
      </div>
      {isOnline && (
        <a href={meeting?.online?.link} target="_blank" rel="noreferrer">
          <Button className={styles['section-button']}>
            <>
              {meeting?.online?.label}&nbsp;
              <NavigateIcon />
            </>
          </Button>
        </a>
      )}
      {isOffline && (
        <a href={meeting?.offline?.link}>
          <Button className={styles['section-button']}>
            <>
              {meeting?.offline?.label}&nbsp;
              <NavigateIcon />
            </>
          </Button>
        </a>
      )}
    </div>
  );
}

export default MeetingSection;
