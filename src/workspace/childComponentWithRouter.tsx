import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ChildComponent from './childComponent';
import { getModuleById, getModulesConfig, runHostAppConfig } from './queries';
import { getWorkspaceRedirectPath } from './selectors';
import {
  renderDialogsFromAppSearchParams,
  setRouteModule,
  unSetRedirectPath,
} from './slice';
import { isWebPlatform, setReactRouteNavigate } from './utils';
import styles from './index.module.scss';

function ChildComponentWithRouter({ id, props }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // passing navigate instance to workspace utils
  setReactRouteNavigate(navigate);
  const [searchParams] = useSearchParams();

  // params will be synced to props for module
  const params = useParams();

  const redirectPath = useAppSelector(getWorkspaceRedirectPath);

  useEffect(() => {
    // this will render the dialogs if there is any browser url change or at first run of app
    // this will sync the params to props of dialog module
    dispatch(renderDialogsFromAppSearchParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('dialogs'), params]);

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
    return () => {
      dispatch(unSetRedirectPath());
    };
  }, [redirectPath, id, navigate, dispatch]);

  const moduleConfig = useMemo(() => getModulesConfig(false), []);

  useMemo(() => {
    const module = getModuleById(id, moduleConfig);
    if (module) {
      // module responsible for route hash
      if (!isWebPlatform()) {
        runHostAppConfig(module.hostApp);
      }

      dispatch(setRouteModule(_.omit(module, 'element')));
    }
  }, [dispatch, id, moduleConfig]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <div className={styles.workspace__childComponentWithRouter}>
      <ChildComponent id={id} props={{ ...props, ...params }} />
    </div>
  );
}

export default React.memo(ChildComponentWithRouter);
