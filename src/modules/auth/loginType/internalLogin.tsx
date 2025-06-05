import React from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from './index.module.scss';

function InternalLogin() {
  return (
    <div className={styles.auth__wrapper}>
      <Button data-test-id="auth-wrapper-button" type="link">
        {locale(Keys.LOGIN_WITH_OTHER_OPTIONS)}
      </Button>
    </div>
  );
}

export default InternalLogin;
