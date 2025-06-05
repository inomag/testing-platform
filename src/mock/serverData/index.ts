import chatHistory from './chat';
import frontend from './frontend';
import portalApi from './portal';
import user360 from './user360';
import userProfile from './userProfile';

export const serverDataList = [
  ...portalApi,
  ...chatHistory,
  ...userProfile,
  ...user360,
  ...frontend,
];
