/* eslint-disable no-fallthrough */

/* eslint-disable complexity */
import { isEqual } from 'lodash';
import { Config, FormFieldState, InputFieldConfig } from '../types';
import {
  getFieldsSyncWithUpdatedConfigData,
  getFlattenConfig,
  getUpdatedConfigAndFieldsAppendAtCode,
  getUpdatedConfigAndFieldsDeleteAtCode,
} from './queries';
import { FormSliceState, FormValid } from './types';

type FormAction =
  | { type: 'UPDATE_FIELD'; payload: FormFieldState }
  | { type: 'SET_REFERRAL_DATA'; payload: { fieldCode: string; data: Object } }
  | {
      type: 'APPEND_FIELDS_AT_CODE';
      payload: {
        config: InputFieldConfig[];
        code: string;
        actionType?: string;
        childrenDisplayType?: InputFieldConfig['childrenDisplayType'];
      };
    }
  | {
      type: 'DELETE_FIELDS_AT_GROUP';
      payload: { code: string };
    }
  | { type: 'RESET_FORM'; payload: Record<string, FormFieldState> }
  | { type: 'UPDATE_EXTERNAL_VALUES'; payload: Record<string, FormFieldState> }
  | { type: 'SET_CONFIG'; payload: Config }
  | { type: 'LOADING'; payload: boolean }
  | {
      type: 'SET_FORM_VALIDATION';
      payload: {
        formValidity: FormValid;
        field?: { code: string; validity: 'valid' | 'not_valid' };
      };
    }
  | {
      type: 'SET_DEBUG_MESSAGE';
      payload: {
        messageKey: string;
        data: any;
      };
    };

const initialFormState = ({
  initialConfig,
  valueProp,
  isDebug,
}: {
  initialConfig: Config;
  valueProp: Record<string, FormFieldState>;
  isDebug: boolean;
}): FormSliceState => ({
  formData: {
    fields: getFieldsSyncWithUpdatedConfigData(valueProp, initialConfig.data),
    lastUpdated: null,
  },
  config: initialConfig,
  initialConfig,
  loadingApiCount: 0,
  referralData: {},
  isDebug,
  debugMessages: {},
  validity: { form: 'not_checked', fields: {} },
});

