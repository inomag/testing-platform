import { InputFieldConfig, Value } from '../../types';

export type ContextEvaluatorProps = {
  field: InputFieldConfig;
  formValue: {
    value?: Value | undefined;
    additionalData: any;
  };
  render: (InputFieldConfig: any) => JSX.Element;
};
