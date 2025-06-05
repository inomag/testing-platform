import type { RootState } from 'src/store';

const getRecruitmentMetaState = (state: RootState) => state.recruitmentMeta;

export const getUserIdValidatedFlag = (state: RootState): boolean =>
  getRecruitmentMetaState(state).userIdValidatedFlag;

export const getIsAssistedOnboarding = (state: RootState): boolean =>
  getRecruitmentMetaState(state).isAssistedOnboarding;
