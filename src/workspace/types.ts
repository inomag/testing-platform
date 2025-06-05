import { Module, ModuleTypeValue } from 'src/modules/types';

export type Props = Record<
  string,
  boolean | string | number | ((...args: any) => void) | React.CSSProperties
>;
export type ModuleState = {
  code: ModuleTypeValue;
  props?: Props;
  path?: string;
  fullPage?: boolean;
  withoutRouter?: boolean;
};
export type WorkspaceState = {
  modulesList: Array<ModuleState>;
  dialogs: Record<ModuleTypeValue, ModuleState & { withoutRouter?: boolean }>;
  redirectPath: string;
  fullPage: boolean;
  routeModule:
    | (Omit<Module, 'element'> & {
        breadCrumbExtraParams?: Record<string, string>;
      })
    | null;
};
