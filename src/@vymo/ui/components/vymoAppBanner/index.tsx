import React, { useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { ReactComponent as CrossIcon } from 'src/assets/icons/cross.svg';
import { ReactComponent as VymoAppIcon } from 'src/assets/icons/vymoAppIcon.svg';
import { isIOSPlatform } from 'src/workspace/utils';
import { VymoAppBannerProps } from './types';
import styles from './index.module.scss';

function VymoAppBanner({
  'data-test-id': dataTestId = 'vymo-app-banner',
}: VymoAppBannerProps) {
  const [showAppBanner, setShowAppBanner] = useState(true);

  const onClickClose = () => {
    setShowAppBanner(false);
  };
  return showAppBanner ? (
    <div data-test-id={dataTestId} className={styles.appBanner}>
      <div
        data-test-id={`${dataTestId}-icon-container`}
        className={styles.appBanner__icon}
      >
        <CrossIcon
          className={styles.appBanner__icon__close}
          onClick={onClickClose}
        />
        <VymoAppIcon />
        <Text type="h5"> Vymo </Text>
      </div>
      <Button
        size="small"
        className={styles.appBanner__button}
        data-test-id={`${dataTestId}-button`}
        rounded
        type="outlined"
        variant="info"
        onClick={() => {
          window.open(
            isIOSPlatform()
              ? 'https://apps.apple.com/in/app/abc-stellar/id6736935961'
              : 'https://play.google.com/store/apps/details?id=com.abc.android',
            '_blank',
          );
        }}
      >
        Open App
      </Button>
    </div>
  ) : null;
}

export default VymoAppBanner;
