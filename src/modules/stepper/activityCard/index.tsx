import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as CalendarIcon } from 'src/assets/icons/calendar.svg';
import { ReactComponent as LocationIcon } from 'src/assets/icons/location.svg';
import moment from 'moment/moment';
import styles from './index.module.scss';

function ActivityCard({ meeting, location }: { meeting: any; location: any }) {
  const formattedAddress = location?.address_string || '';
  // TODO - Prashanth fix this move to date-fns
  const dateTime = moment(meeting.date);
  const date = dateTime.format('MMMM DD, YYYY');
  const time = dateTime.format('hh:mm A');

  return (
    <Card classNames={styles.card}>
      <div className={styles.card__cardItem}>
        <CalendarIcon className={styles.card__cardItem__icon} />
        <div className={styles.card__cardItem__text}>
          <Text bold>{date}</Text>
          <br />
          <Text>{time}</Text>
        </div>
      </div>
      <div className={styles.card__cardItem}>
        <LocationIcon className={styles.card__cardItem__icon} />
        <div className={styles.card__cardItem__text}>
          <Text bold>{formattedAddress}</Text>
        </div>
      </div>
    </Card>
  );
}

export default ActivityCard;
