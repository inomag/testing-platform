import { ReactNode } from 'react';
import { ContextProps, FormFieldState } from '../../types';

export type FormulaContextProps = {
  children: ReactNode;
  context?: ContextProps;
  formValue: Record<string, Partial<FormFieldState>>;
};
