import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import { getCurrentStepComponent } from '../selectors';

export const getMilestones = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.milestones?.checklist;

export const getCurrentMilestone = createSelector(
  [getMilestones],
  (milestones) =>
    milestones?.find((milestone) => milestone.status === 'enabled'),
);
