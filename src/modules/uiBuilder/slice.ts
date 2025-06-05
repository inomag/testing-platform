import _ from 'lodash';
import { NotificationProp } from 'src/@vymo/ui/components/notification/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusLifeCycle, UIBuilderState } from './types';

const initialState: UIBuilderState = {
  project: {
    selfserve: {
      code: '',
      name: '',
      project: 'selfserve',
      tile: { icon: '', description: '', name: '' },
      config: {},
      templateConfig: { api: { url: '', payload: {}, configPath: [] }, ui: [] },
      lastSaved: '',
      jira: { id: '', validated: 'not_started', error: '' },
      publish: {
        branch: '',
        pr: '',
        prId: '',
        commitsSync: 0,
        status: 'not_started',
      },
    },
  },
  appProjectName: '',
  notifications: [],
  error: '',
  runner: {
    payload: {},
    valid: false,
    error: {},
    status: 'not_started',
  },
};
export const uiBuilder = createSlice({
  name: 'uiBuilder',
  initialState,
  reducers: {
    setTemplateUIConfig: (state, action: PayloadAction<any>) => {
      state.project.selfserve.templateConfig.ui = action.payload;
      state.project.selfserve.lastSaved = new Date().toLocaleTimeString();
      state.project.selfserve.publish.commitsSync += 1;
    },

    setTemplateApiConfigPath: (state, action: PayloadAction<string[]>) => {
      state.project.selfserve.templateConfig.api.configPath = _.uniq([
        ...state.project.selfserve.templateConfig.api.configPath,
        ...action.payload,
      ]);
    },

    setProjectName: (
      state,
      action: PayloadAction<{ name: string; isNew: boolean }>,
    ) => {
      const { name, isNew } = action.payload;
      state.project.selfserve.name = name;
      if (isNew) {
        state.project.selfserve.code = _.camelCase(name);
        state.appProjectName = _.camelCase(name);
      }
    },

    setProjectLastSaved: (state, action: PayloadAction<string>) => {
      state.project.selfserve.lastSaved = action.payload;
    },

    setProjectJira: (
      state,
      action: PayloadAction<{
        id: string;
        validated: 'not_started' | 'in_progress' | 'completed' | 'error';
        error?: string;
      }>,
    ) => {
      state.project.selfserve.jira = action.payload;
    },
    /** ***********  ✨ Codeium Command ⭐  ************ */
    /**
     * Sets the project configuration.
     *
     * @param {object} config - The new project configuration.
     */
    /** ****  ce74e0a8-1cc3-489a-b807-16d16c9aab9b  ****** */
    setProjectConfig: (state, action: PayloadAction<any>) => {
      state.project.selfserve.config = action.payload;
    },

    setProjectData: (state, action: PayloadAction<any>) => {
      state.project.selfserve = action.payload;
    },

    resetProjectData: (state) => {
      state.project.selfserve = initialState.project.selfserve;
    },

    addNotifications: (state, action: PayloadAction<NotificationProp>) => {
      const notificationIndex = state.notifications.findIndex(
        ({ id }) => id === action.payload.id,
      );
      if (notificationIndex > -1) {
        state.notifications.splice(notificationIndex, 1);
      }
      state.notifications.push(action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setPublishData: (
      state,
      action: PayloadAction<
        Partial<UIBuilderState['project']['selfserve']['publish']>
      >,
    ) => {
      state.project.selfserve.publish = {
        ...state.project.selfserve.publish,
        ...action.payload,
      };
    },
    setRunnerData: (
      state,
      action: PayloadAction<
        Omit<UIBuilderState['runner'], 'status'> & { id: string }
      >,
    ) => {
      state.runner.valid = Boolean(action.payload.valid);
      state.runner.error = {
        ...state.runner.error,
        [action.payload.id]: action.payload.error,
      };
      state.runner.payload = {
        ...state.runner.payload,
        ...action.payload.payload,
      };
    },

    setRunnerApiStatus: (state, action: PayloadAction<StatusLifeCycle>) => {
      state.runner.status = action.payload;
    },
  },
});

export const {
  setTemplateApiConfigPath,
  setTemplateUIConfig,
  setProjectConfig,
  setProjectName,
  setProjectJira,
  setProjectData,
  setPublishData,
  resetProjectData,
  setProjectLastSaved,
  addNotifications,
  clearNotifications,
  setRunnerData,
  setRunnerApiStatus,
} = uiBuilder.actions;

const reducer = { uiBuilder: uiBuilder.reducer };

export default reducer;
