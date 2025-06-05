import { RootState } from 'src/store';

export const getIsLoading = (state: RootState, category) =>
  state?.userProfile?.status[category]?.loading;

export const getError = (state: RootState, category) =>
  state?.userProfile?.status[category]?.error;

export const getCategoryData = (state: RootState, category) =>
  state?.userProfile?.data[category];
