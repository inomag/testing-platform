import _ from 'lodash';
import React from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import { ReactComponent as Google } from 'src/assets/icons/google.svg';
import { ReactComponent as LogIn } from 'src/assets/icons/logIn.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getMetaData } from 'src/models/auth/selectors';
import { useAppSelector } from 'src/store/hooks';
import styles from './index.module.scss';

function ExternallLogin() {
  const metaData = useAppSelector(getMetaData);
  return (
    <div className={styles.loginType__external}>
      {(metaData.providers ?? []).map((provider) => {
        let ProviderIcon: React.ElementType | null = null;
        switch (provider) {
          case 'google':
            ProviderIcon = Google;
            break;
          default:
            ProviderIcon = LogIn;
        }
        return (
          <Button
            data-test-id={`${provider}-button`}
            type="outlined"
            key={provider}
            iconProps={{
              iconPosition: 'left',
              icon: ProviderIcon ? <ProviderIcon /> : null,
            }}
            onClick={() => {
              window.location.href = `${
                window.APP === 'frontendBoard' ? '/frontend/api/auth/login' : ''
              }`;
            }}
          >
            {locale(Keys.LOGIN_WITH_PROVIDER, {
              provider: _.startCase(provider),
            })}
          </Button>
        );
      })}
    </div>
  );
}

export default ExternallLogin;
