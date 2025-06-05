import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, TestMetric } from './types';

const initialState: DashboardState = {
  branches: {
    webPlatform: [],
    selfserve: [],
    vymoWeb: [],
  },
  release: {
    prod: null,
    preProd: null,
    branches: [],
    nextRelease: null,
  },
  metrics: {
    webPlatform: {
      coverageData: [],
      integrationTest: [],
      e2eTestReport: [],
    },
    selfserve: {
      coverageData: [],
      integrationTest: [],
      e2eTestReport: [],
    },
    vymoWeb: {
      coverageData: [],
      integrationTest: [],
      e2eTestReport: [],
    },
  },
  vmDetails: {},
  message: '',
  figmaReport: '',
};
export const dashboardSlice = createSlice({
  name: 'dashBoardState',
  initialState,
  reducers: {
    setFeatureBranches: (
      state,
      action: PayloadAction<DashboardState['branches']>,
    ) => {
      state.branches = action.payload;
    },

    setReleaseData: (
      state,
      action: PayloadAction<DashboardState['release']>,
    ) => {
      state.release = action.payload;
    },

    setNextReleaseData: (
      state,
      action: PayloadAction<DashboardState['release']['nextRelease']>,
    ) => {
      state.release.nextRelease = action.payload;
    },

    setMetricByProject: (
      state,
      action: PayloadAction<{ metric: TestMetric; project: string }>,
    ) => {
      state.metrics[action.payload.project] = action.payload.metric;
    },
    setVmDetails: (
      state,
      action: PayloadAction<DashboardState['vmDetails']>,
    ) => {
      state.vmDetails = { ...state.vmDetails, ...action.payload };
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setFigmaComparisonReport: (state, action: PayloadAction<string>) => {
      state.figmaReport = action.payload;
    },
  },
});

export const {
  setFeatureBranches,
  setMetricByProject,
  setReleaseData,
  setNextReleaseData,
  setVmDetails,
  setMessage,
  setFigmaComparisonReport,
} = dashboardSlice.actions;

const reducer = { dashboard: dashboardSlice.reducer };

export default reducer;
