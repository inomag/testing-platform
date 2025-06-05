import { RootState } from 'src/store';
import { FormState } from './types';

export const getGlobalForms = (state: RootState) => state?.form;

export const getFormStateByKey = (
  state: RootState,
  key: string,
): FormState | null => {
  const forms = getGlobalForms(state);
  return forms[key];
};

export const getFormFields = (state: RootState, key) => {
  const form = getFormStateByKey(state, key);
  return form?.fields;
};
