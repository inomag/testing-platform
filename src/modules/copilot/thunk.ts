/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import axios from 'src/workspace/axios';
import {
  addMessage,
  setClientId,
  setIsLoading,
  setIsTyping,
  setMessages,
  setNewSession,
  setReplies,
  setSampleQuestions,
  setShowMenu,
  setShowToast,
  setSocket,
  setThreadId,
  setToastText,
} from './slice';
import { HistoryPayload, ILead, Message, MESSAGE_TYPE, SENDER } from './types';

const baseUrl =
  process.env.APP_ENV === 'production'
    ? 'https://aci-prod-embedexa.lms.getvymo.com'
    : 'https://embedexa-staging-ws.lms.getvymo.com:8123';

const websocketHost =
  process.env.APP_ENV === 'production'
    ? 'aci-prod-embedexa.lms.getvymo.com'
    : 'embedexa-staging-ws.lms.getvymo.com:8123';

const endpoint = '/chat_history';

export const getHistory = createAsyncThunk(
  'get/history',
  async ({ client_id, thread_id }: HistoryPayload, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      const queryParams = {
        client_id,
        thread_id,
      };
      const apiUrl = new URL(endpoint, baseUrl);
      Object.keys(queryParams).forEach((key) =>
        apiUrl.searchParams.append(key, queryParams[key]),
      );

      const { data: response }: any = await axios.get(apiUrl.toString());
      const history: Array<Message> = response?.chat_history.map(
        (item: {
          leads_data: ILead[];
          tabular_data: [];
          message_type: string;
          sender: string;
          text: string;
        }) => ({
          sender: item?.sender || SENDER.USER,
          text: item?.text || '',
          message_type: item?.message_type || 'TEXT',
          leads_data: item?.leads_data || [],
          tabular_data: item?.tabular_data || [],
        }),
      );
      dispatch(setMessages(history));
      dispatch(setIsLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setIsLoading(false));
      dispatch(setToastText(locale(Keys.FAILED_TO_FETCH_HISTORY)));
      dispatch(setShowToast(true));
    }
  },
);

export const clearHistory = createAsyncThunk(
  'clear/history',
  async ({ client_id, thread_id }: HistoryPayload, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      const queryParams = {
        client_id,
        thread_id,
      };
      const apiUrl = new URL(endpoint, baseUrl);

      Object.keys(queryParams).forEach((key) =>
        apiUrl.searchParams.append(key, queryParams[key]),
      );
      const { data: response }: any = await axios.delete(apiUrl.toString());
      console.log(response);
      dispatch(setMessages([]));
      dispatch(setShowMenu(false));
      dispatch(setIsLoading(false));
      dispatch(setNewSession(true));
      dispatch(setReplies([]));
    } catch (error) {
      console.error(error);
      dispatch(setIsLoading(false));
      dispatch(setToastText(locale(Keys.FAILED_TO_CLEAR_HISTORY_TRY_AGAIN)));
      dispatch(setShowToast(true));
    }
  },
);

export const connectWebSocket = createAsyncThunk(
  'websocket/connect',
  async (_, { dispatch }) => {
    const authToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)auth-token\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    const metaDataQuery = {
      initiated_from: 'home_screen',
      sources: [],
      extras: {
        lead_code: 'lead_code',
      },
      auth_token: String(authToken),
    };

    const metaDataQueryString = encodeURIComponent(
      JSON.stringify(metaDataQuery),
    );

    const newSocket = new WebSocket(
      `wss://${websocketHost}/ws/start_chat?meta_data=${metaDataQueryString}`,
    );

    dispatch(setSocket(newSocket));

    newSocket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      if (receivedMessage.status === 'FAILURE') {
        dispatch(setToastText(locale(Keys.FAILED_TO_GENERATE_RESPONSE)));
        dispatch(setShowToast(true));
        dispatch(setIsTyping(false));
        dispatch(setReplies([]));
      } else if (receivedMessage.status === 'THREAD') {
        dispatch(setThreadId(receivedMessage?.thread_id));
        dispatch(setClientId(receivedMessage?.client_id));
        dispatch(setSampleQuestions(receivedMessage?.sample_questions || []));
      } else {
        let values = [];
        if (receivedMessage.response?.message_type === 'LEADS') {
          values = receivedMessage.response?.leads_data.map(
            (item: { lead_code: string; lead_name: string }) => ({
              lead_code: item?.lead_code,
              lead_name: item?.lead_name || '',
            }),
          );
        }

        const newMessageItem = {
          sender: SENDER.AI,
          text: receivedMessage?.response.message || ' ',
          message_type:
            receivedMessage.response?.message_type || MESSAGE_TYPE.TEXT,
          leads_data: values,
          tabular_data: receivedMessage.response?.tabular_data || [],
        };
        dispatch(setReplies(receivedMessage.response.follow_up_questions));
        dispatch(addMessage(newMessageItem));
      }
      dispatch(setIsTyping(false));
    };

    newSocket.onclose = () => {
      dispatch(setIsLoading(false));
      dispatch(setSocket(null));
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
        dispatch(setSocket(null));
      }
    };
  },
);
