import * as Modules from 'src/modules/constants';

describe('src/modules/recruitment/integration/recruitment', () => {
  // TODO : needHelp revisit why this fails only on remote run.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should show error message when pan number is invalid', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
      },
    });
    cy.setScenario({
      actionValidate: {
        hasError: true,
      },
    });
    cy.getById('stepper-form').should('be.visible');
    cy.getById('pan-input').type('ABCDE1234');
    cy.getById('validate-pan-btn').should('be.disabled');
    cy.getById('pan-input')
      .clear()
      .type('ABCDE1234G')
      .then(() => {
        cy.getById('validate-pan-btn').should('be.enabled');
      });
    cy.getById('validate-pan-btn')
      .click()
      .then(() => {
        cy.getById('pan-input-subMessage')
          .should('be.visible')
          .should('have.text', 'User details not found');
      });
  });
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should load recruitment page under module settings', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
      },
    });
    cy.getById('stepper-form').should('be.visible');
    cy.getById('pan-input').type('ABCDE1234');
    cy.getById('validate-pan-btn').should('be.disabled');
    cy.getById('pan-input').clear().type('ABCDE1234G');
    cy.getById('validate-pan-btn').should('be.enabled');
    cy.getById('validate-pan-btn')
      .click()
      .then(() => {
        cy.getById('edit-pan-btn').click();
        cy.getById('pan-input').eq(1).type('ABCDE1234G');
        cy.getById('validate-pan-btn').click();
      });
  });

  it('Should render stepper modal', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
      },
    });
    cy.getById('step-info').click();
    cy.getById('stepper-modal-wrapper').should('be.visible');
  });
});

describe('src/modules/recruitment/integration/stepperForm', () => {
  it('Should render userIdentification section for pan', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'default',
      },
    });
    cy.screenshot('renders userIdentification section for pan');
  });
  it('Should render userIdentification section for aadhar', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'aadhar',
      },
    });
    cy.screenshot('renders userIdentification section for aadhar');
  });
  it('should render input form', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'inputform',
      },
    });
    cy.screenshot('renders inputform section');
  });

  it('should render meeting section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'meeting',
      },
    });
    cy.screenshot('renders meeting section');
  });
  it('should render document section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'multimedia',
      },
    });
    cy.screenshot('renders document section');
  });
  it('should render info section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'info',
      },
    });
    cy.screenshot('renders info section');
  });
  it('should render groupedField section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'groupedFields',
      },
    });
    cy.screenshot('renders groupedFields section');
  });
  it('should render esign section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'esign',
      },
    });
    cy.setScenario({
      esign: {},
    });
    cy.getById('docu-sign-btn')
      .click()
      .wait(200)
      .then(() => {
        cy.screenshot('renders esign section');
      });
  });
  it('should render T&C section', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        section: 'termsAndConditions',
      },
    });
    cy.screenshot('renders groupedFields section');
    cy.getById('nda-terms-and-conditions')
      .click()
      .then(() => {
        cy.wait(1000).then(() => {
          cy.getById('terms-and-conditions-modal-wrapper').should('be.visible');
        });
      });
  });
  it('should hide step info for assisstedOnboarding', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'recruitmentMeta/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
        isAssistedOnboarding: true,
      },
    });
    cy.getById('step-info').should('not.exist');
  });
});
