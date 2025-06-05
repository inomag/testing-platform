import _ from 'lodash';
import React from 'react';
import { NoData } from 'src/@vymo/ui/blocks';
// import { userData, userProfileGroups } from './constants';
import classNames from 'classnames';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getClientConfigData } from 'src/workspace/utils';
import { ProfileGroup } from './groups';
import ProfileNavigation from './groups/navigation';
import { ProfileCard } from './profileCard';
import styles from './index.module.scss';

function UserProfile() {
  const config = getClientConfigData();
  const { user, user_profile_config: userProfileConfig } = config;
  if (_.isEmpty(user)) {
    return <NoData message={locale(Keys.USER_PROFILE_GROUPS_NOT_FOUND)} />;
  }

  const enabledGroupsConfig = (userProfileConfig?.groups || []).map(
    (group) => ({
      code: group.code,
      name: group.name,
      category: (group?.category || []).filter(
        (groupCategory) => !['website'].includes(groupCategory.type),
      ),
    }),
  );

  return (
    <div
      className={classNames(styles.userProfile)}
      id="userProfileWrapper"
      data-test-id="userProfileWrapper"
    >
      <ProfileNavigation userProfileGroups={enabledGroupsConfig} />
      <div className={styles.userProfile__navigationPlaceholder} />
      <div
        className={styles.userProfileContainer}
        data-test-id="userProfileContainer"
      >
        <ProfileCard
          {...{ ...user?.attributes, ...user }}
          imageUrl={user.profile_photo_s3_link}
        />
        {enabledGroupsConfig.map((group) => (
          <ProfileGroup group={group} />
        ))}
      </div>
    </div>
  );
}
export default UserProfile;
