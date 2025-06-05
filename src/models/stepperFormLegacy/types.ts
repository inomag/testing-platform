// eslint-disable-next-line vymo-ui/restrict-import
import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';
// eslint-disable-next-line vymo-ui/restrict-import
import { Document } from 'src/@vymo/ui/molecules/documentUploader/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { API_STATUS } from 'src/modules/stepperFormLegacy/constants';

export interface JourneyItem {
  name: string;
  code: string;
  description: string;
  order: number;
  status: string;
}

export type Journey = JourneyItem[];

export interface PageMeta {
  journey: Journey;
  current_step: string;
  sections: Section[];
  inputsMap?: InputsMap;
}

export interface MeetingMeta {
  start_time?: string;
  end_time?: string;
  date_format?: string;
  info?: { label: string; value: string }[];
  meeting?: {
    online: {
      link: string;
      label: string;
    };
    offline: {
      link: string;
      label: string;
      address: string;
    };
  };
}

export interface DocumentSectionMeta {
  downloads?: [
    {
      link: string;
      label: string;
    },
  ];
}
export interface ESignMeta {
  service?: 'docusign';
  action?: {
    label: string;
  };
  templateId?: string;
  inputObj?: Input;
  scriptLink?: string;
  finishText?: string;
}

export interface SectionMeta
  extends MeetingMeta,
    DocumentSectionMeta,
    ESignMeta {
  inputs: Input[];
  title?: string;
  description?: string;
  groups?: string[];
  action?: {
    type: string;
    label: string;
    link: string;
  };
  status?: string;
  data?: any;
  links?: any;
}

interface SectionComponent {
  type: string;
  meta: SectionMeta;
}
export type ActionType = 'validate' | 'submit' | 'create';
export interface Section {
  title: string;
  description?: string;
  code: string;
  component: SectionComponent;
  action?: ActionType;
}

export interface InputsMap {
  [key: string]: string | number | boolean;
}

export type DropdownValue = {
  label: string;
  value: string;
};

export type Value =
  | DropdownValue
  | DropdownValue[]
  | string
  | number
  | string[]
  | Document[];

export interface Input {
  code: string;
  name: string;
  type: string;
  options?: never[] | [{ label: string; value: string; disabled?: boolean }];
  isMulti: boolean;
  readOnly: boolean;
  required: boolean;
  value: Value;
  multimedia_options?: {
    max_size?: number;
    mime_types?: MimeTypes[];
    min_files?: number;
    max_files?: number;
  };
}

type Keys = keyof typeof API_STATUS;
export type ApiStatus = (typeof API_STATUS)[Keys];
export interface StepperFormState {
  pageAttribute: {
    title: string;
    description: string;
  };
  sections: any;
  sectionData: any;
  currentStep: number;
  journey: Journey;
  isInitialised: boolean;
  apiError: string;
  apiStatusForEdit: {
    status: ApiStatus;
    error?: string;
  };
  stepperFormStatus: string;
  userIdentification: any;
  inputsMap: InputsMap;
}

export interface StepperFormSection {
  [key: string]: Input[];
}

export interface UpdateFormActionPayload {
  section: string;
  value: Input[];
}

export interface CurrentStep {
  code: string;
  inputs: Input[];
}
