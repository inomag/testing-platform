import React, { useCallback, useState } from 'react';
import { Card, TabLayout } from 'src/@vymo/ui/blocks';
import { useAppDispatch } from 'src/store/hooks';
import { singleCardRequest } from '../queries';
import { fetchHeaderDetails, fetchUserTab } from '../thunk';
import { User360Config } from '../types';
import User360Card from '../user360Card';
import ProfileDetails from '../user360Card/details';
import styles from '../index.module.scss';

function UserTabs({
  tabConfig,
  userCode,
}: {
  tabConfig: User360Config;
  userCode: string;
}) {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState(
    tabConfig.tabs?.[0]?.code || '',
  );

  const onRefresh = useCallback(
    (cardConfig, tab) => {
      const cardRequest: any = singleCardRequest(cardConfig, tab, userCode);
      if (cardRequest) {
        dispatch(fetchUserTab(cardRequest));
      }
    },
    [dispatch, userCode],
  );

  const getCardChildren = (type, card, tab) => {
    switch (type) {
      case 'profile':
        return (
          <ProfileDetails
            card={card}
            userCode={userCode}
            onRefresh={() => dispatch(fetchHeaderDetails({ userCode }))}
          />
        );
      default:
        return (
          <User360Card
            card={card}
            titleAction={(tabCode) => setSelectedTab(tabCode)}
            onRefresh={() => onRefresh(card, tab)}
          />
        );
    }
  };

  return (
    <Card classNames={styles.tabWrapper}>
      <TabLayout
        classNames={styles.tabLayout}
        items={(tabConfig?.tabs || [])
          .filter((tab) => tab.code !== 'performance')
          .map((tab) => ({
            key: tab.code,
            label: tab.name,
            children:
              tab?.cards?.length > 1 && tab.code !== 'highlights' ? (
                <TabLayout
                  items={tab.cards.map((card) => ({
                    key: card.code,
                    label: card.name,
                    children: getCardChildren(card.card_type, card, tab),
                  }))}
                  defaultKey={tab.cards?.[0]?.code || ''}
                />
              ) : (
                <div className={styles.tabLayoutChildren}>
                  <div className={styles.cardWrapper}>
                    {tab.cards.map((card) =>
                      getCardChildren(card.card_type, card, tab),
                    )}
                  </div>
                </div>
              ),
          }))}
        defaultKey={selectedTab}
        onChange={(key) => {
          setSelectedTab(key);
        }}
      />
    </Card>
  );
}

export default UserTabs;
