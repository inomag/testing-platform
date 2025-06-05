import _ from 'lodash';
import React from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Card, NoData } from 'src/@vymo/ui/blocks';
import { ReactComponent as Outgoing } from 'src/assets/icons/outgoing.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { CardConfig } from '../types';
import { getSummaryTitle } from './queries';
import styles from './index.module.scss';

function Highlights({
  data,
  card,
  titleAction,
}: {
  data: any;
  card: CardConfig;
  titleAction: (tabCode: string) => void;
}) {
  const lastEngagementData = _.get(data, 'last_engagement.results.0', {});
  const title = locale(Keys.LAST_ENGAGEMENT);
  const summaryTitle = getSummaryTitle(lastEngagementData);

  return (
    <>
      <div className={styles.lastEngagementHeader}>
        <Text semiBold type="h5">
          {card.name}
        </Text>
        {!_.isEmpty(lastEngagementData) && (
          <Button
            onClick={() => {
              titleAction('engagement');
            }}
            type="text"
          >
            {locale(Keys.VIEW_ALL)}
          </Button>
        )}
      </div>
      {!lastEngagementData || _.isEmpty(lastEngagementData) ? (
        <NoData
          message={locale(Keys.NO_DATA_FOUND_FOR_CARD, { cardName: card.name })}
        />
      ) : (
        <Card classNames={styles.lastEngagementCard}>
          <div className={styles.lastEngagementCard__icon}>
            <Outgoing />
          </div>
          <div className={styles.lastEngagementCard__details}>
            <Text semiBold type="h5">
              {title}
            </Text>
            <Text type="label">{summaryTitle}</Text>
          </div>
        </Card>
      )}
    </>
  );
}

export default Highlights;
