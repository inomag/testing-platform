import { RootState } from 'src/store';

export const getSocket = (state: RootState) => state?.copilot?.socket;

export const getIsLoading = (state: RootState) => state?.copilot?.isLoading;

export const getThreadId = (state: RootState) => state?.copilot?.threadId;

export const getClientId = (state: RootState) => state?.copilot?.clientId;

export const getShowMenu = (state: RootState) => state?.copilot?.showMenu;

export const getShowToast = (state: RootState) => state?.copilot?.showToast;

export const getToastText = (state: RootState) => state?.copilot?.toastText;

export const getMessages = (state: RootState) => state?.copilot?.messages;

export const getNewSession = (state: RootState) => state?.copilot?.newSession;

export const getReplies = (state: RootState) => state?.copilot?.replies;

export const getIsTyping = (state: RootState) => state?.copilot?.isTyping;

export const getSampleQuestions = (state: RootState) =>
  state?.copilot?.sampleQuestions;

export const getIsCopilotOpen = (state: RootState) =>
  state?.copilot?.isCopilotOpen;

export const getRetry = (state: RootState) => state?.copilot?.retry;
