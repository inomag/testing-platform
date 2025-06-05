import { createAsyncThunk } from '@reduxjs/toolkit';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import axios from 'src/workspace/axios';
import { getClientConfigData } from 'src/workspace/utils';
import { processCardsRequest } from './queries';
import { setCardData, setCardError, setLoading } from './slice';
import { CardRequestInfo, User360Config } from './types';

export const fetchHeaderDetails = createAsyncThunk(
  'userHeader',
  async ({ userCode }: { userCode: string }, { dispatch }) => {
    try {
      const userHeaderApi = `/users/profile/${userCode}`;
      dispatch(setLoading({ cardCode: 'header' }));
      const response: any = await axios.get(userHeaderApi);
      dispatch(setCardData({ cardCode: 'header', data: response.data }));
    } catch (error: any) {
      dispatch(
        setCardError({
          cardCode: 'header',
          error: locale(Keys.ERROR_FETCHING_HEADER_DETAILS),
        }),
      );
    }
  },
);

export const fetchUserTab = createAsyncThunk(
  'userCard',
  async ({ type, body, api, cardCode }: CardRequestInfo, { dispatch }) => {
    try {
      dispatch(setLoading({ cardCode }));
      let response: any;
      if (type === 'get') {
        response = await axios.get(api);
      } else {
        response = await axios.post(api, body);
      }

      dispatch(setCardData({ cardCode, data: response.data }));
    } catch (error: any) {
      dispatch(
        setCardError({
          cardCode,
          error: locale(Keys.ERROR_FETCHING_CARD_DETAILS, { cardCode }),
        }),
      );
    }
  },
);

const onActivate = ({ dispatch, props }) => {
  const config = getClientConfigData();
  const {
    user_360_configs: user360Config,
    user,
  }: { user: any; user_360_configs: User360Config } = config;
  const { userCode }: { userCode: string } = props;
  if (userCode) {
    dispatch(
      fetchHeaderDetails({
        userCode,
      }),
    );
  }

  const tabs = [...(user360Config?.tabs || [])];
  if (user?.isAdmin || user?.code === 'SU') {
    tabs.push({
      code: 'history',
      name: locale(Keys.HISTORY),
      cards: [
        {
          code: 'audit_history',
          name: locale(Keys.AUDIT_HISTORY),
          card_type: 'audit_history',
        },
      ],
    });
  }

  if (Array.isArray(tabs)) {
    const cardsRequest: Array<CardRequestInfo> = processCardsRequest(
      tabs,
      userCode,
    );
    cardsRequest.forEach((request) => dispatch(fetchUserTab(request)));
  }
};

const onDeactivate = () => {};

export default { onActivate, onDeactivate };
