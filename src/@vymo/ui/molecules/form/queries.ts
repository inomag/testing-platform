import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { FormItemProps } from './formItem/types';

export const isFormItem = (
  element: ReactNode,
  FormItem,
): element is ReactElement<FormItemProps> =>
  React.isValidElement(element) && element.type === FormItem;
