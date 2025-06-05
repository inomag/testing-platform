import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Alert from 'src/@vymo/ui/blocks/alert';
import useContextSubscriber from 'src/hooks/useContextSubscriber';
import { setAxiosInstanceAuthToken } from 'src/workspace/axios';
import { getClientConfigData } from 'src/workspace/utils';
import { Config, FormFieldState, InputFieldConfig } from '../types';
import {
  getConfigFieldsByGroup,
  getDuplicateKeys,
  getFieldsPayloadData,
  getFlattenConfig,
} from './queries';
import {
  appendFieldsAtCode,
  deleteFieldsAtCode,
  formReducer,
  initialFormState,
  resetForm,
  setDebugMessage,
  setFormConfig,
  setFormValidation,
  setIsLoading,
  setReferralData,
  updateFieldState,
} from './slice';
import { FormContextProps, FormSliceState } from './types';
import { beforeSaveHook } from './utils';

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const useFormContext = (legacy: boolean) => {
  const context = useContext(FormContext);

  if (legacy) {
    return {} as FormContextProps;
  }
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

const scrollToFirstInvalidField = (
  fieldValidations: Record<string, string>,
  configData: Array<InputFieldConfig>,
) => {
  const narrowedFieldsConfigData = configData?.map((item) => ({
    code: item?.code,
    validity: fieldValidations?.[item?.code],
  }));

  const firstInvalidItem = narrowedFieldsConfigData.find(
    (item) => item?.validity === 'not_valid',
  );

  if (firstInvalidItem) {
    const element = document.getElementById(
      `form-formItem-${firstInvalidItem?.code}`,
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

const FormConfigProvider = React.forwardRef<
  HTMLInputElement,
  {
    onChange: (formFields: Record<string, FormFieldState>) => void;
    config: Config;
    value: Record<string, FormFieldState>;
    children: any;
    isDebug: boolean;
  }
>(
  (
    { onChange, config: initialConfig, value: valueProp, children, isDebug },
    ref,
  ) => {
    const [formState, dispatch, subscribe] = useContextSubscriber(
      formReducer,
      initialFormState({ initialConfig, valueProp, isDebug }),
    );

    const [clientConfig, setClientConfig] = useState({});

    useEffect(() => {
      const configData = getClientConfigData();
      if (configData?.auth_token) {
        setAxiosInstanceAuthToken(configData.auth_token);
      }
      setClientConfig(configData);
    }, []);

    // Debounce the onChange function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const debouncedOnChange = useCallback(debounce(onChange, 300), []);
    const groupedConfig = getConfigFieldsByGroup(formState.config);

    useEffect(() => {
      dispatch(setFormConfig(initialConfig));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialConfig), dispatch]);

    useEffect(() => {
      dispatch(resetForm(valueProp));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(valueProp), dispatch]);

    useEffect(() => {
      if (formState.formData.lastUpdated) {
        // only call onChange when fields length > 0 + form is updated
        // lastUpdated is their that means someone has changed the form
        if (Object.keys(formState.formData.fields).length === 0) {
          return;
        }
        dispatch(
          setDebugMessage({
            messageKey: 'Form Data',
            data: formState.formData,
          }),
        );
        onChange(formState.formData.fields);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formState]);

    // listen to form context store and resolve validity if not_valid or valid
    const formValid = useMemo(
      () =>
        new Promise((resolve) => {
          subscribe((store) => {
            const formValidity = store.validity.form;

            if (['valid', 'not_valid'].includes(formValidity)) {
              resolve({
                formValidity,
                fieldValidations: store.validity.fields,
              });
            }
          });
        }),
      [subscribe],
    );

    useImperativeHandle(ref as any, () => ({
      getFieldsForSubmission: async (mode: 'save' | 'query' = 'save') => {
        const flattenConfig = getFlattenConfig(formState.config.data);
        let beforeHookData;
        let validity;
        if (mode === 'save') {
          beforeHookData = await beforeSaveHook(flattenConfig, formState);
          dispatch(setFormValidation({ formValidity: 'in_progress' }));

          validity = await formValid;

          if (validity?.formValidity === 'not_valid') {
            scrollToFirstInvalidField(
              validity?.fieldValidations,
              flattenConfig,
            );
          }

          dispatch(setFormValidation({ formValidity: 'not_checked' }));
        }

        return {
          data: getFieldsPayloadData(
            flattenConfig,
            formState.formData.fields,
            beforeHookData ?? {},
          ),
          valid: validity?.formValidity,
        };
      },
    }));

    const { hasDuplicates, duplicateKeys } = getDuplicateKeys(
      getFlattenConfig(formState.config.data),
      'code',
    );

    return (
      <FormContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          ...formState,
          updateFieldState: useCallback(
            (args) => dispatch(updateFieldState(args)),
            [dispatch],
          ),
          setReferralData: useCallback(
            (data) => dispatch(setReferralData(data)),
            [dispatch],
          ),
          appendFieldsAtCode: useCallback(
            (args) => dispatch(appendFieldsAtCode(args)),
            [dispatch],
          ),
          deleteFieldsAtCode: useCallback(
            (args) => dispatch(deleteFieldsAtCode(args)),
            [dispatch],
          ),
          setIsLoading: useCallback(
            (args) => dispatch(setIsLoading(args)),
            [dispatch],
          ),
          setDebugMessage: useCallback(
            (args) => dispatch(setDebugMessage(args)),
            [dispatch],
          ),
          setFormConfig: useCallback(
            (args) => dispatch(setFormConfig(args)),
            [dispatch],
          ),
          groupedConfig,
          loading: Boolean(formState.loadingApiCount),
          formValid: formState.validity.form,
          referralData: formState.referralData,
          valueProp,
          formValue: formState.formData.fields,
          setFormValidation: useCallback(
            (state) => dispatch(setFormValidation(state)),
            [dispatch],
          ),
          // TODO - harshit used by aif migrate to getFieldsForSubmission if possible
          getFieldsPayloadData: (
            fieldsConfig: FormSliceState['config']['data'],
          ) =>
            getFieldsPayloadData(fieldsConfig, formState.formData.fields, {}),
          clientConfig,
        }}
      >
        {hasDuplicates && (
          <Alert
            variant="error"
            title="Duplicate Fields(code) found in config. Please check"
          >
            {duplicateKeys.join(', ')}
          </Alert>
        )}
        {children}
      </FormContext.Provider>
    );
  },
);

export default React.memo(FormConfigProvider);
