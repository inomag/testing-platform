import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type UserProfileState = {
  data: Record<string, any>;
  status: Record<string, { loading: Boolean; error: string }>;
};

const initialState: UserProfileState = {
  data: {},
  status: {},
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setCategoryData(
      state: UserProfileState,
      action: PayloadAction<{ category: string; data: any }>,
    ) {
      state.data[action.payload.category] = action.payload.data;
      state.status[action.payload.category] = { loading: false, error: '' };
    },
    setCategoryError(
      state: UserProfileState,
      action: PayloadAction<{ category: string; error: any }>,
    ) {
      state.status[action.payload.category] = {
        error: action.payload.error,
        loading: false,
      };
    },
    setLoading(
      state: UserProfileState,
      action: PayloadAction<{ category: string }>,
    ) {
      state.status[action.payload.category] = {
        error: '',
        loading: true,
      };
    },
  },
});

export const { setCategoryData, setCategoryError, setLoading } =
  userProfileSlice.actions;

const reducer = { userProfile: userProfileSlice.reducer };

export default reducer;
