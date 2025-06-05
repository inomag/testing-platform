import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';

export const getDashboardState = (state: RootState) => state.dashboard;

export const getFeatureBranchUrls = (state: RootState) =>
  getDashboardState(state).branches;

export const getFeatureBranchUrlsByProject = createSelector(
  [getFeatureBranchUrls, (state, project: string) => project],
  (featureBranches, project) => {
    const featureBranchesByProject = featureBranches[project];
    if (!project || featureBranchesByProject.length === 0) {
      return [];
    }

    return featureBranchesByProject.map((value) => ({
      label: value.folderName,
      value: value.folderName,
      subLabel: new Date(value?.lastModified).toLocaleString().split('GMT')[0],
    }));
  },
);

export const getVmDetails = (state: RootState) =>
  getDashboardState(state).vmDetails;

export const getDashboardMessage = (state: RootState) =>
  getDashboardState(state).message;

export const getReleaseData = (state: RootState) =>
  getDashboardState(state).release;

export const getReleaseBranchUrls = (state: RootState) =>
  getReleaseData(state).branches;

export const getReleaseBranchUrlsByProject = createSelector(
  [getReleaseBranchUrls, (state, project: string) => project],
  (featureBranches, project) => {
    if (!project || featureBranches.length === 0) {
      return [];
    }

    return Object.values(
      featureBranches.reduce((acc, value) => {
        const releaseBranch = value.name;
        const relaseVersion = releaseBranch.split('/')[1];
        const baseReleaseVersion =
          relaseVersion.match(/v(\d{1,3}\.\d{1,3})/)?.[0] ?? '';

        if (baseReleaseVersion in acc) {
          acc[baseReleaseVersion] = {
            ...acc[baseReleaseVersion],
            children: [
              ...acc[baseReleaseVersion].children,
              {
                branch: releaseBranch,
                lastModified: new Date(value?.lastModified)
                  .toLocaleString()
                  .split('GMT')[0],
              },
            ],
          };
        } else {
          acc[baseReleaseVersion] = {
            branch: releaseBranch,
            lastModified: new Date(value?.lastModified)
              .toLocaleString()
              .split('GMT')[0],
            children: [],
          };
        }

        return acc;
      }, {}) as Array<{
        branch: string;
        lastModified: string;
        children: Array<{ branch: string; lastModified: string }>;
      }>,
    );
  },
);

export const getMetricsByProject = createSelector(
  [
    (state: RootState) => getDashboardState(state).metrics,
    (state, project: string) => project,
  ],
  (metrics, project) => metrics[project],
);

export const getFigmaReport = (state: RootState) =>
  getDashboardState(state).figmaReport;
