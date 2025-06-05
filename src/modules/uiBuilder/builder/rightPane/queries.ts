import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';

export const getPropValueForSelect = (value = []) => {
  value = value.filter((v) => v !== 'undefined');
  return value.map((v) => ({
    value: v,
    label: v,
    code: v,
    name: v,
  }));
};

export const convertToSelectOptions = (input, isSelect = false) => {
  const options = Object.entries(input).map(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object: Create options recursively
      return {
        code: key,
        name: key,
        options: convertToSelectOptions(value),
      };
    }
    // Primitive value or null
    return {
      code: key,
      name: key,
    };
  });

  if (!isSelect) {
    return [
      {
        code: 'formConfig',
        name: 'Form Config',
        options,
      },
    ];
  }

  return [
    {
      code: 'formConfig',
      name: 'Form Config',
      options,
    },
    {
      code: 'dataObject',
      name: 'Data Object',
      options: [{ code: 'modules', name: 'Modules' }],
    },
  ];
};

export const getDropDownFactory = ({
  code,
  label,
  options = [],
  required = false,
  className = '',
}) => ({
  read_only: false,
  oif_options: {
    type: 'default',
  },
  required,
  min_chars: null,
  max_chars: null,
  regex: null,
  regex_hint: null,
  retain_form_context: false,
  hidden_v2: null,
  default_value: null,
  validations: [],
  hidden: false,
  placeholder: locale(Keys.SELECT_VALUE),
  code_name_spinner_options:
    typeof options[0] === 'string' ? getPropValueForSelect(options) : options,
  code,
  hint: label,
  type: 'code_name_spinner',
  className,
});

export const getTextFactory = ({
  code,
  label,
  required = false,
  className = '',
}) => ({
  read_only: false,
  oif_options: {
    type: 'default',
  },
  required,
  min_chars: null,
  max_chars: null,
  regex: null,
  regex_hint: null,
  retain_form_context: false,
  hidden_v2: null,
  default_value: null,
  validations: [],
  hidden: false,
  placeholder: locale(Keys.ENTER_TEXT),
  code,
  hint: label,
  type: 'text',
  className,
});

export const getNumberFactory = ({ code, label, required = false }) => ({
  read_only: false,
  oif_options: {
    type: 'default',
  },
  required,
  min_chars: null,
  max_chars: null,
  regex: null,
  regex_hint: null,
  retain_form_context: false,
  hidden_v2: null,
  default_value: null,
  validations: [],
  hidden: false,
  placeholder: locale(Keys.ENTER_NUMBER),
  code,
  hint: label,
  type: 'number',
});

export const getSwitchFactory = ({ code, label, required }) => ({
  type: 'switch',
  code,
  hint: label,
  required,
});

export const getCodeEditorFactory = ({
  code,
  label,
  required,
  options,
  theme = 'vs-dark',
  language = 'js',
  width,
  height,
}) => ({
  type: 'codeEditor',
  code,
  hint: label,
  required,
  options,
  theme,
  language,
  width,
  height,
});

export const getSIFGFactory = (
  { code, label, required },
  staticComponentList: Array<any> = [],
  dynamicComponentList: Array<any> = [],
) => ({
  code,
  hint: label,
  required,
  read_only: false,
  oif_options: {
    type: 'default',
  },
  min_chars: null,
  max_chars: null,
  regex: null,
  regex_hint: null,
  retain_form_context: false,
  hidden_v2: null,
  default_value: null,
  validations: [],
  hidden: false,
  placeholder: locale(Keys.SELECT_VALUE),
  sifg_options: {
    selection: {
      type: 'code_name_spinner',
      code_name_spinner_options: [
        {
          code: 'static',
          name: locale(Keys.STATIC),
        },
        {
          code: 'dynamic',
          name: locale(Keys.DYNAMIC),
        },
      ],
      required: true,
    },
    inputs: {
      static: staticComponentList,
      dynamic: dynamicComponentList,
    },
  },

  type: 'sifg',
});

export const getDefaultValues = (values) =>
  Object.entries(values).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = { value, code: key };
    }
    return acc;
  }, {});

const sortFormItems = (items: any[]) => {
  const order = {
    value: 1,
    children: 2,
    boolean: 3,
    number: 4,
    select: 5,
    text: 6,
  };

  const getTypePriority = (item: any) => {
    if (item.name === 'value') return order.value;
    if (item.name === 'children') return order.children;
    if (item.type === 'boolean') return order.boolean;
    if (item.type === 'number') return order.number;
    if (Array.isArray(item.type) && typeof item.type[0] === 'string')
      return order.select;
    return order.text;
  };

  return [...items].sort((a, b) => getTypePriority(a) - getTypePriority(b));
};

const filterFormItems = (items: any[] = []) =>
  items.filter(
    ({ name }) => !['classname', 'classnames', "'data-test-id'"].includes(name),
    // ({ name }) => ['value'].includes(name),
  );

export const filterSortItems = (items: any[]) =>
  sortFormItems(filterFormItems(items));
