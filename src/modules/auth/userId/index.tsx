import React, { useCallback, useMemo, useState } from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from '../index.module.scss';

function UserId(props) {
  const [value, setValue] = useState('');
  const { type } = props;

  const onValueChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const loginComponent = useMemo(() => {
    switch (type) {
      case 'EMAIL':
        return (
          <Input
            data-test-id="auth-module-email"
            label={locale(Keys.EMAIL)}
            placeholder={locale(Keys.ENTER_EMAIL)}
            value={value}
            onChange={onValueChange}
            validations={[
              {
                regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,}$/,
                errorMessage: locale(Keys.INVALID_EMAIL),
              },
            ]}
            hideValidation={!value}
          />
        );
      case 'PHONE':
        return (
          <Input
            data-test-id="auth-module-phone"
            label={locale(Keys.PRIMARY_PHONE_NUMBER)}
            placeholder={locale(Keys.ENTER_PHONE_NUMBER)}
            type="number"
            value={value}
            onChange={onValueChange}
            hideValidation={!value}
          />
        );
      default:
        return (
          <Input
            data-test-id="auth-module-email"
            label={locale(Keys.PRIMARY_PHONE_NUMBER)}
            placeholder={locale(Keys.ENTER_PHONE_NUMBER)}
            type="number"
            value={value}
            onChange={onValueChange}
            hideValidation={!value}
          />
        );
    }
  }, [onValueChange, type, value]);

  return (
    <div className={styles.auth__wrapper}>
      <div>{loginComponent}</div>
    </div>
  );
}

export default UserId;
