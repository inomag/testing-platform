import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface RecruitmentMetaState {
  userIdValidatedFlag: boolean;
  isAssistedOnboarding: boolean;
}
const initialState: RecruitmentMetaState = {
  userIdValidatedFlag: false,
  isAssistedOnboarding: false,
};

export const recruitmentMetaSlice = createSlice({
  name: 'recruitmentMeta',
  initialState,
  reducers: {
    setUserIdValidatedFlag(state, action: PayloadAction<boolean>) {
      state.userIdValidatedFlag = action.payload;
    },
    setIsAssistedOnboarding(state, action: PayloadAction<boolean>) {
      state.isAssistedOnboarding = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUserIdValidatedFlag, setIsAssistedOnboarding, resetState } =
  recruitmentMetaSlice.actions;

const reducer = { recruitmentMeta: recruitmentMetaSlice.reducer };

export default reducer;
