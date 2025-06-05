export type CopilotState = {
  isLoading: boolean;
  isTyping: boolean;
  replies: Array<string>;
  sampleQuestions: Array<string>;
  messages: Array<Message>;
  threadId: string;
  clientId: string;
  showMenu: boolean;
  toastText: string;
  showToast: boolean;
  newSession: boolean;
  socket: WebSocket | null;
  isCopilotOpen: boolean;
  retry: number;
};

export type Message = {
  sender: string;
  text: string;
  message_type: string;
  leads_data?: ILead[];
  tabular_data?: string[][];
};

export type ILead = {
  lead_name: string;
  lead_code: string;
};

export const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  TABLE: 'TABLE',
  LEADS: 'LEADS',
};

export const SENDER = {
  AI: 'AI',
  USER: 'USER',
};

export type HistoryPayload = {
  thread_id: string;
  client_id: string;
};
