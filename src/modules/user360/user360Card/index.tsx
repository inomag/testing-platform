import React from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { NoData } from 'src/@vymo/ui/blocks';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppSelector } from 'src/store/hooks';
import { getCardData, getError, getIsLoading } from '../selectors';
import { CardConfig } from '../types';
import Activities from './activities';
import AuditHistory from './auditHistory';
import Highlights from './highlights';
import ReferralCard from './referral';
import Suggestions from './suggestions';
import TableView from './table';
import styles from './index.module.scss';

function User360Card({
  card,
  titleAction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRefresh,
}: {
  card: CardConfig;
  titleAction: (tabCode: string) => void;
  onRefresh?: () => void;
}) {
  const isLoading = useAppSelector((state) => getIsLoading(state, card.code));

  const error = useAppSelector((state) => getError(state, card.code));
  const cardData = useAppSelector((state) => getCardData(state, card.code));

  if (error || isLoading) {
    return (
      <>
        <Text semiBold type="h5">
          {card.name}
        </Text>
        {error && !isLoading && (
          <NoData
            message={locale(Keys.ERROR_FETCHING_CARD_DATA, {
              cardName: card.name,
            })}
          />
        )}
        {isLoading && <SkeletonLoader lines={5} />}
      </>
    );
  }

  const renderCardContent = (cardType) => {
    switch (cardType) {
      case 'summary_card':
        return (
          <Highlights data={cardData} card={card} titleAction={titleAction} />
        );
      case 'suggestions':
        return <Suggestions data={cardData} card={card} />;
      case 'pending_activities':
      case 'completed_activities':
      case 'upcoming_activities':
        return <Activities data={cardData} card={card} />;
      case 'audit_history':
        return <AuditHistory data={cardData} />;
      case 'licenses':
      case 'appointments':
        return <TableView data={cardData} card={card} />;
      case 'referral_card':
        return <ReferralCard data={cardData} card={card} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.cardContentWrapper}>
      {renderCardContent(card.card_type)}
    </div>
  );
}
export default User360Card;
