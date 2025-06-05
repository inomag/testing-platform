import { RootState } from 'src/store';

export const getIsLoading = (state: RootState, cardCode) =>
  state?.user360?.status[cardCode]?.loading;

export const getError = (state: RootState, cardCode) =>
  state?.user360?.status[cardCode]?.error;

export const getCardData = (state: RootState, cardCode) =>
  state?.user360?.data[cardCode];
