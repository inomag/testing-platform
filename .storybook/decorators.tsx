import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { getTheme, toggleTheme } from '../src/designTokens/themes/utils';
import { formSlice } from '../src/models/form/slice';

const store = configureStore({
  reducer: {
    form: formSlice.reducer,
  },
});
export const withRootElement = (Story, context) => {
  useEffect(() => {
    const selectedTheme = context.globals.theme || 'light';
    const currentTheme = getTheme();
    if (selectedTheme !== currentTheme) {
      toggleTheme();
    }
  }, [context.globals?.theme]);
  return (
    <div id="root">
      <Provider store={store}>
        <Story />
      </Provider>
    </div>
  );
};
