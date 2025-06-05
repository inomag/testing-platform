import { MemoExoticComponent, ReactElement } from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import { ModalProps } from 'src/@vymo/ui/blocks/modal/types';
import * as Constants from 'src/modules/constants';
import { FeatureFlag } from 'src/featureFlags';

export type ModuleTypeValue =
  | (typeof Constants)[keyof typeof Constants]
  | 'noModuleAdded';

export type DialogueTypeValue = (typeof Constants)[keyof typeof Constants];

export type Thunk = {
  onActivate: (args?) => void;
  onDeactivate: (args?) => void;
};

export type BreadCrumb = {
  path?: string;
  /**
   *  navigate to host app routes if true, else navigate within platform
   */
  legacy: boolean;
  breadcrumbName: string;
  code?: string;
  paramFromRoute?: Array<string>;
};

export type HostAppConfig = {
  hideSideHamBurgerMenu?: boolean;
};

export type Module = {
  readonly code?: ModuleTypeValue;
  readonly element?: ReactElement;
  fullPage?: boolean;
  path?: string;
  component: ((args?) => ReactElement) | MemoExoticComponent<any>;
  featureFlag?: FeatureFlag;
  props?: Record<string, string | number | boolean | React.CSSProperties>;
  thunk?: Thunk;
  breadCrumbs?: Array<BreadCrumb>;
  hostApp?: HostAppConfig;
  dialog?: {
    props?: Partial<ModalProps>;
    styles?: {
      m?: {
        w?: string;
        h?: string;
      };
      t?: {
        w?: string;
        h?: string;
      };
      d?: {
        w?: string;
        h?: string;
      };
    };
  };
};

export type ModulesList = Record<string, Module>;
