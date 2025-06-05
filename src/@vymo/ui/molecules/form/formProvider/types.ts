// eslint-disable-next-line vymo-ui/restrict-import
import { I18nSettings } from 'src/models/portalConfig/types';
import { Config, FormFieldState, InputFieldConfig } from '../types';

export type FormValid = 'not_checked' | 'valid' | 'not_valid' | 'in_progress';
export type FormSliceState = {
  loadingApiCount: number;
  formData: {
    fields: Record<string, FormFieldState>;
    lastUpdated?: string | null;
  };
  referralData: Record<string, Object>;
  config: Config;
  initialConfig: Config;
  isDebug: boolean;
  debugMessages: any;
  validity: { form: FormValid; fields: Record<string, 'valid' | 'not_valid'> };
};

export type ClientConfig = {
  i18n_config?: any;
  i18nSettings?: I18nSettings;
};

export type AppendFieldsAtCodeProps = {
  code: string;
  config: Array<InputFieldConfig>;
  actionType?: 'updateAtCode' | undefined;
  childrenDisplayType?: InputFieldConfig['childrenDisplayType'];
};

export type FormContextProps = FormSliceState & {
  setReferralData: (payload: { fieldCode: string; data: Object }) => void;
  setFormConfig: (payload: Config) => void;
  updateFieldState: (payload: FormFieldState) => void;
  appendFieldsAtCode: (payload: AppendFieldsAtCodeProps) => void;
  setIsLoading: (payload: boolean) => void;
  formValue: Record<string, FormFieldState>;
  groupedConfig: Config;
  loading: boolean;
  deleteFieldsAtCode: (payload: { code: string }) => void;
  getFieldsPayloadData: (
    fieldsConfig: FormSliceState['config']['data'],
  ) => void;
  isDebug: boolean;
  clientConfig: ClientConfig;
  formValid: FormValid;
  valueProp: Record<string, FormFieldState>;
  setFormValidation: (arg0: {
    formValidity: FormValid;
    field?: { code: string; validity: 'valid' | 'not_valid' };
  }) => void;
  setDebugMessage: (payload: { messageKey: string; data: any }) => void;
};

export type GetUpdateDocInputValueParam = {
  bucket: string;
  responseArray: any;
  beforeSaveHookConfig: any;
};

export type DocumentInputItem = {
  bucket: string;
  filename: string;
  size: number;
  mime: string;
  label: string;
  path: string;
};
