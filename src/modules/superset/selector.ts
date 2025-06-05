import { RootState } from 'src/store';

export const getGuestToken = (state: RootState) => state?.superset?.guestToken;
export const getIsLoading = (state: RootState) => state?.superset?.isLoading;
export const getError = (state: RootState) => state?.superset?.error;
