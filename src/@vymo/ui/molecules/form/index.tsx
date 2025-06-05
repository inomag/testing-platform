import _ from 'lodash';
import React, { useCallback } from 'react';
import { isDevDebugMode } from 'src/workspace/utils';
import FormContent from './formContent';
import FormProvider from './formProvider';
import { FormProps, FormVersion } from './types';

const defaultValue = {};

// Type --> Hybrid
const Form = React.forwardRef<HTMLInputElement, FormProps>(
  (
    {
      name,
      onChange,
      id,
      span,
      className,
      children,
      value = defaultValue,
      config = {
        data: [],
        version: FormVersion.web,
        grouping: [],
        beforeSaveHookConfig: {
          multimedia: {
            isMultimediaBeforeSaveHookDisabled: false,
            uploadUrl: '/api/getS3signedUrl',
            valueFormat: 'url',
          },
        },
        fieldItemConfig: {
          showDisabledIcon: false,
        },
        viewMode: false,
      },
      formulaContext,
    },
    ref,
  ) => {
    const isDebug = isDevDebugMode();

    const onChangeFormContent = useCallback(
      (formFields: Record<string, any>) => {
        onChange(formFields);
      },
      [onChange],
    );

    return (
      <FormProvider
        onChange={onChangeFormContent}
        value={value}
        ref={ref}
        config={config}
        isDebug={isDebug}
      >
        <FormContent
          name={name}
          span={span}
          id={id}
          config={config}
          className={className}
          formulaContext={formulaContext}
        >
          {children}
        </FormContent>
      </FormProvider>
    );
  },
);

Form.displayName = 'Form';

export type FormConfigType = FormProps['config'];

export default React.memo(
  Form,
  (prevProps, nextProps) =>
    _.isEqual(prevProps.value, nextProps.value) &&
    _.isEqual(
      JSON.stringify(prevProps.config),
      JSON.stringify(nextProps.config),
    ),
);
