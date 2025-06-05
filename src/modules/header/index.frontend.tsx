import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Avatar, Button, Text } from 'src/@vymo/ui/atoms';
import { ImageLoader, List, Popup } from 'src/@vymo/ui/blocks';
import classnames from 'classnames';
import { ReactComponent as CrossIcon } from 'src/assets/icons/cross.svg';
import { ReactComponent as MenuIcon } from 'src/assets/icons/menu.svg';
import { ReactComponent as MoonIcon } from 'src/assets/icons/moon.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icons/SignOut.svg';
import { ReactComponent as SlackIcon } from 'src/assets/icons/slack.svg';
import { ReactComponent as SunIcon } from 'src/assets/icons/sun.svg';
import { getTheme, toggleTheme } from 'src/designTokens/themes/utils';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getLoggedInUserInfo } from 'src/models/appConfig/selectors';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { logout } from 'src/models/auth/thunk';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { isNativeMobileApp } from 'src/workspace/utils';
import styles from './index.module.scss';

type UserInfo = {
  name?: string;
};

function FrontendBoardHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(getUserAuthenticated);
  const userInfo = useAppSelector(getLoggedInUserInfo) as UserInfo;
  const [showMenu, setShowMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const headerClasses = classnames(
    `${styles.header} ${styles.header__frontend}`,
    {
      [styles.header__mobileApp]: isNativeMobileApp(),
    },
  );

  const handleMenu = useCallback(() => {
    setShowMenu(!showMenu);
  }, [showMenu]);

  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout({ api: '/frontend/api/auth/logout' }));
  }, [dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={headerClasses} data-test-id="app-header">
      <div>
        <ImageLoader src="/frontendBanner.webp" alt="Vymo" width={140} />
      </div>

      <div className={classnames(styles.header__right)}>
        <Button
          type="text"
          variant="filled"
          className={
            isNativeMobileApp()
              ? styles.header__mobileApp__menu
              : styles.header__menuButton
          }
          iconProps={{
            icon: currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />,
            iconPosition: 'left',
          }}
          onClick={() => {
            setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
            toggleTheme();
          }}
        />
        {isAuthenticated && (
          <Popup
            placement="bottom"
            closeTrigger="click"
            onClose={handleMenuClose}
            className={styles.header__popup}
            content={
              <List>
                <List.Item className={styles.header__frontend__user}>
                  <Avatar
                    size="small"
                    shape="rounded"
                    text={_.capitalize(userInfo?.name?.[0])}
                  />
                  <Text> {userInfo?.name}</Text>
                </List.Item>

                <List.Item>
                  <Button
                    type="text"
                    variant="filled"
                    iconProps={{
                      icon: <SlackIcon />,
                      iconPosition: 'left',
                    }}
                    onClick={() => {
                      window.open(
                        'https://vymo.slack.com/archives/CR1F27L6T',
                        '_slackContact',
                      );
                    }}
                  >
                    {locale(Keys.CONTACT_US)}
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
    </div>
  );
}

export default FrontendBoardHeader;
