import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from 'src/@vymo/ui/atoms/loader';
import classnames from 'classnames';
import {
  getClientCode,
  getIsInitialised,
  getPortalBranding,
} from 'src/models/portalConfig/selectors';
import { initAPI, resetState } from 'src/models/recruitmentMeta/thunk';
import { AUTH, RECRUITMENT } from 'src/modules/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import { getInitAPIPayload } from 'src/modules/recruitment/queries';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderModule } from 'src/workspace/slice';
import OTPAuth from './otpAuth';
import { getIsAuthenticated } from './selectors';
import { setUid } from './slice';
import { checkAuthStatus } from './thunk';
import { AuthProps } from './types';
import styles from './index.module.scss';

function Auth(props: React.FC<AuthProps>) {
  // eslint-disable-next-line no-console
  console.log(props);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(getIsAuthenticated);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchParams] = useSearchParams();
  const isPortalBrandingLoaded = useAppSelector(getIsInitialised);
  const client = useAppSelector(getClientCode);
  const portalBranding = useAppSelector(getPortalBranding);

  useEffect(() => {
    if (!initialLoad) {
      if (isAuthenticated) {
        dispatch(resetState());
        dispatch(
          renderModule({
            id: RECRUITMENT,
            props: { lastPage: AUTH },
          }),
        );
      } else {
        const payload = getInitAPIPayload(searchParams);
        dispatch(initAPI({ payload }));
      }
    }
  }, [isAuthenticated, dispatch, initialLoad, searchParams]);

  useEffect(() => {
    if (!initialLoad && !isPortalBrandingLoaded) {
      dispatch(initAPI({ payload: getInitAPIPayload(searchParams) }));
    }
  }, [client, dispatch, initialLoad, isPortalBrandingLoaded, searchParams]);

  useEffect(() => {
    dispatch(checkAuthStatus());
    setInitialLoad(false);
    dispatch(setUid(searchParams.get('uid') || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAuthComponent = () => <OTPAuth />;

  const renderAuth = useMemo(() => {
    if (!isPortalBrandingLoaded) {
      return <Loader fullPage />;
    }
    return (
      <div className={styles['auth-screen']}>
        <div className={classnames(styles.container)}>
          <div className={classnames(styles.container__banner)}>
            <img
              className={styles.image}
              // TODO - Harshit oonboarding
              // @ts-ignore
              src={portalBranding?.banner?.url}
              alt="banner"
              // TODO - Harshit oonboarding
              // @ts-ignore
              height={portalBranding?.banner?.height}
            />
          </div>

          <div className={styles['container__auth-section']}>
            {renderAuthComponent()}
          </div>
        </div>
      </div>
    );
  }, [
    isPortalBrandingLoaded,
    // @ts-ignore
    portalBranding?.banner?.height,
    // @ts-ignore
    portalBranding?.banner?.url,
  ]);

  return renderAuth;
}

export default Auth;
