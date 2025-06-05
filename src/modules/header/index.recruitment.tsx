import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import classnames from 'classnames';
import { ReactComponent as LogoutIcon } from 'src/assets/icons/logout.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { logoutAPI } from 'src/models/recruitmentMeta/thunk';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import styles from './index.module.scss';

function RecruitmentHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(getUserAuthenticated);
  const portalBranding = useAppSelector(getPortalBranding);

  // TODO: Logout action should be moved to sidebar
  const handleLogout = () => {
    dispatch(logoutAPI());
  };
  return (
    <div className={styles.header} data-test-id="app-header">
      <img
        src={portalBranding?.logo?.url}
        width={portalBranding?.logo?.width}
        height={portalBranding?.logo?.height}
        alt="logo"
      />

      <div
        className={classnames(
          styles['header-right-web'],
          styles['header-right'],
        )}
      >
        {/* <Button
          type="text"
          className={classnames(styles['contact-us'], styles['contact-button'])}
          iconProps={{ icon: <ContactIcon />, iconPosition: 'left' }}
        >
          Contact us
        </Button> */}
        {isAuthenticated && (
          <Button onClick={handleLogout}>{locale(Keys.LOGOUT)}</Button>
        )}
      </div>
      <div
        className={classnames(
          styles['header-right-mobile'],
          styles['header-right'],
        )}
      >
        {/* <Button type="text" className={classnames(styles['contact-us'])}>
          <ContactIcon />
        </Button> */}
        {isAuthenticated && (
          <Button
            type="text"
            className={styles['logout-button']}
            iconProps={{ icon: <LogoutIcon />, iconPosition: 'left' }}
            onClick={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default RecruitmentHeader;
