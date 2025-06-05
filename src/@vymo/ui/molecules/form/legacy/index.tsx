import React, { forwardRef, useCallback, useEffect } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line vymo-ui/restrict-import
import { getFormFields } from 'src/models/form/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { initializeForm, updateField } from 'src/models/form/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { FormLegacyProps } from '../types';

const Form = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<FormLegacyProps>
>(({ name, onChange, id, className, children }, ref) => {
  const dispatch = useAppDispatch();
  const formClasses = classNames(className);

  useEffect(() => {
    dispatch(initializeForm({ formKey: `${name}` }));
  }, [dispatch, name]);

  const formFields =
    useAppSelector((state) => getFormFields(state, `${name}`)) || {};

  useEffect(() => {
    if (Object.keys(formFields).length === 0) return;
    onChange(formFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields]);

  const onFieldChange = useCallback(
    (
      code: string,
      value: any,
      event: React.ChangeEvent<any>,
      isValid: boolean,
      errors: string[],
      touched: boolean,
    ) => {
      dispatch(
        updateField({
          formKey: `${name}`,
          code,
          field: {
            value,
            valid: isValid,
            error: errors,
            touched,
          },
        }),
      );
    },
    [dispatch, name],
  );

  return (
    <form data-test-id={id} id={id} className={formClasses}>
      <div ref={ref}>
        {Array.isArray(children)
          ? children?.map((field) =>
              React.cloneElement(field, {
                legacy: true,
                onChange: onFieldChange,
                key: field.code,
                'data-test-id': id,
              }),
            )
          : React.cloneElement(children, {
              legacy: true,
              onChange: onFieldChange,
              key: children?.code,
              'data-test-id': id,
            })}
      </div>
    </form>
  );
});

export default React.memo(Form);
