import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormFieldLegacy, FormState, GlobalFormsState } from './types';

export const initialState: GlobalFormsState = {};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    initializeForm(
      state,
      action: PayloadAction<{
        formKey: string;
      }>,
    ) {
      if (!state[action.payload.formKey]) {
        const formState: FormState = {
          fields: {},
          lastUpdated: new Date().toISOString(),
        };
        state[action.payload.formKey] = formState;
      }
    },
    deleteForm(
      state,
      action: PayloadAction<{
        formKey: string;
      }>,
    ) {
      if (state[action.payload.formKey]) {
        delete state[action.payload.formKey];
      }
    },
    updateField(
      state,
      action: PayloadAction<{
        formKey: string;
        code: string;
        field: FormFieldLegacy;
      }>,
    ) {
      const currentTime = new Date().toISOString();
      state[action.payload.formKey].fields[action.payload.code] =
        action.payload.field;
      state[action.payload.formKey].fields[action.payload.code].lastUpdated =
        currentTime;
      state[action.payload.formKey].lastUpdated = currentTime;
    },
  },
});

export const { initializeForm, deleteForm, updateField } = formSlice.actions;

const reducer = { form: formSlice.reducer };

export default reducer;
