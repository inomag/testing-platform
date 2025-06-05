import { RootState } from 'src/store';

export const getUIBuilder = (state: RootState) => state.uiBuilder;

export const getProjectData = (state: RootState) =>
  getUIBuilder(state)?.project.selfserve;

export const getProjectConfig = (state: RootState) =>
  getProjectData(state).config;

export const getTemplateConfig = (state: RootState) =>
  getProjectData(state)?.templateConfig ?? {};

export const getPublishData = (state: RootState) =>
  getProjectData(state)?.publish;

export const getErrorMessage = (state: RootState) => getUIBuilder(state)?.error;

export const getNotfications = (state: RootState) =>
  getUIBuilder(state)?.notifications;

export const getAppTemplateCode = (state: RootState) =>
  getUIBuilder(state)?.appProjectName;
