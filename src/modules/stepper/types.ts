import { ButtonType } from 'src/@vymo/ui/atoms/button/types';
import type { FormConfigType } from 'src/@vymo/ui/molecules';

export type ApiStatus =
  | 'cta_clicked'
  | 'in_progress'
  | 'completed'
  | 'error'
  | undefined;

type CheckListStepStatus = 'completed' | 'locked' | 'in_progress';
type CheckListStepAction = {
  name: string;
  code: string;
  description: string;
  status: CheckListStepStatus;
  type: string;
  actionStatusMessage: string;
  metadata: any;
};
type CheckListStep = {
  status: CheckListStepStatus;
  code: string;
  name: string;
  description: string;
  type: string;
  actions: CheckListStepAction[];
  stepStatusMessage: string;
};

type CheckList = {
  code: string;
  name: string;
  status: string;
  progress: Progress;
  steps: CheckListStep[];
};

type Progress = {
  label: string;
  percentage: string;
};
type Banner = {
  type: 'error' | 'success' | 'info' | 'warning' | 'default';
  message: string;
  duration: null | number;
};

type InfoSection = {
  type?: 'error' | 'success' | 'info' | 'warning' | 'default';
  title?: string;
  description?: string;
};

export type Cta = {
  type?: string;
  title?: string;
  action?: any;
  enabled?: boolean;
  autoCallable?: boolean;
  actionResponse?: any;
  variant?: ButtonType;
  pollFrequency?: number;
  maxPollWaitTime?: number;
};
export type Loader = {
  type?: 'custom' | 'page';
  meta?: {
    statusText?: string;
    description?: string;
  };
  actionCategory?: string;
};

export type TemplateUi = {
  header?: {
    hide?: {
      title?: boolean;
      description?: boolean;
    };
  };
  content?: {
    grow?: boolean;
  };

  footer?: {
    hide?: {
      cta?: boolean;
    };
  };
};

export type StepperResult = {
  client: string;
  visitor: any;
  legacyLogin?: boolean;
  loginInfo?: {
    isLoginSuccess: boolean;
    nextAction: {
      action: string;
      path: string;
    };
  };
  template: {
    type?: 'custom' | 'page';
    title?: string;
    description?: string;
    actionType?: string;
    code?: string;
    actionCategory?: string;
    milestones?: {
      checklist: CheckList[];
      progress: Progress;
    } | null;
    loader?: Loader;
    carouselEnabled?: boolean;
    banner?: Banner | null;
    infoSection?: InfoSection | null;
    backConfig?: { cta: Cta } | null;
    meta?: any;
    form?: {
      inputs: NonNullable<FormConfigType>['data'];
      fieldGroupConfig: NonNullable<FormConfigType>['grouping'];
      editable: boolean;
      inputs_map: Record<string, string>;
      viewMode: boolean;
    } | null;
    html?: string | null;
    cta?: Cta[] | null;
    layout?: 'fullPage' | 'dialog' | 'card';
  };
  isLoginSuccess?: boolean;
  isAssistedOnboarding?: boolean;
};

export type InitResponse = {
  result: StepperResult;
  portalConfig?: any;
};

export type StepperContextProps = {
  isDialog: boolean;
  debugMode?: 'playground' | 'playgroundWithConfig';
};

export type StepperProps = {
  isDialog: string;
  debugMode?: 'playground' | 'playgroundWithConfig';
};
