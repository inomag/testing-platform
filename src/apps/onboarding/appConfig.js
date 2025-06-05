const AppConfig = {
  name: 'onboarding',
  title: 'onboarding',
  appHtml: 'src/apps/onboarding/index.html',
  appIndexJs: 'src/apps/onboarding/index',
  output: {
    type: 'html',
    clients: [
      'abslamc-recruitment-portal',
      'absli-recruitment-portal',
      'abfl-recruitment-portal',
      'abhfl-recruitment-portal',
      'lending-application-pod7',
      'lending-applicant-pod7',
      'abc-recruitment-portal',
      'nam_onboarding_individual_application',
      'lending-application-pod7-pnb',
      'lending-applicant-pod7-pnb',
      'gtm-onboarding-abc-recruitment-portal-staging',
      'gtm-onboarding-abc-recruitment-portal',
      'lending-application-gtm',
      'lending-applicant-gtm',
    ],
  },
};

module.exports = AppConfig;
