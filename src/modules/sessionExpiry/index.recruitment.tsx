import React, { useEffect, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import Modal, { Body, Footer, Header } from 'src/@vymo/ui/blocks/modal';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { logoutAPI } from 'src/models/recruitmentMeta/thunk';
import { getLastApiHitTime } from 'src/models/session/queries';
import {
  getSessionLiveliness,
  getSessionTimeout,
} from 'src/models/session/selectors';
import { setTimeout as setSessionTimeout } from 'src/models/session/slice';
import { checkLiveliness } from 'src/models/session/thunk';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

const RecruitmentExpiryComponent: React.FC<any> = React.memo(() => {
  const dispatch = useAppDispatch();
  const timeout = useAppSelector(getSessionTimeout);
  const isSessionAlive = useAppSelector(getSessionLiveliness);

  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [shouldLogout, setShouldLogout] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null;

    const checkApiCall = () => {
      const lastApiCallTime: number = getLastApiHitTime();
      const timeElapsedSinceLastApiCall = Date.now() - lastApiCallTime;
      const remainingTime = timeout - timeElapsedSinceLastApiCall;
      if (remainingTime > 0) {
        timer = setTimeout(checkApiCall, remainingTime);
      } else {
        setSessionExpired(true);
        timer = setTimeout(checkApiCall, timeout);
      }
    };
    // Start initial timer
    timer = timeout ? setTimeout(checkApiCall, timeout) : null;

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout]);

  useEffect(() => {
    if (sessionExpired && shouldLogout && !isSessionAlive) {
      dispatch(logoutAPI());
      setSessionExpired(false);
      setShouldLogout(false);
      dispatch(setSessionTimeout(0));
    }
  }, [dispatch, shouldLogout, sessionExpired, isSessionAlive]);

  useEffect(() => {
    const handleClick = () => {
      dispatch(checkLiveliness());
    };

    document.addEventListener('visibilitychange', handleClick);

    return () => {
      document.removeEventListener('visibilitychange', handleClick);
    };
  }, [dispatch]);

  return (
    <Modal open={sessionExpired} onClose={() => setShouldLogout(true)}>
      <Header>{locale(Keys.SESSION_EXPIRED)}</Header>
      <Body>
        <Text>{locale(Keys.ERROR_SESSION_EXPIRED_LOGGED_OUT)}</Text>
      </Body>
      <Footer>
        <Button type="primary" onClick={() => setShouldLogout(true)}>
          {locale(Keys.RESUME_SESSION)}
        </Button>
      </Footer>
    </Modal>
  );
});

export default RecruitmentExpiryComponent;
