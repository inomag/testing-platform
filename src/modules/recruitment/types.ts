import { Document } from 'src/@vymo/ui/molecules/documentUploader/types';
import {
  ActionType,
  CurrentStep,
  Input,
  InputsMap,
  PageMeta,
} from 'src/models/stepperFormLegacy/types';

export interface InitAPIResponse {
  message: string;
  result: Result;
  inputsMap?: InputsMap;
}

export interface PageComponent {
  type: string;
  title: string;
  description: string;
  meta: PageMeta;
  inputsMap?: InputsMap;
}

interface Page {
  component: PageComponent;
}
interface Result {
  visitor: any;
  page: Page;
}
export interface Step {
  name: string;
  code: string;
  stepInfo: string;
  order: number;
  status: string;
}

export interface InitAttributes {
  component: string;
  title: string;
  description: string;
  steps: Step[];
  currentStep: CurrentStep;
}

export interface ActionAPIPayload {
  actionType: ActionType;
  payload:
    | ValidateActionAPIPayload
    | SubmitActionAPIPayload
    | CreateActionAPIPayload;
  code?: string;
  isEdit?: boolean;
}

export interface ValidateActionAPIPayload {
  type: string;
  value: string;
}

export interface SubmitActionAPIPayload {
  current_step: string;
  current_section: string;
  inputs: any;
}

export interface CreateActionAPIPayload {}

export interface DocumentInputItem {
  bucket: string;
  filename: string;
  size: number;
  mime: string;
  label: string;
  path: string;
}

export interface DocumentInputPayload {
  media_type: string;
  items: DocumentInputItem[];
  bucket: string;
}

export interface GetUpdateDocInputValueParam {
  bucket: string;
  filesById: { [id: string]: Document };
  responseArray: any[];
}

export interface SegregateInputReturnType {
  docInputs: Input[];
  updatedInputs: Input[];
  filesById: { [id: string]: Document };
}

export interface InitPayload {
  payload: {
    queryParam?: string;
    headers: { 'X-Vymo-Auth-Token': string } | null;
  };
}
