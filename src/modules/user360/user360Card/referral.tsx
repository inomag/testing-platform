import React from 'react';
import { Avatar } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Card, NoData } from 'src/@vymo/ui/blocks';
import { ReactComponent as Navigation } from 'src/assets/icons/navigation.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { navigate } from 'src/workspace/utils';
import styles from './index.module.scss';

function ReferralCard({ data, card }) {
  const { results = [] } = data;
  return (
    <>
      <div className={styles.lastEngagementHeader}>
        <Text semiBold type="label">
          {`${card.name} (${results?.length})`}
        </Text>
      </div>
      {results.length === 0 && (
        <NoData
          message={locale(Keys.NO_DATA_FOUND_FOR_CARD, { cardName: card.name })}
        />
      )}
      {results.map((vo) => (
        <Card classNames={styles.referralCard}>
          <div className={styles.referralCard__header}>
            <Avatar text={vo?.name?.charAt(0) || ''} />
            <Text semiBold>{vo.name}</Text>
          </div>

          <div>
            <div className={styles.activityCard__navigate__icon}>
              <Navigation
                onClick={() => {
                  navigate(
                    'leads.details',
                    {
                      leadId: vo?.code,
                      module: card.code,
                    },
                    {},
                  );
                }}
              />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

export default ReferralCard;
