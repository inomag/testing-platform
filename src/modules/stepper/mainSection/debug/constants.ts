/* eslint-disable max-lines */
const milestones = {
  checklist: [
    {
      code: 'absli_bp7m6i-recruitment_leads_124r3a_new',
      name: 'Getting Started',
      status: 'completed',
      steps: [],
    },
    {
      code: 'absli_bp7m6i-recruitment_leads_124r3a_agent_recruitment_application',
      name: 'Application',
      status: 'enabled',
      steps: [
        {
          status: 'completed',
          code: 'basic_details',
          name: 'Basic Details',
          description: 'Basic Details',
          type: 'conditional',
          actions: [
            {
              name: 'Basic Details',
              code: 'basic_details',
              description: 'Please fill your basic details',
              status: 'completed',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/basic_details?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
          ],
          stepStatusMessage: '',
        },
        {
          status: 'enabled',
          code: 'kyc',
          name: 'KYC Verification',
          description: 'KYC',
          type: 'conditional',
          actions: [
            {
              name: 'CKYC Verification',
              code: 'ckyc',
              description: 'Please verify using CKYC',
              status: 'failed',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/ckyc?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
            {
              name: 'Manual KYC',
              code: 'manual_kyc',
              description:
                'Please proceed with manual KYC and provide your permanent address details',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/manual_kyc?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
          ],
          stepStatusMessage: '',
        },
        {
          status: 'enabled',
          code: 'bank_details',
          name: 'Bank Details',
          description: 'Bank Details',
          type: 'conditional',
          actions: [
            {
              name: 'Bank Account Details',
              code: 'validate_bank_account',
              description: 'Validate your bank account details',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/validate_bank_account?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
          ],
          stepStatusMessage: '',
        },
        {
          status: 'enabled',
          code: 'additional_details',
          name: 'Additional Details',
          description: 'Additional Details',
          type: 'conditional',
          actions: [
            {
              name: 'Additional Information',
              code: 'additional_profile_details',
              description: 'Please fill additional information',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/additional_profile_details?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
            {
              name: 'Education Details',
              code: 'education_details',
              description: 'Please fill education details',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/education_details?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
            {
              name: 'Nominee Details',
              code: 'nominee_details',
              description: 'Please fill nominee details',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/nominee_details?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
            {
              name: 'Exam Preference',
              code: 'exam_preference',
              description: 'Exam Preference',
              status: 'completed',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/exam_preference?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
            {
              name: 'Declaration',
              code: 'declaration',
              description: 'Please declare the following items',
              status: 'enabled',
              type: 'portal_redirect',
              actionStatusMessage: '',
              metadata: {
                portal: {
                  url: 'https://abc-staging.lms.getvymo.com/web-platform/branch/abc/onboarding/#/stepper/absli/action/declaration?vo=k2Fxit97Jw',
                  query_params: {
                    requires_auth: true,
                    payload: {},
                    method: 'GET',
                    headers: {},
                  },
                },
              },
            },
          ],
          stepStatusMessage: '',
        },
        {
          status: 'locked',
          code: 'application_submission',
          name: 'Application Submission',
          description: 'Application Submission',
          type: 'conditional',
          actions: [],
          stepStatusMessage: '',
        },
      ],
    },
    {
      code: 'absli_bp7m6i-recruitment_leads_124r3a_agent_recruitment_onboarding',
      name: 'Onboarding',
      status: 'locked',
      steps: [],
    },
    {
      code: 'absli_bp7m6i-recruitment_leads_124r3a_agent_recruited',
      name: 'Onboarding Complete',
      status: 'locked',
      steps: [],
    },
  ],
};

const banner = {
  type: 'info',
  message: 'Test Banner',
  duration: null,
};

export const infoSection = {
  type: 'info',
  title: 'Test Info Section',
  desciption: 'Test Info Section Description',
};

const form = {
  inputs: [
    {
      type: 'text',
      code: 'nominee_name',
      hint: 'Nominee Name',
      required: true,
      min_chars: 1,
      max_chars: 30,
      regex: '^[^\\W\\d_]+(?:\\s[^\\W\\d_]+)*$',
      regex_hint: 'Please enter valid name',
      oif_options: null,
      read_only: false,
      placeholder: 'Enter name',
      retain_form_context: false,
      hidden: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      value: '',
    },
    {
      type: 'date',
      code: 'nominee_date_of_birth',
      hint: 'Nominee Date of Birth',
      required: true,
      show_day_month_year: 'DMY',
      min_date: -3155760000000,
      max_date: -31622400000,
      oif_options: null,
      read_only: false,
      retain_form_context: false,
      hidden: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      value: '',
    },
    {
      type: 'sifg',
      code: 'relationship_to_advisor_39debwi02d',
      required: true,
      hint: 'Relationship to advisor',
      sifg_options: {
        selection: {
          type: 'code_name_spinner',
          code: 'relationship_to_advisor_39debwi02d',
          hint: 'Relationship to advisor',
          code_name_spinner_options: [
            {
              code: 'none',
              name: 'Select',
              order: 0,
            },
            {
              code: 'spouse',
              name: 'Spouse',
            },
            {
              code: 'Child',
              name: 'Child',
            },
            {
              code: 'parent',
              name: 'Parent',
            },
            {
              code: 'srpnzzcx',
              name: 'Sibling',
            },
            {
              code: 'Other',
              name: 'Other',
            },
          ],
          required: false,
        },
        inputs: {
          spouse: [],
          Child: [],
          parent: [],
          srpnzzcx: [],
          Other: [
            {
              type: 'text',
              code: 'nominee_relationship_others',
              hint: 'others',
              required: false,
              oif_options: null,
              read_only: false,
              retain_form_context: false,
              hidden: false,
              display_in_form_type: 'MODULE',
              search_options: null,
              value: '',
            },
          ],
          Mother: [],
          Father: [],
          Husband: [],
          Wife: [],
          'Others - Friend/Relative': [],
          'Others - Brother/Sister': [],
          CIE: [],
          SP: [],
          'Compliance Officer': [],
          'Director/Imp Person/Partners': [],
          'Authorized Signatory': [],
          Son: [],
          Daughter: [],
        },
      },
      oif_options: {
        type: 'default',
      },
      read_only: false,
      retain_form_context: false,
      hidden: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      value: '',
    },
    {
      type: 'text',
      code: 'nominee_age',
      hint: 'Nominee Age',
      required: true,
      read_only: false,
      default_value: {
        type: 'standard',
        inputs: [
          {
            type: 'value',
            value: {
              val_type: 'form',
              operator_required: false,
              attribute: 'nominee_date_of_birth',
              input_field: 'nominee_date_of_birth',
            },
          },
        ],
        standard_function: 'COMPUTE_YEARS_ELAPSED',
        return_type: 'text',
      },
      retain_form_context: true,
      hidden: true,
      display_in_form_type: 'MODULE',
      search_options: null,
      value: '',
    },
    {
      type: 'text',
      code: 'appointee_name',
      hint: 'Appointee Name',
      required: true,
      min_chars: 1,
      max_chars: 30,
      regex: '^[^\\W\\d_]+(?:\\s[^\\W\\d_]+)*$',
      regex_hint: 'Please enter valid name',
      oif_options: null,
      read_only: false,
      placeholder: 'Enter name',
      hidden_v2: {
        type: 'standard',
        inputs: [
          {
            type: 'value',
            value: {
              val_type: 'form',
              operator_required: false,
              attribute: 'nominee_age',
              input_field: 'nominee_age',
            },
          },
          {
            type: 'value',
            value: {
              val_type: 'static',
              operator_required: false,
              value: 18,
              data_type: 'decimal',
            },
          },
        ],
        standard_function: 'GT',
        return_type: 'bool',
      },
      retain_form_context: false,
      hidden: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      value: '',
    },
  ],
  fieldGroupConfig: [
    {
      code: 'vhtkvcrkb',
      name: 'Nominee details',
      fields: [
        'nominee_name',
        'relationship_to_advisor_39debwi02d',
        'nominee_relationship_others',
        'nominee_date_of_birth',
        'nominee_age',
        'appointee_name',
      ],
    },
  ],
  editable: true,
  inputs_map: {},
  viewMode: false,
};

const cta = [
  {
    type: 'action',
    title: 'Verify and continue',
    action: 'demo_action',
    autoCallable: false,
  },
];

export const nomineeDetails: any = {
  type: 'page',
  code: 'nominee_details',
  actionCategory: 'PortalInputFormActionCategory',
  milestones,
  title: 'Nominee Details',
  description: 'Please fill nominee details',
  form,
  cta,
};

const tableRows = [
  {
    code: 'a',
    inputs_map: {
      license: 'Health',
      state: 'TX',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
  {
    code: 'b',
    inputs_map: {
      license: 'Life',
      state: 'TX',
      expiration_date: '2021-12-31',
      tier: 'Silver',
      status: 'Active',
    },
  },
  {
    code: 'c',
    inputs_map: {
      license: 'Health',
      state: 'CA',
      expiration_date: '2021-12-31',
      tier: 'Bronze',
      status: 'Inactive',
    },
  },
  {
    code: 'd',
    inputs_map: {
      license: 'Life',
      state: 'CA',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
  {
    code: 'e',
    inputs_map: {
      license: 'Health',
      state: 'NY',
      expiration_date: '2021-12-31',
      tier: 'Silver',
      status: 'Active',
    },
  },
  {
    code: 'f',
    inputs_map: {
      license: 'Life',
      state: 'NY',
      expiration_date: '2021-12-31',
      tier: 'Bronze',
      status: 'Inactive',
    },
  },
  {
    code: 'g',
    inputs_map: {
      license: 'Health',
      state: 'FL',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
  {
    code: 'h',
    inputs_map: {
      license: 'Life',
      state: 'FL',
      expiration_date: '2021-12-31',
      tier: 'Silver',
      status: 'Active',
    },
  },
  {
    code: 'i',
    inputs_map: {
      license: 'Health',
      state: 'GA',
      expiration_date: '2021-12-31',
      tier: 'Bronze',
      status: 'Inactive',
    },
  },
  {
    code: 'j',
    inputs_map: {
      license: 'Life',
      state: 'GA',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
  {
    code: 'k',
    inputs_map: {
      license: 'Health',
      state: 'NJ',
      expiration_date: '2021-12-31',
      tier: 'Silver',
      status: 'Active',
    },
  },
  {
    code: 'l',
    inputs_map: {
      license: 'Life',
      state: 'NJ',
      expiration_date: '2021-12-31',
      tier: 'Bronze',
      status: 'Inactive',
    },
  },
  {
    code: 'm',
    inputs_map: {
      license: 'Health',
      state: 'PA',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
  {
    code: 'n',
    inputs_map: {
      license: 'Life',
      state: 'PA',
      expiration_date: '2021-12-31',
      tier: 'Silver',
      status: 'Active',
    },
  },
  {
    code: 'o',
    inputs_map: {
      license: 'Health',
      state: 'IL',
      expiration_date: '2021-12-31',
      tier: 'Bronze',
      status: 'Inactive',
    },
  },
  {
    code: 'p',
    inputs_map: {
      license: 'Life',
      state: 'IL',
      expiration_date: '2021-12-31',
      tier: 'Gold',
      status: 'Active',
    },
  },
];

const selectLicense: any = {
  type: 'custom',
  code: 'select_license',
  actionCategory: 'SelectLicenseActionCategory',
  milestones,
  title: 'Select License',
  description: 'Please select license',
  meta: {
    cta,
    tables: [
      {
        tableName: 'ACTIVE LICENSE APPLICABLE ON CARRIER',
        rows: tableRows,
        metaData: {
          columnConfig: [
            {
              title: 'Code',
              field: 'code',
              sortable: true,
              filter: false,
              type: 'text',
              visible: false,
              export: true,
              filters: ['Select'],
            },
            {
              title: 'License',
              field: 'inputs_map.license',
              sortable: true,
              filter: false,
              type: 'text',
              visible: true,
              export: true,
              filters: ['Select'],
            },
            {
              title: 'State',
              field: 'inputs_map.state',
              sortable: true,
              filter: false,
              type: 'text',
              visible: true,
              export: true,
              filters: ['Select'],
            },
            {
              title: 'Expiration Date',
              field: 'inputs_map.expiration_date',
              sortable: true,
              filter: false,
              type: 'date',
              visible: true,
              export: true,
              filters: ['Select'],
            },
            {
              title: 'Tier',
              field: 'inputs_map.tier',
              sortable: true,
              filter: true,
              type: 'spinner',
              visible: true,
              export: true,
              filters: ['Select', 'Gold', 'Silver', 'Bronze'],
            },
            {
              title: 'Status',
              field: 'inputs_map.status',
              sortable: true,
              filter: true,
              type: 'spinner',
              visible: true,
              export: true,
              filters: ['Select', 'Active', 'Inactive'],
            },
          ],
          groupByAttribute: 'inputs_map.state',
          filters: ['inputs_map.state', 'inputs_map.tier'],
          pageSize: tableRows.length,
          primaryGroup: 'TX',
          selectionAttribute: 'code',
          enableSelection: true,
        },
      },
    ],
  },
};

export const componentConfigs = [
  { type: 'component', name: 'CTA', data: cta, key: 'cta' },
  { type: 'component', name: 'Form', data: form, key: 'form' },
  { type: 'component', name: 'Banner', data: banner, key: 'banner' },
  {
    type: 'component',
    name: 'InfoSection',
    data: infoSection,
    key: 'infoSection',
  },
];

export const templateConfigs = [
  {
    type: 'template',
    name: 'Nominee Details',
    data: nomineeDetails,
    key: 'nominee_details',
  },
  { type: 'template', name: 'Select License', data: selectLicense },
];
