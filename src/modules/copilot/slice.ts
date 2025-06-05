import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CopilotState, Message } from './types';

const initialState: CopilotState = {
  isLoading: true,
  messages: [],
  threadId: window.Cypress ? '1238' : '',
  clientId: window.Cypress ? '1234' : '',
  showMenu: false,
  toastText: '',
  showToast: false,
  newSession: false,
  isTyping: false,
  replies: [],
  sampleQuestions: [],
  socket: null,
  isCopilotOpen: true,
  retry: 0,
};

export const copilotSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsTyping(state, action: PayloadAction<boolean>) {
      state.isTyping = action.payload;
    },
    setSampleQuestions(state, action: PayloadAction<Array<string>>) {
      state.sampleQuestions = action.payload;
    },
    setReplies(state, action: PayloadAction<Array<string>>) {
      state.replies = action.payload;
    },
    setShowMenu(state, action: PayloadAction<boolean>) {
      state.showMenu = action.payload;
    },
    setShowToast(state, action: PayloadAction<boolean>) {
      state.showToast = action.payload;
    },
    setThreadId(state, action: PayloadAction<string>) {
      state.threadId = action.payload;
    },
    setClientId(state, action: PayloadAction<string>) {
      state.clientId = action.payload;
    },
    setToastText(state, action: PayloadAction<string>) {
      state.toastText = action.payload;
    },
    setNewSession(state, action: PayloadAction<boolean>) {
      state.newSession = action.payload;
    },
    setMessages(state, action: PayloadAction<Array<Message>>) {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
    setSocket: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },
    setIsCopilotOpen(state, action: PayloadAction<boolean>) {
      state.isCopilotOpen = action.payload;
    },
    setRetryCount(state, action: PayloadAction<number>) {
      state.retry = action.payload;
    },
  },
});

export const {
  setClientId,
  setThreadId,
  setIsLoading,
  setMessages,
  setShowMenu,
  setShowToast,
  setToastText,
  addMessage,
  setNewSession,
  setIsTyping,
  setReplies,
  setSampleQuestions,
  setSocket,
  setIsCopilotOpen,
  setRetryCount,
} = copilotSlice.actions;

const reducer = { copilot: copilotSlice.reducer };

export default reducer;
