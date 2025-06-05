import React, { useMemo } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { Card, ImageLoader } from 'src/@vymo/ui/blocks';
import { useMachine } from '@xstate/react';
import classnames from 'classnames';
import { getErrorMessage } from 'src/models/appConfig/selectors';
import { getAuthHeaderUi, getAuthSceanioType } from 'src/models/auth/selectors';
import { useAppSelector } from 'src/store/hooks';
import { isMobile } from 'src/workspace/utils';
import LoginType from './loginType';
import { getAuthMachine } from './queries';
import SetupAuth from './setupAuth';
import UserAuthentication from './userAuthentication';
import UserId from './userId';
import VerifyInput from './verifyInput';
import VerifyUserAuth from './verifyUserAuth';
import styles from './index.module.scss';

// new user -> user id(phone/email) -> mode of user verification(otp)  -> setup mpin/password
// new user -> user id(email) -> link verification on the email  -> setup mpin/password
// exisiting user -> user id(user id will come from first step) -> mode of authencation(mpin/otp/password)
// social login (third party) => user id will come from Oauth2 and create entry in backend->

// type of login -> internal, external(oauth 2)
// user id -> internal -> phone/email || external -> cookies

function Auth() {
  const { scenario, type, functionality } = useAppSelector(getAuthSceanioType);
  const error = useAppSelector(getErrorMessage);

  const authMachine = useMemo(
    // TODO - set the config based on starting scenario
    () => getAuthMachine(scenario, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [machineState, send] = useMachine(authMachine);

  const renderAuthContent = () => {
    switch (machineState.value) {
      case 'loginType':
        return <LoginType type={type as 'INTERNAL' | 'EXTERNAL' | 'ALL'} />;
      case 'userId':
        return <UserId type={type} />;
      case 'userAuthentication':
        return <UserAuthentication type={type} />;
      case 'verifyUserInput':
        return <VerifyInput type={type} />;
      case 'verifyUserAuth':
        return <VerifyUserAuth />;
      case 'setupAuth':
        return <SetupAuth type={type as 'MPIN' | 'PASSWORD'} />;
      default:
        return null;
    }
  };

  const authHeaderUi = useAppSelector(getAuthHeaderUi);

  const renderAuthHeader = () => (
    <div className={styles.authContainer__header}>
      {authHeaderUi?.image && (
        <ImageLoader
          className={styles.authContainer__header__image}
          src={authHeaderUi.image}
          alt="auth-header"
        />
      )}
      {authHeaderUi?.title && <Text type="h4">{authHeaderUi.title}</Text>}
      {authHeaderUi?.description && <Text>{authHeaderUi.description}</Text>}
    </div>
  );

  const renderAuthComponent = () => (
    <>
      {authHeaderUi ? renderAuthHeader() : null}
      {renderAuthContent()}
      <div className={styles.cta__container} />
      {error && (
        <Text
          data-test-id="auth-section-error"
          classNames={styles.auth__section__error}
        >
          {error}
        </Text>
      )}
    </>
  );
  return (
    <div
      className={classnames(styles.authContainer, {
        [styles.authContainer__full]: functionality === 'full',
      })}
    >
      {functionality === 'full' && !isMobile() ? (
        <Card classNames={styles.authContainer__full__card}>
          {renderAuthComponent()}
        </Card>
      ) : (
        renderAuthComponent()
      )}
    </div>
  );
}

export default Auth;
