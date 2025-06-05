import { createSelector } from '@reduxjs/toolkit';
import { getUserAuthenticated } from 'src/models/auth/selectors';
import { RootState } from 'src/store';
import { getCurrentStepComponent } from '../selectors';

export const getFormInputs = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.form?.inputs || [];

export const getFormViewMode = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.form?.viewMode || false;

export const getFormValues = (state: RootState, isDialog) =>
  getCurrentStepComponent(state, isDialog)?.form?.inputs_map || {};

export const getFormGroupingConfig = createSelector(
  [getCurrentStepComponent, getUserAuthenticated],
  (currentStep, userAuthenticated) => {
    const groups = currentStep?.form?.fieldGroupConfig ?? [];
    if (userAuthenticated && groups.length === 0) {
      return 'card';
    }
    return groups;
  },
);