// eslint-disable-next-line max-lines-per-function
const formReducer = (
  state: FormSliceState,
  action: FormAction,
): FormSliceState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loadingApiCount: action.payload
          ? state.loadingApiCount + 1
          : state.loadingApiCount - 1,
      };
    case 'UPDATE_FIELD': {
      const { code, value, additionalData, isValid, errors, touched, type } =
        action.payload;
      const currentTime = new Date().toISOString();
      return {
        ...state,
        formData: {
          fields: {
            ...state.formData.fields,
            [code]: {
              code,
              value,
              type,
              additionalData,
              isValid,
              errors,
              touched,
              lastUpdated: currentTime,
            },
          },
          lastUpdated: currentTime,
        },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'UPDATE_FIELD', payload: action.payload },
          ],
        },
      };
    }

    case 'SET_REFERRAL_DATA': {
      const { fieldCode, data } = action.payload;
      return {
        ...state,
        referralData: {
          ...state.referralData,
          [fieldCode]: data,
        },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'SET_REFERRAL_DATA', payload: action.payload },
          ],
        },
      };
    }

    case 'SET_DEBUG_MESSAGE': {
      const { messageKey, data } = action.payload;
      if (
        !isEqual(
          JSON.stringify(data),
          JSON.stringify(state.debugMessages[messageKey] || {}),
        )
      ) {
        return {
          ...state,
          debugMessages: {
            ...state.debugMessages,
            [messageKey]: data,
          },
        };
      }
      return state;
    }

    case 'APPEND_FIELDS_AT_CODE': {
      const {
        config,
        code,
        actionType = 'add',
        childrenDisplayType = 'flatten',
      } = action.payload;
      const isFormInitialized = Boolean(state.formData.lastUpdated);
      const currentTime = isFormInitialized ? new Date().toISOString() : null;
      const { updatedConfigData, updatedFieldsData } =
        getUpdatedConfigAndFieldsAppendAtCode(
          state.config.data,
          { ...state.formData.fields },
          config,
          code,
          isFormInitialized,
          actionType,
          childrenDisplayType,
          0,
        );
      return {
        ...state,
        config: { ...state.config, data: updatedConfigData },
        formData: { fields: updatedFieldsData, lastUpdated: currentTime },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'APPEND_FIELDS_AT_CODE', payload: action.payload },
          ],
        },
      };
    }

    case 'DELETE_FIELDS_AT_GROUP': {
      const isFormInitialized = Boolean(state.formData.lastUpdated);
      const currentTime = isFormInitialized ? new Date().toISOString() : null;
      const { updatedConfigData, updatedFieldsData } =
        getUpdatedConfigAndFieldsDeleteAtCode(
          state.config.data,
          { ...state.formData.fields },
          action.payload.code,
          isFormInitialized,
        );
      return {
        ...state,
        config: {
          ...state.config,
          data: updatedConfigData,
        },
        formData: {
          fields: updatedFieldsData,
          lastUpdated: currentTime,
        },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'DELETE_FIELDS_AT_GROUP', payload: action.payload },
          ],
        },
      };
    }

    case 'RESET_FORM': {
      return {
        ...state,
        formData: {
          fields: getFieldsSyncWithUpdatedConfigData(
            action.payload,
            state.config.data,
          ),
          lastUpdated: new Date().toISOString(),
        },
        validity: { form: 'not_checked', fields: {} },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'RESET_FORM', payload: action.payload },
          ],
        },
      };
    }
    case 'SET_CONFIG': {
      return {
        ...state,
        config: action.payload,
        formData: {
          fields: getFieldsSyncWithUpdatedConfigData(
            state.formData.fields,
            action.payload.data,
          ),
          lastUpdated: new Date().toISOString(),
        },
        validity: { form: 'not_checked', fields: {} },
        debugMessages: {
          ...state.debugMessages,
          actionSequence: [
            ...(state.debugMessages.actionSequence ?? []),
            { action: 'SET_CONFIG', payload: action.payload },
          ],
        },
      };
    }
    case 'SET_FORM_VALIDATION': {
      const { field } = action.payload;
      let { formValidity } = action.payload;
      if (formValidity && !field) {
        return {
          ...state,
          validity: {
            fields: {},
            form: formValidity,
          },
        };
      }
      if (field) {
        const { code, validity } = field;
        formValidity = state.validity.form;
        const appendedFields = { ...state.validity.fields, [code]: validity };
        if (
          Object.values(appendedFields).length ===
          getFlattenConfig(state.config.data, []).length
        ) {
          formValidity = Object.values(appendedFields).includes('not_valid')
            ? 'not_valid'
            : 'valid';
        }
        return {
          ...state,
          validity: {
            form: formValidity,
            fields: appendedFields,
          },
          debugMessages: {
            ...state.debugMessages,
            actionSequence: [
              ...(state.debugMessages.actionSequence ?? []),
              { action: 'SET_FORM_VALIDATION', payload: action.payload },
            ],
          },
        };
      }
    }

    default:
      return state;
  }
};

const updateFieldState = (payload: FormFieldState): FormAction => ({
  type: 'UPDATE_FIELD',
  payload,
});

const setReferralData = (payload: {
  fieldCode: string;
  data: Object;
}): FormAction => ({
  type: 'SET_REFERRAL_DATA',
  payload,
});

const setDebugMessage = (payload: {
  messageKey: string;
  data: object;
}): FormAction => ({
  type: 'SET_DEBUG_MESSAGE',
  payload,
});

const appendFieldsAtCode = (payload: {
  code: string;
  config: InputFieldConfig[];
  actionType?: string;
}): FormAction => ({ type: 'APPEND_FIELDS_AT_CODE', payload });

const resetForm = (payload: Record<string, FormFieldState>): FormAction => ({
  type: 'RESET_FORM',
  payload,
});

const setFormConfig = (payload: Config): FormAction => ({
  type: 'SET_CONFIG',
  payload,
});

const deleteFieldsAtCode = (payload: { code: string }): FormAction => ({
  type: 'DELETE_FIELDS_AT_GROUP',
  payload,
});
const setIsLoading = (payload: boolean): FormAction => ({
  type: 'LOADING',
  payload,
});

const setFormValidation = (payload: {
  formValidity: FormValid;
  field?: { code: string; validity: 'valid' | 'not_valid' };
}): FormAction => ({
  type: 'SET_FORM_VALIDATION',
  payload,
});

export {
  formReducer,
  initialFormState,
  updateFieldState,
  resetForm,
  setFormConfig,
  appendFieldsAtCode,
  deleteFieldsAtCode,
  setIsLoading,
  setFormValidation,
  setReferralData,
  setDebugMessage,
};
