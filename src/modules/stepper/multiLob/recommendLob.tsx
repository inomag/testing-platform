import React, { useCallback } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { ReactComponent as NavRight } from 'src/assets/icons/navRight.svg';
import { RecommendLobType } from './types';
import styles from './index.module.scss';

function RecommendLob({
  bullet_list = [],
  title,

  setShowChooseInterest,
}: RecommendLobType) {
  const onNavigateToLob = useCallback(() => {
    setShowChooseInterest(true);
  }, [setShowChooseInterest]);

  return (
    <div className={styles.lob__recommended}>
      <div className={styles.lob__header}>
        <Text semiBold>{title}</Text>
        <Button
          className={styles.lob__header__button}
          type="text"
          iconProps={{
            icon: <NavRight />,
            iconPosition: 'right',
          }}
          onClick={onNavigateToLob}
        />
      </div>

      <div className={styles.lob__bulletList}>
        {bullet_list.map((bullet) => (
          <Text type="sublabel">
            <li> {bullet} </li>
          </Text>
        ))}
      </div>
    </div>
  );
}

export default RecommendLob;
