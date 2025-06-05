import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { List, Popup } from 'src/@vymo/ui/blocks';
import classnames from 'classnames';
import { ReactComponent as CrossIcon } from 'src/assets/icons/cross.svg';
import { ReactComponent as HomeIcon } from 'src/assets/icons/home.svg';
import { ReactComponent as MenuIcon } from 'src/assets/icons/menu.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icons/SignOut.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getAppHideConfig } from 'src/models/appConfig/selectors';
import { setApiStatus } from 'src/models/appConfig/slice';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { isNativeMobileApp } from 'src/workspace/utils';
import styles from './index.module.scss';

function DefaultHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(getUserAuthenticated);
  const portalBranding = useAppSelector(getPortalBranding);
  const appHideConfig = useAppSelector(getAppHideConfig);
  const [showMenu, setShowMenu] = useState(false);

  const handleMenu = useCallback(() => {
    setShowMenu(!showMenu);
  }, [showMenu]);

  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleHome = useCallback(() => {
    dispatch(setApiStatus('go_to_home'));
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(setApiStatus('logout_clicked'));
  }, [dispatch]);

  if (isEmpty(portalBranding)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const headerClasses = classnames(styles.header, {
    [styles.header__mobileApp]: isNativeMobileApp(),
  });

  return (
    <div className={headerClasses} data-test-id="app-header">
      <div>
        {isNativeMobileApp() ? (
          <Text semiBold type="h5" classNames={styles.header__mobileApp__text}>
            {locale(Keys.WELCOME)}
          </Text>
        ) : (
          portalBranding?.logo?.url && (
            <img
              src={portalBranding?.logo?.url}
              width={portalBranding?.logo?.width}
              height={portalBranding?.logo?.height}
              alt="logo"
            />
          )
        )}
      </div>

      {!appHideConfig.headerHamburger && (
        <div className={classnames(styles.header__right)}>
          {isAuthenticated && (
            <Popup
              placement="bottom"
              closeTrigger="click"
              onClose={handleMenuClose}
              className={styles.header__popup}
              content={
                <List>
                  <List.Item>
                    <Button
                      type="text"
                      variant="filled"
                      iconProps={{
                        icon: <HomeIcon />,
                        iconPosition: 'left',
                      }}
                      onClick={handleHome}
                    >
                      {locale(Keys.HOME)}
                    </Button>
                  </List.Item>
                  <List.Item>
                    <Button
                      type="text"
                      variant="filled"
                      iconProps={{
                        icon: <LogoutIcon />,
                        iconPosition: 'left',
                      }}
                      onClick={handleLogout}
                    >
                      {locale(Keys.LOGOUT)}
                    </Button>
                  </List.Item>
                </List>
              }
            >
              <Button
                type="text"
                variant="filled"
                className={
                  isNativeMobileApp()
                    ? styles.header__mobileApp__menu
                    : styles.header__menuButton
                }
                iconProps={{
                  icon: showMenu ? <CrossIcon /> : <MenuIcon />,
                  iconPosition: 'left',
                }}
                onClick={handleMenu}
              />
            </Popup>
          )}
        </div>
      )}
    </div>
  );
}

export default DefaultHeader;
