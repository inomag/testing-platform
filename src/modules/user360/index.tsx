import _ from 'lodash';
import React, { useMemo } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { Banner, NoData } from 'src/@vymo/ui/blocks';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  getWorkflowActionMessage,
  getWorkflowActionState,
} from 'src/models/lmsConfig/selectors';
import { useAppSelector } from 'src/store/hooks';
import { getClientConfigData } from 'src/workspace/utils';
import Profile from './profile';
import { User360Config } from './types';
import UserTabs from './user360Tabs';
import UserActions from './userActions';
import styles from './index.module.scss';

function User360({ userCode }: { userCode: string }) {
  const config = getClientConfigData();
  const {
    user_360_configs: user360Config,
    user,
  }: { user_360_configs: User360Config; user: any } = config;
  const workflowActionMessage = useAppSelector((state) =>
    getWorkflowActionMessage(state),
  );
  const workflowActionState = useAppSelector((state) =>
    getWorkflowActionState(state),
  );

  const user360tabs = useMemo(() => {
    const tabs = user360Config.tabs || [];
    if (user.isAdmin || user?.code === 'SU') {
      return [
        ...tabs,
        {
          code: 'history',
          name: locale(Keys.HISTORY),
          cards: [
            {
              code: 'audit_history',
              name: locale(Keys.AUDIT_HISTORY),
              card_type: 'audit_history',
            },
          ],
        },
      ];
    }
    return tabs;
  }, [user?.code, user.isAdmin, user360Config.tabs]);

  if (_.isEmpty(user360Config)) {
    return <NoData message={locale(Keys.USER_360_DATA_NOT_FOUND)} />;
  }

  return (
    <Banner
      position="topRight"
      key={workflowActionMessage}
      message={workflowActionMessage}
      duration={1500}
      banner
      variant={workflowActionState === 'success' ? 'success' : 'error'}
      classNames={styles.user360wrapper}
    >
      <Text type="h3">{locale(Keys.USER_DETAILS)}</Text>
      <UserActions />
      <div className={styles.mainSection}>
        <Profile />
        <UserTabs
          userCode={userCode}
          tabConfig={{
            ...user360Config,
            tabs: user360tabs,
          }}
        />
      </div>
    </Banner>
  );
}

export default User360;
