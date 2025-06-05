import _ from 'lodash';
import Logger from 'src/logger';
import {
  ChildrenDisplayType,
  Config,
  FormattedField,
  FormFieldState,
  InputFieldConfig,
} from '../types';
import { FormSliceState } from './types';

const log = new Logger('Form Provider Queries');

export const getFormFieldFromValue = (field: Partial<FormFieldState>) => ({
  isValid: field.isValid || true,
  errors: field.errors || [],
  touched: field.touched || false,
  code: field.code || '',
  value: field.value,
  additionalData: field.additionalData || null,
  lastUpdated: field.lastUpdated,
});

export const getFlattenConfig = (
  data?: InputFieldConfig[],
  filterByChildrenDisplayType: Array<'flatten' | 'nested'> = ['nested'],
  flattenData: InputFieldConfig[] = [],
): InputFieldConfig[] => {
  data?.forEach(({ children, ...configWithoutChildren }) => {
    if (children && Array.isArray(children)) {
      if (
        !filterByChildrenDisplayType.includes(
          configWithoutChildren.childrenDisplayType as ChildrenDisplayType,
        )
      ) {
        flattenData.push({
          ...configWithoutChildren,
        });
        getFlattenConfig(children, filterByChildrenDisplayType, flattenData);
      } else {
        flattenData.push({
          ...configWithoutChildren,
          // @ts-ignore
          children,
        });
      }
    } else {
      flattenData.push(configWithoutChildren);
    }
  });
  return flattenData;
};

export const getFieldsSyncWithUpdatedConfigData = (
  fields: FormSliceState['formData']['fields'],
  configData: Config['data'],
) => {
  const updatedFields: FormSliceState['formData']['fields'] = {};
  getFlattenConfig(configData).forEach((field) => {
    const inputFieldCode = field.code;
    if (!field.hideFormValue) {
      if (inputFieldCode in fields) {
        updatedFields[inputFieldCode] = getFormFieldFromValue({
          ...field,
          ...fields[inputFieldCode],
        });
      } else {
        updatedFields[inputFieldCode] = getFormFieldFromValue({
          code: inputFieldCode,
        });
      }
    }
  });
  return updatedFields;
};

export const getOtherGroupFields = (config: Config) => {
  const { data, grouping = [] } = config;

  // @ts-ignore
  const groupFields = grouping.reduce((acc: Array<string>, group) => {
    // @ts-ignore
    acc = _.uniq([...acc, ...group.fields]);
    return acc;
  }, []);

  const othersFieldConfigData = data.filter(
    (inputFieldConfig) => !groupFields.includes(inputFieldConfig.code),
  );

  return {
    code: 'others',
    name: 'Others',
    fields: getFlattenConfig(othersFieldConfigData),
  };
};

export const getConfigFieldsByGroup = (config: Config) => {
  const { data = [], grouping = [] } = config;
  const groupData: any = [];
  if (Array.isArray(grouping) && grouping.length > 0) {
    grouping.forEach((group) => {
      const filterConfigData = data.filter((inputFieldConfig) =>
        group.fields.includes(inputFieldConfig.code),
      );
      groupData.push({ ...group, fields: getFlattenConfig(filterConfigData) });
    });

    groupData.push(getOtherGroupFields(config));
  } else {
    groupData.push({
      code: 'default',
      fields: getFlattenConfig(data),
    });
  }
  return groupData;
};

// eslint-disable-next-line max-lines-per-function
export const getUpdatedConfigAndFieldsAppendAtCode = (
  configData: Array<InputFieldConfig>,
  fields: Record<string, FormFieldState>,
  appendedConfigData: Array<InputFieldConfig>,
  insertAtCode: string,
  isFormInitialized: boolean,
  actionType: string,
  childrenDisplayType: InputFieldConfig['childrenDisplayType'],
  depth: number = 0,
): {
  updatedConfigData: Array<InputFieldConfig>;
  updatedFieldsData: Record<string, FormFieldState>;
} => {
  if (!isFormInitialized) {
    return {
      updatedConfigData: configData,
      updatedFieldsData: fields,
    };
  }

  const updatedConfigData: Array<InputFieldConfig> = [];

  let inserted = false;

  configData.forEach((inputFieldConfigData) => {
    const updatedInputFieldConfigData = { ...inputFieldConfigData };
    // TODO: childrenDisplayType at children parallel level
    if (inputFieldConfigData.code === insertAtCode && !inserted) {
      if (actionType === 'updateAtCode') {
        // Initialize children if empty
        if (!Array.isArray(inputFieldConfigData.children)) {
          updatedInputFieldConfigData.children = [];
        }

        updatedInputFieldConfigData.children = [
          // @ts-ignore
          ...updatedInputFieldConfigData.children,
          ...appendedConfigData,
        ];
      } else {
        if (Array.isArray(inputFieldConfigData.children)) {
          inputFieldConfigData.children.forEach(({ code }) => {
            delete fields[code];
          });
        }
        updatedInputFieldConfigData.children = [...appendedConfigData];
      }
      appendedConfigData.forEach(({ code, value }) => {
        // if value present in config add the fields data
        if (value) {
          fields[code] = {
            code,
            value,
            isValid: true,
            errors: [],
            touched: false,
          };
        }
      });
      updatedInputFieldConfigData.childrenDisplayType = childrenDisplayType;
      inserted = true;
    } else if (
      Array.isArray(updatedInputFieldConfigData.children) &&
      actionType !== 'updateAtCode'
    ) {
      const result = getUpdatedConfigAndFieldsAppendAtCode(
        updatedInputFieldConfigData.children,
        fields,
        appendedConfigData,
        insertAtCode,
        isFormInitialized,
        actionType,
        childrenDisplayType,
        depth + 1,
      );
      updatedInputFieldConfigData.children = result.updatedConfigData;
    }
    updatedConfigData.push(updatedInputFieldConfigData);
  });

  if (depth === 0 && !inserted) {
    log.error(
      `Cannot find the ${insertAtCode} code in form to which fields need to be inserted`,
      configData,
    );
  }

  return {
    updatedConfigData,
    updatedFieldsData: fields,
  };
};

