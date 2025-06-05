import { ReactNode } from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import { FormFieldLegacy } from 'src/models/form/types';
import { FormulaValidation, Validation } from './formItem/types';

export enum FormVersion {
  web = 'web',
}

export type Value = Record<string, string | number | boolean>;

export type BeforeSaveHookConfig = {
  multimedia: {
    uploadUrl?: string;
    isMultimediaBeforeSaveHookDisabled?: boolean;
    valueFormat?: 'url' | 'jsonString';
  };
};

export type FieldItemConfig = {
  showDisabledIcon?: boolean;
};

export type GroupingConfig = {
  collapsibleClasses?: string;
};

export type Config = {
  customPayload?: {
    oifFieldVerifyVoPayload: {
      entity?: string | null;
      first_update_type?: string | null;
      vo?: string | null;
    };
  };
  version: FormVersion;
  data: Array<InputFieldConfig>;
  grouping:
    | 'card'
    | Array<{
        fields: Array<string>;
        code: string;
        name: string;
        message?: {
          variant:
            | 'default'
            | 'success'
            | 'error'
            | 'warning'
            | 'info'
            | undefined;
          text: string;
        };
        status?: {
          variant: 'default' | 'success' | 'error' | 'warning' | null;
          text: string;
        };
      }>;
  beforeSaveHookConfig?: BeforeSaveHookConfig;
  fieldItemConfig?: FieldItemConfig;
  groupConfig?: GroupingConfig;
  viewMode?: boolean;
};

type FormStore = {
  path: {
    session: string;
    vo: string;
  };
  state: any;
};

export type ContextProps = {
  data?: {
    session?: any;
    vo?: any;
  };
  store?: FormStore;
};

export type ChildrenDisplayType = 'nested' | 'flatten';

export type InputFieldConfig = {
  sifg_options?: {
    selection?: {
      type?: string;
    };
  };
  type: string;
  code: string;
  hint: string;
  required?: boolean;
  read_only?: boolean;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  retainFormContext?: boolean;
  hideFormValue?: boolean;
  label?: string;
  childrenDisplayType?: ChildrenDisplayType;
  children?: InputFieldConfig[];
  value?: any;
  default_value?: any;
  validations?: Validation[] | FormulaValidation[];
  oifOptions?: { type?: string; url?: string; params?: [] } | null;
  group_title?: string;
  configMapOptions?: Option[] | null;
  duration?: number[];
  codeNameSpinnerOptions?: Option[];
  multiMediaOptions?: Object;
  contextFilters?: any;
  options?: Option[];
  masked?: boolean;
};

export type FormProps = {
  name: string;
  onChange: (formFields: Record<string, FormFieldState>) => void;
  id?: string;
  className?: string;
  children?: ReactNode;
  config?: Config;
  value?: Record<string, { value: FormFieldState['value']; code?: string }>;
  formulaContext?: ContextProps;
  showDisabledIcon?: boolean;
  span?: string | 'auto';
};

export type FormLegacyProps = {
  name: string;
  onChange: (formFields: Record<string, FormFieldLegacy>) => void;
  id?: string;
  className?: string;
  children: any;
};

export type FormFieldState = {
  code: string;
  value: any;
  type?: string;
  additionalData?: any;
  event?: React.ChangeEvent<any>;
  isValid: boolean;
  errors: string[];
  touched: boolean;
  lastUpdated?: string;
};

export type Option = {
  code: string;
  value: string;
};

export type FieldValue = {
  value: any;
  children?: FieldValue[];
  isValid?: boolean;
  errors?: any[];
  touched?: boolean;
  lastUpdated?: string;
};

export type FormattedField = {
  type: string;
  code: string;
  name: string;
  follow_up_validate: boolean;
  errorMessage: string;
  value?: any;
  data?: {
    code: string;
  };
  meta?: {
    elements: string;
    group_title?: string;
  };
  additionalData?: any;
};

export type SifgOptions = {
  selection: {
    type: string;
    code_name_spinner_options: Option[];
  };
};
