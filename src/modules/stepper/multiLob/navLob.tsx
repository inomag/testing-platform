import React, { useCallback, useMemo } from 'react';
import { Button, Tag, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as Selected } from 'src/assets/icons/active.svg';
import { ReactComponent as ArrowRight } from 'src/assets/icons/arrowRight.svg';
import { ReactComponent as Completed } from 'src/assets/icons/completed.svg';
import { useAppDispatch } from 'src/store/hooks';
import { setLobCode } from '../slice';
import { init } from '../thunk';
import { LobProps } from './types';
import styles from './index.module.scss';

function NavLob({
  title,
  button_title,
  lob_code,
  progress_tag,
  last_completed_action,
  next_action,
}: LobProps) {
  const dispatch = useAppDispatch();

  const onNavigateToLob = useCallback(() => {
    dispatch(init({ lobCode: lob_code }));
    dispatch(setLobCode(lob_code));
  }, [dispatch, lob_code]);

  const leadTags = useMemo(
    () => (
      <div className={styles.lob__lead_tags}>
        {last_completed_action && (
          <div className={styles.lob__lead_tags__item}>
            <Completed />
            <Text semiBold>Last Completed : &nbsp;</Text>
            <Text>{last_completed_action}</Text>
          </div>
        )}
        {next_action && (
          <div className={styles.lob__lead_tags__item}>
            <Selected />
            <Text semiBold>Next Step : &nbsp;</Text>
            <Text>{next_action}</Text>
          </div>
        )}
      </div>
    ),
    [last_completed_action, next_action],
  );

  return (
    <Card classNames={styles.lob}>
      <Text semiBold>{title}</Text>
      {progress_tag && <Tag>{progress_tag}</Tag>}
      {leadTags}
      <Button
        className={styles.lob__applicationButton}
        type="outlined"
        rounded
        size="large"
        iconProps={{
          icon: <ArrowRight />,
          iconPosition: 'right',
        }}
        onClick={onNavigateToLob}
      >
        {button_title || 'Start Application'}
      </Button>
    </Card>
  );
}

export default NavLob;
