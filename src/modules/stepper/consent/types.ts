export type ConsentCheckbox = {
  label: string;
  required: boolean;
  selected?: boolean;
};

export type Consent = {
  required: boolean;
  readOnlyText: null;
  label: string;
  links: null;
  document: string;
  selected: boolean;
  version: string;
  disabled: boolean;
};

export type ConsentProps = {
  consents: Consent[];
};
