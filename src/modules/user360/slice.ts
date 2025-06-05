import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type User360State = {
  data: Record<string, any>;
  status: Record<string, { loading: Boolean; error: string }>;
};

const initialState: User360State = {
  data: {},
  status: {},
};

export const user360Slice = createSlice({
  name: 'user360',
  initialState,
  reducers: {
    setCardData(
      state: User360State,
      action: PayloadAction<{ cardCode: string; data: any }>,
    ) {
      state.data[action.payload.cardCode] = action.payload.data;
      state.status[action.payload.cardCode] = { loading: false, error: '' };
    },
    setCardError(
      state: User360State,
      action: PayloadAction<{ cardCode: string; error: any }>,
    ) {
      state.status[action.payload.cardCode] = {
        error: action.payload.error,
        loading: false,
      };
    },
    setLoading(
      state: User360State,
      action: PayloadAction<{ cardCode: string }>,
    ) {
      state.status[action.payload.cardCode] = {
        error: '',
        loading: true,
      };
    },
  },
});

export const { setCardData, setCardError, setLoading } = user360Slice.actions;

const reducer = { user360: user360Slice.reducer };

export default reducer;
