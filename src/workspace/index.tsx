import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { createHashRouter } from 'react-router-dom';
import { Loader } from 'src/@vymo/ui/atoms';
import Banner from 'src/@vymo/ui/blocks/banner';
import { initialiseFeatureFlags } from 'src/featureFlags';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { getIsAuthenticated } from 'src/modules/authLegacy/selectors';
import { ModulesList } from 'src/modules/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ChildComponentWithRouter from './childComponentWithRouter';
import DialogWorkspace from './dialogWorkspace';
import { afterWorkspaceInit, beforeWorkspaceInit } from './lifecycle';
import {
  getModulesConfig,
  getPlatformPrefixPathFromHash,
  getRoutesConfig,
} from './queries';
import RecursiveWrapper from './recursiveWrapper';
import { getWorkspaceFullPage, getWorkspaceModules } from './selectors';
import { loadModules } from './slice';
import '../designTokens/cssVariables.scss';
import '../designTokens/scssVariables.scss';

interface HostApp {
  platform?: 'ios' | 'android' | 'web' | 'selfserve';
  moduleProps?: any;
  getClientConfig?: any;
  navigate?: any;
  back?: any;
  reload?: any;
  location?: {
    path: string;
    pathParams: Record<string, string>;
    query: Record<string, string>;
  };
  visitorToken?: string;
  getNavigationItems?: any;
  closePortal?: (
    isLoginInit?: boolean,
    isInitSession?: boolean,
    authToken?: string,
  ) => void;
}

declare global {
  interface Window {
    hostApp?: HostApp | null;
    isWebPlatform?: boolean;
    moduleProps?: any;
  }
}

// const urlParams = new URLSearchParams(window.location.search);
// const devtools = urlParams.get('devtools');

// TODO - Remove one feature flag implementation
initialiseFeatureFlags();

function Workspace({
  moduleList,
  layout,
  homePath = '/',
  loginPath,
  beforeAppInitFunction = _.noop,
  afterAppInitFunction = _.noop,
}: {
  moduleList?: ModulesList;
  layout: any;
  homePath?: string;
  loginPath?: string;
  beforeAppInitFunction?: () => void;
  afterAppInitFunction?: () => void;
}) {
  const [isBeforeInitDone, setIsBeforeInit] = useState(false);
  const [lifeCycleError, setLifeCycleError] = useState();

  const dispatch = useAppDispatch();

  const modulesConfig = useMemo(
    () => getModulesConfig(true, getPlatformPrefixPathFromHash(), moduleList),
    [moduleList],
  );

  const workspaceModules = useAppSelector(getWorkspaceModules);

  const fullPage = useAppSelector(getWorkspaceFullPage);

  const isLegacyAuthentciated = useAppSelector(getIsAuthenticated);

  const isUserAuthenticated = useAppSelector(getUserAuthenticated);

  const isAuthenticated = isLegacyAuthentciated || isUserAuthenticated;

  useEffect(() => {
    dispatch(loadModules(modulesConfig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const router = useMemo(() => {
    const moduleRoutes = getRoutesConfig(
      modulesConfig,
      homePath,
      isAuthenticated,
      loginPath,
    ).map((moduleConfig) => {
      if (
        !['noModuleAdded', 'fallback', 'root'].includes(
          String(moduleConfig.code),
        )
      ) {
        const props =
          workspaceModules.find(({ code }) => code === moduleConfig.code)
            ?.props ?? {};
        // @ts-ignore
        moduleConfig.element = (
          <ChildComponentWithRouter id={moduleConfig.code} props={props} />
        );
      }
      return moduleConfig;
    });

    if (moduleRoutes.length > 0) {
      return createHashRouter(moduleRoutes);
    }
    return null;
  }, [homePath, isAuthenticated, loginPath, modulesConfig, workspaceModules]);

  useEffect(() => {
    const initializeWorkspace = async () => {
      try {
        await beforeWorkspaceInit(beforeAppInitFunction);
        setIsBeforeInit(true);
        await afterWorkspaceInit(afterAppInitFunction);
      } catch (error: any) {
        setIsBeforeInit(true);
        setLifeCycleError(error.message ?? error);
      }
    };

    initializeWorkspace();
  }, [afterAppInitFunction, beforeAppInitFunction]);

  if (window.isCypressModule) {
    return layout;
  }

  if (workspaceModules.length === 0) {
    return null;
  }

  if (!isBeforeInitDone) {
    return <Loader fullPage />;
  }

  return (
    <>
      <Banner message={lifeCycleError} variant="error" position="topRight" />
      <RecursiveWrapper fullPage={fullPage} router={router}>
        {layout}
      </RecursiveWrapper>

      {/* {devtools && <FeatureFlagDevTool />} */}
      <DialogWorkspace />
    </>
  );
}

export default Workspace;
