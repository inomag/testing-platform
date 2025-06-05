import { isEmpty } from 'lodash';
import React from 'react';
import { generatePath, matchPath, Navigate } from 'react-router-dom';
import { Loader } from 'src/@vymo/ui/atoms';
import { getFeatureFlag } from 'src/featureFlags';
import Logger from 'src/logger';
import {
  HostAppConfig,
  Module,
  ModulesList,
  ModuleTypeValue,
} from 'src/modules/types';
import NoModuleAddedPage from './noModuleAddedPage';
import NotFoundPage from './notFoundPage';
import { ModuleState } from './types';
import {
  getAppDeviceType,
  getAppLocationInfo,
  getModuleProps,
  isLmsWeb,
  isSelfServe,
  isWebPlatform,
  setAppRouteParams,
} from './utils';

const log = new Logger('workspace utils');

const moduleListConfig: Record<string, Module> = {};

export const normalizePath = (path = '') => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const getModuleById = (
  moduleId: string | null,
  moduleConfigList: Record<string, Module>,
) => {
  const moduleConfig = moduleConfigList[String(moduleId)];
  return moduleConfig;
};

export const getModulesConfig = (
  update,
  hostAppBasePath?: string,
  moduleList?: ModulesList,
) => {
  if (!update) {
    return moduleListConfig;
  }

  Object.entries(moduleList ?? {})
    .filter(([, module]) =>
      module?.featureFlag ? getFeatureFlag(module?.featureFlag) : true,
    )
    .forEach(([type, module]) => {
      moduleListConfig[type] = {
        ...module,
        // @ts-ignore
        code: type,
        // @ts-ignore
        element: true,
        path: module.path
          ? `${hostAppBasePath}${normalizePath(module.path)}`
          : '',
      };
    });

  return moduleListConfig;
};

const base64ToBuf = (key: string) =>
  Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

export const decrypt = async (
  encryptedText: string,
  ENCRYPTION_KEY: string,
) => {
  const key = await window.crypto.subtle.importKey(
    'raw',
    base64ToBuf(ENCRYPTION_KEY),
    { name: 'AES-CBC', length: 128 },
    true,
    ['encrypt', 'decrypt'],
  );
  const [iv, cipherText] = encryptedText.split('.');
  const plainTextBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: base64ToBuf(iv) },
    key,
    base64ToBuf(cipherText),
  );
  return new TextDecoder().decode(plainTextBuffer);
};

export const getStyle = (styles): React.CSSProperties => {
  if (isEmpty(styles)) return {};
  const { m, t, d } = styles;
  const deviceType = getAppDeviceType();
  let updatedStyles = {} as React.CSSProperties;
  if (deviceType === 'Mobile') {
    updatedStyles = { width: m.w ?? '100vw', height: m.h ?? '100dvh' };
  }
  if (deviceType === 'Tablet' && t?.w && t?.h) {
    updatedStyles = { width: t.w, height: t.h };
  }
  if (deviceType === 'Desktop' && d?.w && d?.h) {
    updatedStyles = { width: d.w, height: d.h };
  }
  return {
    ...updatedStyles,
    minWidth: updatedStyles.width,
    minHeight: updatedStyles.height,
  };
};

export const getModulesWithRouter = (modules) =>
  modules.filter((module) => Boolean(module.path));

export const getDialogSyncPropsFromAppSearchParams = (
  modules: Array<ModuleState>,
  queryParams,
) => {
  if (queryParams.dialogs) {
    const dialogConfig = queryParams.dialogs.split(',');
    return dialogConfig.map((dialogRoute) => {
      dialogRoute = normalizePath(dialogRoute);

      const moduleData = getModulesWithRouter(modules).find(({ path }) =>
        matchPath(normalizePath(path), dialogRoute),
      );

      if (!moduleData) {
        return {};
      }

      const moduleRouteData = matchPath(
        normalizePath(moduleData.path),
        dialogRoute,
      );

      return {
        code: moduleData?.code,
        props: moduleRouteData?.params,
        ...moduleRouteData,
      };
    });
  }
  return [];
};

export const updateAppSearchParamsForDialogConfig = (
  dialogs: Record<ModuleTypeValue, ModuleState>,
) => {
  const { hash } = getAppLocationInfo();
  const dialogIdsWithRoute = Object.values(dialogs).filter(
    (dialogData) => dialogData.path && !dialogData.withoutRouter,
  ) as Array<ModuleState & { path: string }>;

  if (dialogIdsWithRoute.length) {
    // @ts-ignore
    const dialogRoutes = dialogIdsWithRoute.map(({ props, path, code }) => {
      try {
        // sync route params with props data
        return generatePath(path, props);
      } catch (e) {
        log.error(e);
        log.error(
          `Please check the params and props are in sync for module ${code}`,
        );
        return '';
      }
    });
    setAppRouteParams(true, hash, `dialogs=${dialogRoutes.toString()}`);
  } else {
    setAppRouteParams(true, hash, '');
  }
};

export const getPlatformPrefixPathFromHash = (
  hash = getAppLocationInfo().hash,
) => {
  if (isWebPlatform()) {
    return '';
  }
  return hash.includes('/webPlatform')
    ? `${hash.split('/webPlatform')?.[0]}/webPlatform`
    : '';
};

export const getRoutesConfig = (
  modulesConfig: Record<string, Module>,
  homePath: string,
  isAuthenticated: boolean,
  loginPath?: string,
) => {
  const hostAppBasePath = getPlatformPrefixPathFromHash();
  const noModuleAddedConfig = {
    code: 'noModuleAdded',
    path: `${hostAppBasePath}/`,
    element: <NoModuleAddedPage />,
  };

  let moduleRoutes: any = Object.values(modulesConfig)
    .filter((moduleConfig) => moduleConfig.element && moduleConfig.path)
    .filter((moduleConfig) => {
      if (loginPath) {
        return isAuthenticated
          ? // remove login module from routes if user is authenticated
            !matchPath(normalizePath(loginPath), String(moduleConfig.path))
          : // remove other modules if user is not authenticated
            matchPath(normalizePath(loginPath), String(moduleConfig.path));
      }
      return true;
    });

  const rootModuleConfig = {
    code: 'root',
    path: `${hostAppBasePath}/`,
    element: (() => {
      if (loginPath && !isAuthenticated) {
        return <Navigate to={loginPath} />;
      }
      return <Navigate to={homePath} />;
    })(),
  };

  const fallbackModuleConfig = {
    code: 'fallback',
    path: `${hostAppBasePath}*`,
    element:
      loginPath && !isAuthenticated ? (
        <Navigate to={loginPath} />
      ) : (
        <NotFoundPage />
      ),
  };

  let hostAppfallbackModuleConfig = {};

  // Handle cases where HostApp navigates and platform is still not unmounted
  // in that case platform router also listen and show page -> Page Not Found.
  // so if we dont have webPlatform prefix (which is mandatory for vymoweb and selfserve hostapp) we would show Loader
  if (isLmsWeb() || isSelfServe())
    hostAppfallbackModuleConfig = {
      code: 'fallback',
      path: `*`,
      element: <Loader fullPage />,
    };

  moduleRoutes =
    moduleRoutes.length > 0
      ? [
          ...moduleRoutes,
          rootModuleConfig,
          fallbackModuleConfig,
          hostAppfallbackModuleConfig,
        ]
      : [noModuleAddedConfig];

  return moduleRoutes;
};

export const runHostAppConfig = (hostAppConfig: HostAppConfig = {}) => {
  getModuleProps()?.showSideHamBurgerMenu?.(
    !hostAppConfig.hideSideHamBurgerMenu,
  );
};
