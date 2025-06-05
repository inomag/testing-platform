import _ from 'lodash';
import React, { useMemo } from 'react';
import { Avatar, Divider, Tag, Text } from 'src/@vymo/ui/atoms';
import { Card, NoData, Popup } from 'src/@vymo/ui/blocks';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppSelector } from 'src/store/hooks';
import { getClientConfigData } from 'src/workspace/utils';
import { getTagValue } from '../queries';
import { getCardData, getError, getIsLoading } from '../selectors';
import styles from '../index.module.scss';

function Profile() {
  const config = getClientConfigData();
  const {
    user_header_information: userHeaderInfo,
    branding,
  }: { user_header_information: any; branding: any } = config;
  const { name, lobs, ...headerFields } = userHeaderInfo;

  const userData = useAppSelector((state) => getCardData(state, 'header'));
  const isLoading = useAppSelector((state) => getIsLoading(state, 'header'));
  const error = useAppSelector((state) => getError(state, 'header'));

  const tags: string[] = useMemo(
    () =>
      Object.entries(headerFields).reduce((acc: string[], [key]) => {
        const value = _.get(userData?.inputs_map || {}, key, '');
        if (value) {
          acc.push(value);
        }
        return acc;
      }, []),
    [headerFields, userData],
  );

  const attributes: React.ReactElement[] = useMemo(
    () =>
      (lobs || [])
        .map((lob) => {
          const headerKey = _.get(
            userData?.inputs_map || {},
            lob?.lob_type,
            '',
          );
          const headerValue = _.get(
            userData?.inputs_map || {},
            lob?.lob_name,
            '',
          );
          if (!headerKey || !headerValue) return '';
          return (
            <div className={styles.profileCard__attributesWrapper__attribute}>
              <Text bold type="label">
                {`${headerKey}: `}
              </Text>
              <Text type="label">{headerValue}</Text>
            </div>
          );
        })
        .filter((attr) => attr?.length),
    [lobs, userData],
  );

  const getChildren = () => {
    if (isLoading) {
      return <SkeletonLoader avtar lines={4} />;
    }

    if (error) {
      return <NoData message={locale(Keys.ERROR_FETCHING_PROFILE_DATA)} />;
    }

    if (!userData || _.isEmpty(userData)) {
      return <NoData message={locale(Keys.NO_PROFILE_DATA_FOUND)} />;
    }

    return (
      <div className={styles.profileCard}>
        <div className={styles.profileCard__header}>
          <Avatar
            imageUrl={userData.profile_photo_s3_link}
            text={(userData?.name || name)?.charAt(0)}
            shape="circle"
            background={branding?.colors?.secondary}
            size="large"
          />
          <div className={styles.profileCard__header__info}>
            <Text type="h4">{userData.name || name}</Text>
            <div className={styles.profileCard__header__tags}>
              {tags.slice(0, 2).map((tag) => (
                <Tag variant="info">
                  <Text type="label" bold>
                    {getTagValue(tag)}
                  </Text>
                </Tag>
              ))}
              {tags.length > 2 && (
                <Popup
                  content={
                    <div
                      className={styles.profileCard__header__tags__placeholder}
                    >
                      {tags.slice(2).join(', ')}
                    </div>
                  }
                  openTrigger="hover"
                  closeTrigger="hover"
                >
                  <Tag variant="info">
                    <Text type="label" bold>
                      {`+${tags.length - 2}`}
                    </Text>
                  </Tag>
                </Popup>
              )}
            </div>
          </div>
        </div>
        {attributes.length > 0 && <Divider />}
        <div className={styles.profileCard__attributesWrapper}>
          {attributes.map((attribute) => attribute)}
        </div>
      </div>
    );
  };

  // const userData = headerResponse;

  return <Card classNames={styles.profileCardWrapper}>{getChildren()}</Card>;
}

export default Profile;
