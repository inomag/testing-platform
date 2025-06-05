import { createAsyncThunk } from '@reduxjs/toolkit';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import axios from 'src/workspace/axios';
import { getClientConfigData } from 'src/workspace/utils';
import { setCategoryData, setCategoryError, setLoading } from './slice';

export const fetchProfileHeader = createAsyncThunk(
  'profileHeader',
  async ({ userId }: { userId: string }, { dispatch }) => {
    const category = 'profileHeader';
    try {
      const profileHeaderUrl = `/users/profile/${userId}`;
      dispatch(setLoading({ category }));
      const response: any = await axios.get(profileHeaderUrl);
      if (response.data) {
        dispatch(setCategoryData({ category, data: response.data }));
      } else {
        dispatch(
          setCategoryError({
            category,
            error: locale(Keys.ERROR_FETCHING_HEADER_DATA),
          }),
        );
      }
    } catch (error: any) {
      dispatch(
        setCategoryError({
          category,
          error: error.message || locale(Keys.ERROR_FETCHING_HEADER_DATA),
        }),
      );
    }
  },
);

export const fetchProfileGroup = createAsyncThunk(
  'profileGroup',
  async (
    {
      category,
      customApi,
      params,
    }: { category: string; customApi?: string; params?: any },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading({ category }));
      const profileGroupUrl = customApi || `/users/tabs/profileEntity`;
      const response: any = await axios.get(profileGroupUrl, {
        params: {
          category,
          ...params,
        },
      });
      if (response.data) {
        dispatch(setCategoryData({ category, data: response.data }));
      } else {
        dispatch(
          setCategoryError({
            category,
            error: locale(Keys.ERROR_FETCHING_GROUP_DATA),
          }),
        );
      }
    } catch (error: any) {
      dispatch(
        setCategoryError({
          category,
          error: error.message || locale(Keys.ERROR_FETCHING_HEADER_DATA),
        }),
      );
    }
  },
);

const onActivate = ({ dispatch }) => {
  const config = getClientConfigData();
  const { user = {}, user_profile_config: userProfileConfig } = config;
  const { code } = user;
  if (code) {
    dispatch(
      fetchProfileHeader({
        userId: code,
      }),
    );
  }

  if (userProfileConfig?.groups?.length) {
    userProfileConfig.groups.forEach((group) => {
      (group?.category || []).map((category) =>
        dispatch(
          fetchProfileGroup({
            category: category.code,
            customApi: category.custom_api,
          }),
        ),
      );
    });
  }
};

const onDeactivate = () => {};

export default { onActivate, onDeactivate };
