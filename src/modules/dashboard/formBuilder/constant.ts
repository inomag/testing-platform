export const inputTypes = [
  { key: 'text', name: 'Text Input' },
  { key: 'number', name: 'Number Input' },
  { key: 'input', name: 'Generic Input' },
  { key: 'pan', name: 'PAN Input' },
  { key: 'aadhar', name: 'Aadhar Input' },
  { key: 'code_name_spinner', name: 'Code Name Spinner' },
  { key: 'multi_select_auto_complete', name: 'Multi-Select Auto-Complete' },
  { key: 'phone', name: 'Phone Input' },
  { key: 'date', name: 'Date Picker' },
  { key: 'time', name: 'Time Picker' },
  { key: 'meeting', name: 'Date-Time Range Picker' },
  { key: 'user_referral', name: 'User Referral Dropdown' },
  { key: 'referral', name: 'Referral Dropdown' },
  { key: 'sifg', name: 'SIFG Component' },
  { key: 'location', name: 'Location Selector' },
  { key: 'aif', name: 'AIF Component' },
  { key: 'currency', name: 'Currency Input' },
  { key: 'decimal', name: 'Decimal Input' },
  { key: 'sentence', name: 'Text Area' },
  { key: 'email', name: 'Email Input' },
  { key: 'label', name: 'Label' },
  { key: 'link', name: 'Link' },
  { key: 'multimedia', name: 'Document Uploader' },
  { key: 'radio', name: 'Radio Group' },
];

export const commonConfig = {
  read_only: false,
  oif_options: {
    type: 'default',
  },
  required: false,
  min_chars: null,
  max_chars: null,
  regex: null,
  regex_hint: null,
  retain_form_context: false,
  hidden_v2: null,
  default_value: null,
  validations: [],
  hidden: false,
};

export const inputSpecificConfig = {
  text: {
    placeholder: 'Enter text',
  },
  number: {
    placeholder: 'Enter number',
  },
  input: {
    placeholder: 'Enter value',
  },
  pan: {
    placeholder: 'Enter PAN',
  },
  aadhar: {
    placeholder: 'Enter Aadhar',
  },
  code_name_spinner: {
    placeholder: 'Select value',
    code_name_spinner_options: [
      {
        code: 'none',
        name: 'None',
      },
      {
        code: 'a',
        name: 'A',
      },
      {
        code: 'b',
        name: 'B',
      },
      {
        code: 'c',
        name: 'C',
      },
      {
        code: 'd',
        name: 'D',
      },
    ],
  },
  multi_select_auto_complete: {
    placeholder: 'Select value',
    single_select: false,

    code_name_spinner_options: [
      {
        code: 'none',
        name: 'None',
      },
      {
        code: 'a',
        name: 'A',
      },
      {
        code: 'b',
        name: 'B',
      },
      {
        code: 'c',
        name: 'C',
      },
      {
        code: 'd',
        name: 'D',
      },
    ],
  },
  phone: {
    placeholder: 'Enter phone number',
  },
  date: {
    placeholder: 'Select date',
    show_day_month_year: 'DMY',
    min_date: -3155760000000,
    max_date: 86400000,
  },
  time: {
    placeholder: 'Select time',
  },
  meeting: {
    placeholder: 'Select date-time range',
    code_name_spinner_options: [
      {
        code: 'none',
        name: 'Duration',
      },
      {
        code: '300000',
        name: '5 mins',
      },
      {
        code: '1800000',
        name: '30 mins',
      },
      {
        code: '3600000',
        name: '60 mins',
      },
      {
        code: '5400000',
        name: '90 mins',
      },
    ],
    duration_optional: true,
    default_millies_from_now: 0,
  },
  user_referral: {
    placeholder: 'Select user',
    async: false,
    online: true,
    context_filters: [],
  },
  referral: {
    async: false,
    online: true,
    source: 'leads_new',
    context_filters: [],
  },
  sifg: {
    placeholder: 'Select value',
    sifg_options: {
      selection: {
        type: 'code_name_spinner',
        code_name_spinner_options: [
          {
            code: 'none',
            name: 'Select',
            order: 0,
          },
          {
            code: 'a',
            name: 'A',
          },
          {
            code: 'b',
            name: 'B',
          },
        ],
        required: true,
      },
      inputs: {
        a: [],
        b: [],
      },
    },
  },
  location: {
    placeholder: 'Select location',
  },
  aif: {
    group_title: 'Sample AIF Group',
    min_group: 1,
    max_group: 3,
    add_actio_title: 'Add AIF',
    input_fields: [],
  },
  currency: {
    placeholder: 'Enter amount',
  },
  decimal: {
    placeholder: 'Enter decimal',
  },
  sentence: {
    placeholder: 'Enter text',
    min_lines: 3,
  },
  email: {
    placeholder: 'Enter email',
  },
  label: {
    value: 'Testing Yahoo: <a href="http://yahoo.com">Yahoo</a>',
  },
  link: {
    title: 'Yahoo',
    url: 'http://yahoo.com',
    show_link_icon: false,
  },
  multimedia: {
    multimedia_options: {
      media_type: 'document',
      media_types: ['document', 'photo'],
      mime_types: [
        'application/pdf',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'image/jpeg',
        'image/png',
        'image/jpeg',
      ],
      access: ['local_storage', 'camera', 'gallery'],
      min_files: 0,
      max_files: 6,
    },
  },
  radio: {
    placeholder: 'Select value',
    meta: {
      viewType: 'radio',
    },
    options: [
      { name: 'Option 1', code: 'option1' },
      { name: 'Option 2', code: 'option2', disabled: true },
      { name: 'Option 3', code: 'option3' },
    ],
  },
};
