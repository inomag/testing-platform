import _ from 'lodash';
import React from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Card, NoData } from 'src/@vymo/ui/blocks';
import { ReactComponent as Navigation } from 'src/assets/icons/navigation.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { WORKFLOW_FORM } from 'src/modules/constants';
import { useAppDispatch } from 'src/store/hooks';
import { renderDialog } from 'src/workspace/slice';
import { navigate } from 'src/workspace/utils';
import { getActivityProps } from './queries';
import styles from './index.module.scss';

function Activities({ data, card }) {
  const { results } = data;
  const dispatch = useAppDispatch();

  const navigateToTaskUpdate = (activity) => {
    dispatch(
      renderDialog({
        id: WORKFLOW_FORM,
        props: {
          action: 'update_task',
          moduleCode: _.get(activity, 'data.vo.vo_module.code') || 'user',
          voId: activity?.code,
        },
      }),
    );
  };

  return (
    <>
      <Text semiBold type="label">
        {`${card.name} (${results?.length})`}
      </Text>
      <div className={styles.activityCardWrapper}>
        {!results?.length && (
          <NoData
            message={locale(Keys.NO_DATA_FOUND_FOR_CARD, {
              cardName: card.name,
            })}
          />
        )}
        {results.map((activity) => {
          const { name, date, month, infoList, showEditIcon } =
            getActivityProps(activity);
          return (
            <Card classNames={styles.activityCard}>
              <div className={styles.activityCard__header}>
                <Card classNames={styles.activityCard__header__dateCard}>
                  <div
                    className={styles.activityCard__leftSection__dateCard__date}
                  >
                    {date}
                  </div>
                  <div
                    className={
                      styles.activityCard__leftSection__dateCard__month
                    }
                  >
                    {month}
                  </div>
                </Card>
                <div className={styles.activityCard__header__name}>{name}</div>
              </div>
              <div className={styles.activityCard__detailsWrapper}>
                <div className={styles.activityCard__details}>
                  {infoList.map((info) => (
                    <Text>{info?.title}</Text>
                  ))}
                </div>
                <div className={styles.activityCard__navigate}>
                  {showEditIcon && (
                    <Button
                      className={styles.activityCard__navigate__button}
                      type="text"
                      onClick={() => navigateToTaskUpdate(activity)}
                    >
                      {locale(Keys.UPDATE)}
                    </Button>
                  )}
                  <div className={styles.activityCard__navigate__icon}>
                    <Navigation
                      onClick={() => {
                        navigate(
                          'taskDetails',
                          // eslint-disable-next-line no-underscore-dangle
                          { leadId: activity?.code },
                          {},
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export default Activities;
