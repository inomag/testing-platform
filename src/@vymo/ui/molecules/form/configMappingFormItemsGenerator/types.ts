import { ClientConfig } from '../formProvider/types';
import {
  ContextProps,
  FormFieldState,
  InputFieldConfig,
  Value,
} from '../types';

export type ConfigMappingFormItemsGeneratorProps = {
  formValue: Record<string, Partial<FormFieldState>>;
  formulaContext?: ContextProps;
  span?: string;
};

export type MetaProps = {
  field: Partial<InputFieldConfig>;
  render: (InputFieldConfig) => JSX.Element;
  clientConfig: ClientConfig;
};

export type FormulaEvaluatorProps = {
  field: FormFieldState & InputFieldConfig;
  formValue: { value?: Value | undefined; additionalData: any };
  render: (InputFieldConfig, any, computedAdditionalData: any) => JSX.Element;
  clientConfig: ClientConfig;
};

export type Options = Array<{ code: string; name: string }>;
