import _ from 'lodash';
import React from 'react';
import { Avatar, Button, Tag, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as DownloadIcon } from 'src/assets/icons/downloadNew.svg';
import { ReactComponent as EmailIcon } from 'src/assets/icons/email.svg';
import { ReactComponent as PhoneIcon } from 'src/assets/icons/phone.svg';
import { ReactComponent as ShareIcon } from 'src/assets/icons/share.svg';
import { ReactComponent as SocialIcon } from 'src/assets/icons/social.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppSelector } from 'src/store/hooks';
import { getClientConfigData } from 'src/workspace/utils';
import { getCategoryData, getError, getIsLoading } from '../selectors';
import styles from './index.module.scss';

type ProfileCardProps = {
  name: string;
  role: string;
  tier: string;
  website: string;
  email: string;
  phone: string;
  imageUrl: string;
};

export function ProfileCard({
  name,
  role,
  tier = '',
  website,
  email,
  phone,
  imageUrl,
}: ProfileCardProps) {
  const { branding } = getClientConfigData();

  const isLoading = useAppSelector((state) =>
    getIsLoading(state, 'profileHeader'),
  ) as boolean;

  const error = useAppSelector((state) => getError(state, 'profileHeader'));
  const categoryData = useAppSelector((state) =>
    getCategoryData(state, 'profileHeader'),
  );

  return (
    <Card classNames={styles.profile__card}>
      <div className={styles.profile__card__content}>
        <div className={styles.profile__header}>
          <Avatar
            imageUrl={imageUrl}
            text={name.charAt(0)}
            shape="circle"
            background={branding?.colors?.secondary}
            size="large"
          />
          <div className={styles.profile__header__text}>
            <Text type="h5">{name}</Text>
            <Text type="label">{role}</Text>
            {tier && (
              <Tag variant="info" bold>
                {tier}
              </Tag>
            )}
          </div>
        </div>

        <div className={styles.profile__info}>
          {website && (
            <div className={styles.profile__info__social}>
              <SocialIcon />
              <Text link={website} type="label">
                <span className={styles.profile__info__link}>{website}</span>
              </Text>
            </div>
          )}
          {email && (
            <div className={styles.profile__info__social}>
              <EmailIcon />
              <Text link={`mailTo:${email}`} type="label">
                <span className={styles.profile__info__link}>{email}</span>
              </Text>
            </div>
          )}
          {phone && (
            <div className={styles.profile__info__social}>
              <PhoneIcon />
              <Text type="label">{phone}</Text>
            </div>
          )}
        </div>
        <div className={styles.profile__footer}>
          <img
            src={
              branding?.default_logo?.url ||
              'https://43906338.fs1.hubspotusercontent-na1.net/hubfs/43906338/Logos/Logo_dark%20text.png'
            }
            alt="logo"
            className={styles.profile__coverImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://43906338.fs1.hubspotusercontent-na1.net/hubfs/43906338/Logos/Logo_dark%20text.png';
            }}
          />
          <div className={styles.profile__footer__buttonContainer}>
            <Button
              type="outlined"
              className={styles.profile__card__button}
              iconProps={{ icon: <ShareIcon />, iconPosition: 'left' }}
              loading={isLoading}
              onClick={() =>
                categoryData?.business_card?.share_message
                  ? navigator.share({
                      title: name,
                      text: categoryData?.business_card?.share_message,
                      url: categoryData?.business_card?.access_link,
                    })
                  : null
              }
              disabled={
                Boolean(error) || _.isEmpty(categoryData?.business_card)
              }
            >
              {locale(Keys.SHARE)}
            </Button>
            <Button
              type="outlined"
              className={styles.profile__card__button}
              iconProps={{ icon: <DownloadIcon />, iconPosition: 'left' }}
              loading={isLoading}
              onClick={() =>
                categoryData?.business_card?.access_link
                  ? window.open(
                      categoryData.business_card.access_link,
                      '_blank',
                    )
                  : null
              }
              disabled={
                Boolean(error) || _.isEmpty(categoryData?.business_card)
              }
            >
              {locale(Keys.DOWNLOAD)}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
