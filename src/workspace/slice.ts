import _ from 'lodash';
import { generatePath } from 'react-router-dom';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Module, ModuleTypeValue } from 'src/modules/types';
import {
  getDialogSyncPropsFromAppSearchParams,
  updateAppSearchParamsForDialogConfig,
} from './queries';
import { ModuleState, WorkspaceState } from './types';
import { getAppSearchParams } from './utils';

// Define the initial state using that type
const initialState: WorkspaceState = {
  modulesList: [],
  dialogs: {} as Record<ModuleTypeValue, ModuleState>,
  redirectPath: '',
  fullPage: false,
  routeModule: null,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    loadModules: (
      state,
      action: PayloadAction<Record<ModuleTypeValue, Module>>,
    ) => {
      let modules = Object.entries(action.payload).map(
        ([, { code, path }]) => ({
          code: code as ModuleTypeValue,
          path,
        }),
      );

      modules = modules.length > 0 ? (modules as any) : [{ code: 'default' }];

      state.modulesList = modules;
    },
    renderDialogsFromAppSearchParams: (state) => {
      const dialogsConfig = getDialogSyncPropsFromAppSearchParams(
        state.modulesList,
        getAppSearchParams(),
      );

      // retain dialogs that are opened without route
      state.dialogs = _.reduce(
        state.dialogs,
        (acc, dialog) => {
          // @ts-ignore
          if (!dialog.pathname) {
            acc[dialog.code] = dialog;
          }
          return acc;
        },
        {},
      ) as Record<ModuleTypeValue, ModuleState>;

      dialogsConfig.forEach(({ code, ...moduleData }) => {
        state.dialogs[code] = {
          code,
          ...moduleData,
        };
      });
    },

    renderModule: (
      state,
      action: PayloadAction<{
        id: ModuleTypeValue;
        props: {};
        fullPage?: boolean;
      }>,
    ) => {
      const { id, props, fullPage } = action.payload;
      const mouduleConifg = state.modulesList.find(
        (module) => module.code === id,
      );

      if (!mouduleConifg) {
        return;
      }

      mouduleConifg.props = props;
      state.redirectPath = String(
        // sync route params with props data
        generatePath(String(mouduleConifg.path), props),
      );
      state.fullPage = Boolean(fullPage ?? mouduleConifg.fullPage);
    },

    renderDialog: (
      state,
      action: PayloadAction<{
        id: ModuleTypeValue;
        props: {};
        withoutRouter?: boolean;
        fullPage?: boolean;
      }>,
    ) => {
      const dialogData = action.payload;

      const { id, withoutRouter } = dialogData;

      const mouduleConfig = state.modulesList.find(
        (module) => module.code === id,
      );

      // TOOD: iF ap env is not / preprod / prod then throw error that no module found are you sure you have imported it

      if (!mouduleConfig) {
        return;
      }

      const updatedDialogsConfig = {
        ...state.dialogs,
        [id]: {
          ...mouduleConfig,
          ...dialogData,
        },
      };

      state.dialogs = updatedDialogsConfig;
      if (!withoutRouter) {
        // change the app search params first
        updateAppSearchParamsForDialogConfig(updatedDialogsConfig);
      }
    },

    removeDialog: (
      state,
      action: PayloadAction<{
        id: ModuleTypeValue;
      }>,
    ) => {
      const { id } = action.payload;

      const updatedDialogsConifg = {
        ...state.dialogs,
      };
      delete updatedDialogsConifg[id];

      if (state.dialogs[id]) {
        // render directly without router
        state.dialogs = updatedDialogsConifg;
        if (!state.dialogs[id]?.withoutRouter) {
          // change the app search params
          updateAppSearchParamsForDialogConfig(updatedDialogsConifg);
        }
      }
    },

    unSetRedirectPath: (state) => {
      state.redirectPath = '';
    },
    setFullPage: (state, action: PayloadAction<boolean>) => {
      state.fullPage = action.payload;
    },
    setRouteModule: (state, action: PayloadAction<Omit<Module, 'element'>>) => {
      state.routeModule = action.payload;
    },
    setRouteModuleBreadCrumbParams: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      if (state.routeModule) {
        state.routeModule = {
          ...state.routeModule,
          breadCrumbExtraParams: action.payload,
        };
      }
    },
  },
});

export const {
  loadModules,
  renderDialogsFromAppSearchParams,
  renderModule,
  unSetRedirectPath,
  setFullPage,
  setRouteModule,
  renderDialog,
  removeDialog,
  setRouteModuleBreadCrumbParams,
} = workspaceSlice.actions;

const reducer = { workspace: workspaceSlice.reducer };

export default reducer;
