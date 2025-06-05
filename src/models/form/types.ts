export type FormFieldLegacy = {
  value: string | number;
  touched?: boolean;
  valid: boolean;
  error: string | string[] | null;
  lastUpdated?: string;
  required?: boolean;
  label?: string;
};

export type FormState = {
  fields: {
    [code: string]: FormFieldLegacy;
  };
  lastUpdated: string;
};

export type GlobalFormsState =
  | {
      [formKey: string]: FormState;
    }
  | {};
