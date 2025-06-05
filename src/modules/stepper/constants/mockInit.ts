export const actionVariables = {
  meetingTime: {
    valType: 'form',
    attribute: 'meeting',
    inputField: 'if_meeting',
  },
  meetingLocation: {
    valType: 'form',
    attribute: 'checkin_location',
    inputField: 'if_checkin_location',
  },
  meetingMode: {
    valType: 'form',
    attribute: 'meeting_mode',
    inputField: 'if_meeting_mode',
  },
};

export const consentResponse = {
  message: 'success',
  result: {
    client: 'abcapital',
    template: {
      type: 'page',
      code: 'distributor_login_input',
      actionCategory: 'distributorLogin',
      title: 'Welcome to Aditya Birla Capital',
      description: "Let's make your dreams come true",
      carouselEnabled: true,
      form: {
        inputs: [
          {
            type: 'text',
            placeholder: 'Enter Name',
            code: 'name',
            hint: 'Enter Name',
            required: true,
            regex: "^[a-zA-Z]+([ '-][a-zA-Z]+)*$",
            regexHint: 'Invalid Name format.',
          },
          {
            type: 'pan',
            placeholder: 'Enter PAN Number',
            code: 'pan',
            hint: 'Enter PAN Number',
            required: true,
            regex: '^.{3}P.*',
            regexHint:
              "Invalid PAN format. The 4th character must be 'P' for Individual PAN cards.",
          },
        ],
        fieldGroupConfig: [],
        editable: true,
      },
      cta: [
        {
          type: 'static',
          action: {
            code: 'consent',
            type: 'custom',
            actionCategory: 'ConsentActionCategory',
            milestones: null,
            carouselEnabled: false,
            title: 'Consent',
            description: '',
            banner: null,
            infoSection: null,
            form: null,
            html: null,
            meta: {
              html: "<ol style=\"font-family: Open Sans; font-size: 14px\"><li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li><li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li><li>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</li><li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li><li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li><li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li><li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li><li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li><li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li><li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li><li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li></ol>",
              consentFields: [
                {
                  label:
                    'I agree to <a href="https://www.vymo.com/">Terms of Usage</a> and Privacy Policy',
                  required: true,
                  selected: false,
                },
                {
                  label:
                    "I agree to authorize Aditya Birla Sun Life Insurance Company Limited and it's associates to Call/SMS/Email me",
                  required: true,
                  selected: true,
                },
                {
                  label:
                    'I agree to <a href="https://www.vymo.com/">WhatsApp Banking</a> Terms & Conditions',
                  required: false,
                  selected: true,
                },
              ],
              version: '1.0.0',
            },
            ctas: [
              {
                type: 'action',
                action: 'login_input',
                title: 'Agree and Continue',
              },
            ],
            layout: 'dialog',
          },
          title: 'Continue',
        },
      ],
      layout: 'fullscreen',
    },
  },
  portalConfig: {
    branding: {
      code: 'absli-recruitment-portal',
      deleted: false,
      domain: 'https://absli-recruitment-portal.lms.getvymo.com',
      logo: {
        height: 48,
        url: 'https://i.postimg.cc/wjpYzyr7/240131-ABC-Life-Insurance-Identity-RGB-Lockup-White-V1-01-1.png',
        width: 90,
      },
      logoBackgroundColor: '#ffffff',
      banner: [
        {
          height: 400,
          url: 'https://i.postimg.cc/zB9Yp0Wt/Frame-1420.png',
          width: 700,
        },
        {
          height: 400,
          url: 'https://i.postimg.cc/8PW3gYvg/Screenshot-2024-09-16-at-12-57-37-PM.png',
          width: 700,
        },
        {
          height: 400,
          url: 'https://i.postimg.cc/N04ML5vB/2b30bec61651a302655253b1a9b2ee2fc6c54b0ef8d8745ceb89ed7e9df2dbbe-Aditya-Birla-Group-Logo-Vector-600x.jpg',
          width: 700,
        },
      ],
      theme: {
        background: '#ffffff',
        primary: '#bf3743',
        secondary: '#f8e7ea',
        tertiary: '#44546F',
        font: '#44546F',
        heading: '#172B4D',
        error: '#f44336',
        warning: '#ffa726',
        info: '#29b6f6',
        success: '#66bb6a',
      },
      loader: 'spinner',
      email: 'email',
      phone: 'phone',
      bannerTitle: 'Hey there! Welcome to Aditya Birla Sun Life Insurance.',
      bannerDescription: 'Begin your journey to success as an agent today!',
      portalMappingConfigCode: 'abc_n6cady-recruitment_leads_r7k7ys',
      startState: 'absli_bp7m6i-recruitment_leads_124r3a_new',
      defaultUser: '100002',
      portalSessionTimeout: 600000,
      loginType: 'pan',
    },
    i18nSettings: {
      ianaTimezone: 'Asia/Kolkata',
      locale: 'en-IN',
      language: 'en',
      country: 'India',
      currency: '₹',
      currency_iso: 'INR',
      quantity: 'KLC',
      country_calling_code: '91',
      client_date_time_config: {
        date_in_curr_year: {
          dateTimeFormat: 'DD_MMM_YYYY',
          relativeFormat: false,
        },
        date: { dateTimeFormat: 'DD_MMM_YYYY', relativeFormat: false },
        meeting_date_time_in_curr_year: {
          dateTimeFormat: 'DAY_DD_MMM-TIME',
          relativeFormat: true,
        },
        meeting_date_not_in_curr_year: {
          dateTimeFormat: 'DD_MMM_YYYY-TIME',
          relativeFormat: false,
        },
        date_range: {
          dateTimeFormat: 'DD_MMM_YYYY',
          relativeFormat: false,
        },
        date_in_chart: { dateTimeFormat: 'MMM_YY', relativeFormat: false },
        time_range: { dateTimeFormat: 'HH_MM_A', relativeFormat: false },
        month_day_in_cal: {
          dateTimeFormat: 'MMM_DD',
          relativeFormat: false,
        },
        month_year_in_cal: {
          dateTimeFormat: 'MMM_YYYY',
          relativeFormat: false,
        },
        date_time_with_seconds: {
          dateTimeFormat: 'DD_MM_YYYY_HH_MM_SS_SLASH',
          relativeFormat: false,
        },
        day_month_date: {
          dateTimeFormat: 'DAY_MMM_DD',
          relativeFormat: true,
        },
        time: { dateTimeFormat: 'H_MM_A', relativeFormat: false },
      },
      multiLanguageSupported: false,
      supportedLanguages: [],
      timezone: '+0530',
      iana_timezone: 'Asia/Kolkata',
    },
    loginType: 'pan',
  },
};
