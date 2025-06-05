import _ from 'lodash';
import { generatePath, matchPath } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';
import { getPlatformPrefixPathFromHash, normalizePath } from './queries';
import {
  getAppLocationInfo,
  getHostAppLocation,
  isLmsWeb,
  setAppRouteParams,
} from './utils';

export const getWorkspaceState = (state: RootState) => state?.workspace;

export const getWorkspaceModules = (state: RootState) =>
  getWorkspaceState(state)?.modulesList ?? [];

export const getWorkspaceRedirectPath = (state: RootState) =>
  getWorkspaceState(state).redirectPath;

export const getWorkspaceFullPage = (state: RootState) =>
  getWorkspaceState(state)?.fullPage;

export const getWorkspaceDialogs = (state: RootState) =>
  getWorkspaceState(state)?.dialogs;

export const getWorkspaceRouteModule = (state: RootState) =>
  getWorkspaceState(state)?.routeModule;

// export const getWorkspaceRouteModuleBreadcrumbs = (state: RootState) =>
//   getWorkspaceRouteModule(state)?.breadCrumbs;

export const getWorkspaceRouteModuleBreadcrumbs = createSelector(
  [getWorkspaceRouteModule],
  (currentModule) => {
    if (currentModule) {
      const { breadCrumbs = [], path: currentModulePath } = currentModule;
      if (_.isEmpty(breadCrumbs) || !currentModulePath) return [];

      const { hash } = getAppLocationInfo();
      const { params = {} } = matchPath(currentModulePath, hash) ?? {};
      const { pathParams: hostAppPathParams = {} } = getHostAppLocation() ?? {};

      const updatedParams = {
        ...params,
        ...hostAppPathParams,
        ...(currentModule.breadCrumbExtraParams ?? {}),
      };

      return breadCrumbs
        .map(({ breadcrumbName, path, legacy }) => {
          if (!legacy && isLmsWeb()) {
            path = `${getPlatformPrefixPathFromHash()}${normalizePath(path)}`;
          }

          try {
            if (!_.isEmpty(params)) {
              path = generatePath(String(path), updatedParams);
              breadcrumbName = updatedParams[breadcrumbName] || breadcrumbName;
            }

            return {
              breadcrumbName,
              path,
              legacy,
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);
    }
    return [];
  },
);

export const syncAppRouteHash = createSelector(
  [
    getWorkspaceRouteModule,
    (state, params: Object, replace = true) => ({ params, replace }),
  ],
  (currentModule, { params, replace }) => {
    if (currentModule) {
      let routeHash = currentModule?.path;
      Object.entries(params).forEach(([key, value]) => {
        if (routeHash) {
          routeHash = routeHash.replace(`:${key}`, value);
        }
      });

      if (routeHash) {
        setAppRouteParams(replace, routeHash);
      }
    }
  },
);

export const getPropsForCurrentModuleByUrl = createSelector(
  [getWorkspaceRouteModule, (state, url) => url],
  (currentModule, url) => {
    if (currentModule) {
      const { path: currentModulePath } = currentModule;
      const modulePropsData = matchPath(
        normalizePath(currentModulePath),
        getAppLocationInfo(url).hash,
      );
      return modulePropsData?.params ?? {};
    }
    return {};
  },
);
