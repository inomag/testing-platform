import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PortalConfigPayload, PortalConfigState } from './types';

const initialState: PortalConfigState = {
  initialised: false,
  client: '',
  portalConfig: null,
};
export const portalConfigSlice = createSlice({
  name: 'portalConfig',
  initialState,
  reducers: {
    setPortalConfig: (state, action: PayloadAction<PortalConfigPayload>) => {
      state.initialised = true;
      state.client = action.payload.client;
      state.portalConfig = action.payload.portalConfig;
      window.localStorage.setItem(
        'portalConfig',
        JSON.stringify(action.payload.portalConfig),
      );
    },
  },
});

export const { setPortalConfig } = portalConfigSlice.actions;

const reducer = { portalConfig: portalConfigSlice.reducer };

export default reducer;
