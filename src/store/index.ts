/* eslint-disable no-restricted-imports */
import { configureStore } from '@reduxjs/toolkit';
import { reducerList as copilotReducer } from 'src/apps/copilot/modulesReducerConfig';
import { reducerList as dashboardReducer } from 'src/apps/frontendBoard/modulesReducerConfig';
import { reducerList as onboardingReducer } from 'src/apps/onboarding/modulesReducerConfig';
import { reducerList as recruitmentReducer } from 'src/apps/recruitment/modulesReducerConfig';
import { reducerList as selfserveReducer } from 'src/apps/selfserve/modulesReducerConfig';
import { reducerList as uiBuilderReducer } from 'src/apps/uiBuilder/modulesReducerConfig';
import { reducerList as vymoWebReducer } from 'src/apps/vymoWeb/modulesReducerConfig';
import formSlice from 'src/models/form/slice';
import sessionSlice from 'src/models/session/slice';
import supersetSlice from 'src/modules/superset/slice';
import workspaceSlice from 'src/workspace/slice';

export const reducerList = {
  ...workspaceSlice,
  ...recruitmentReducer,
  ...vymoWebReducer,
  ...formSlice,
  ...copilotReducer,
  ...sessionSlice,
  ...onboardingReducer,
  ...dashboardReducer,
  ...uiBuilderReducer,
  ...selfserveReducer,
  ...supersetSlice,
};

export const store = configureStore({
  reducer: { ...reducerList },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const { getState } = store;

export const connectPromise = (
  selector,
  { success, error }: { success: (arg0) => {}; error?: (arg0) => {} },
) =>
  new Promise((resolve, reject) => {
    store.subscribe(() => {
      const response = selector(getState());
      if (success(response)) {
        resolve(response);
      }
      if (error?.(response)) {
        reject(response);
      }
    });
  });