export const getUpdatedConfigAndFieldsDeleteAtCode = (
  configData: Array<InputFieldConfig>,
  fields: Record<string, FormFieldState>,
  deleteAtCode: string,
  isFormInitialized,
  depth: number = 0,
): {
  updatedConfigData: Array<InputFieldConfig>;
  updatedFieldsData: Record<string, FormFieldState>;
  deleted: boolean;
} => {
  let deleted = false;
  const updatedConfigData: Array<InputFieldConfig> = [];

  // eslint-disable-next-line complexity
  configData.forEach((inputFieldConfigData) => {
    const updatedInputFieldConfigData = { ...inputFieldConfigData };
    if (inputFieldConfigData.code === deleteAtCode) {
      if (isFormInitialized && Array.isArray(inputFieldConfigData.children)) {
        inputFieldConfigData.children.forEach(({ code }) => {
          // deleting form data
          delete fields[code];
        });
      }
      deleted = true;
    } else {
      if (Array.isArray(inputFieldConfigData.children) && !deleted) {
        const result = getUpdatedConfigAndFieldsDeleteAtCode(
          inputFieldConfigData.children,
          fields,
          deleteAtCode,
          isFormInitialized,
          depth + 1,
        );

        if (result.deleted) {
          deleted = result.deleted;
          const { updatedConfigData: childrenUpdatedConfigData } = result;
          updatedInputFieldConfigData.children = childrenUpdatedConfigData;
        }
      }
      updatedConfigData.push(updatedInputFieldConfigData);
    }
  });

  if (depth === 0 && !deleted) {
    log.error(
      'Cannot find the code in form to which fields need to be deleted',
    );
  }

  return {
    updatedConfigData,
    updatedFieldsData: fields,
    deleted,
  };
};

export const getDuplicateKeys = (
  configData: Array<InputFieldConfig>,
  property: string,
) => {
  const groupedByProperty = _.groupBy(configData, property);
  const duplicateKeys = Object.keys(groupedByProperty).filter(
    (key) => groupedByProperty[key].length > 1,
  );

  return {
    hasDuplicates: duplicateKeys.length > 0,
    duplicateKeys,
  };
};

export const getFieldsPayloadData = (
  configData: FormSliceState['config']['data'],
  fields: FormSliceState['formData']['fields'],
  beforeHookData: Record<string, any>,
): FormattedField[] => {
  const formattedData: FormattedField[] = [];

  configData.forEach((field) => {
    let formattedField: FormattedField = {
      type: field.type,
      code: field.code,
      name: field.hint,
      // TODO: check follow_up_validate and errorMessage and remove if not necessary
      follow_up_validate: false,
      errorMessage: '',
    };

    const fieldData = fields[field.code];
    if (fieldData) {
      switch (field.type) {
        case 'multimedia':
          formattedField.value = beforeHookData[field.code];
          break;
        case 'date':
          // Convert value to ISO format to ensure universal date standardization and avoid timezone issues.
          formattedField.value = fieldData?.value
            ? new Date(fieldData.value).toISOString()
            : fieldData.value;
          break;
        case 'phone':
          formattedField.value = fieldData?.value?.replace(/\D/g, '');
          break;
        default:
          formattedField.value = fieldData.value;
          if (field.type === 'sifg') {
            formattedField = {
              ...formattedField,
              type: field?.sifg_options?.selection?.type || 'code_name_spinner',
            };
          }

          break;
      }
      formattedData.push({
        ...formattedField,
        ...(fieldData?.additionalData || {}),
      });
    }
  });

  return formattedData;
};

export const getSignedUrlPayload = (docInputs) => {
  let isSignedUrlRequired = false;
  const payload = {
    signed_url_requests: docInputs
      .filter((input) => Array.isArray(input?.value) && input?.value.length)
      .filter((input) => input?.value?.some((file) => file?.isNew))
      ?.map((input) => {
        const fileAttributes = input.value.filter((file) => file?.isNew) || [];
        if (fileAttributes.length) {
          isSignedUrlRequired = true;
        }
        return {
          file_attributes: fileAttributes,
          field_code: input.code,
        };
      }),
  };
  return { payload, isSignedUrlRequired };
};

export const mapConfigData = (
  configData: FormSliceState['config']['data'],
  mapFn: (inputField: InputFieldConfig) => InputFieldConfig,
) =>
  (configData || []).map((inputField) => {
    const { children, ...rest } = inputField;

    const mappedChildren = children ? mapConfigData(children, mapFn) : [];
    return mapFn({ ...rest, children: mappedChildren });
  });
