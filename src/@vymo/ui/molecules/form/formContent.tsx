import React, { forwardRef, ReactNode } from 'react';
import Loader from 'src/@vymo/ui/atoms/loader';
import { Card } from 'src/@vymo/ui/blocks';
import classNames from 'classnames';
import ConfigMappingFormsItemGeneartor from './configMappingFormItemsGenerator';
import FormItem from './formItem';
import { useFormContext } from './formProvider';
import { isFormItem } from './queries';
import { FormProps } from './types';
import styles from './index.module.scss';

const FormContent = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Omit<FormProps, 'onChange'>>
>(({ id, className, children, formulaContext, span }) => {
  const formClasses = classNames(className, styles.form);

  const { loading, config, formData, valueProp } = useFormContext(false);

  const cloneFormItemsRecursively = (formChildren): ReactNode =>
    React.Children.map(formChildren, (child) => {
      if (isFormItem(child, FormItem)) {
        return React.cloneElement(
          child,
          {
            key: child.props.code,
            'data-test-id': id,
            // @ts-ignore
            value:
              formData.fields?.[child.props.code]?.value ??
              valueProp?.[child.props.code]?.value,
          },
          cloneFormItemsRecursively(child?.props?.children),
        );
      }
      // @ts-ignore
      if (React.isValidElement(child) && child?.props?.children) {
        return React.cloneElement(child, {
          // @ts-ignore
          children: cloneFormItemsRecursively(child?.props?.children),
        });
      }

      return child;
    });

  const formElement = (
    <Loader visible={loading}>
      <div
        data-test-id={id}
        id={id}
        className={formClasses}
        style={span ? { gridTemplateColumns: span } : {}}
      >
        {/* logic to get list of formItems from the config mapping when same is provided */}
        <ConfigMappingFormsItemGeneartor
          formValue={formData?.fields}
          formulaContext={formulaContext}
          span={span}
        />
        {/* logic to attach form onchange to formItem onchange recursively.
       this piece of code works when user gives the formItem explicitly with form */}
        {cloneFormItemsRecursively(children)}
      </div>
    </Loader>
  );

  if (config.grouping === 'card') {
    return <Card>{formElement}</Card>;
  }
  return formElement;
});

export default React.memo(FormContent);
