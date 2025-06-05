import * as Modules from 'src/modules/constants';
import { store } from 'src/store';
import { infoSection, nomineeDetails } from '../mainSection/debug/constants';

describe('src/modules/stepper/integration/stepper', () => {
  window.APP = 'onboarding';

  it('should render basic details page', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'basicDetails',
      },
    });
    cy.getById('formItem-name-element').should('be.visible').type('John');
    cy.getById('formItem-pan-element').should('be.visible').type('ABCPG1234P');
    cy.getById('cta-basic_details').should('be.visible').click();
    cy.getById('form-formItem-testingemail_hs7o4emv7-error').should(
      'be.visible',
    );
    cy.getById('formItem-testingemail_hs7o4emv7-element')
      .should('be.visible')
      .type('a@a.com');

    cy.getById('stepper-alert-wrapper')
      .should('be.visible')
      .contains('Basic Details Banner');
    cy.screenshot('renders basic details page');
  });

  it('should render payment page', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'payment',
      },
    });
    cy.getById('stepperForm').should('not.exist');
    cy.getById('card-container').should('be.visible');
    cy.getById('infosection-title')
      .should('be.visible')
      .contains('Pay License Fees');
    cy.screenshot('renders payment page');
  });

  it('should render Ckyc page', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'ckyc',
      },
    });
    cy.getById('formItem-name-element').should('be.disabled');
    cy.getById('formItem-name-element-lock-icon').should('be.visible');
    cy.getById('formItem-pan-element').should('be.disabled');
    cy.getById('formItem-pan-element-lock-icon').should('be.visible');

    cy.getById('formItem-testingemail_hs7o4emv7-element').should('be.disabled');
    cy.getById('formItem-testingemail_hs7o4emv7-element-lock-icon').should(
      'be.visible',
    );

    cy.screenshot('renders ckyc page');
  });

  it('should render activity card', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'activityCard',
      },
    });
    cy.getById('card-container').should('be.visible');
    cy.screenshot('renders activity card');
  });

  it('should render multiLob screen', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'multiLob',
      },
    });
    cy.getById('stepperForm').should('not.exist');
    cy.getById('multiLob-choose').should('be.visible');
    cy.getById('multiLob-ongoing').should('not.exist');
    cy.getById('lobSelect-absli_company').should('be.visible').click();
    cy.screenshot('renders multiLob card');
    cy.getById('cta-lob_select').should('be.visible').click();
    cy.getById('multiLob-choose').should('not.exist');
    cy.getById('multiLob-ongoing').should('be.visible');
    cy.getById('multiLob-recommend').should('be.visible');
  });

  it('should render select license screen', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'selectLicense',
      },
    });
    cy.getById('stepperForm').should('not.exist');
    cy.getById('License Table').should('be.visible');
    cy.getById('save-and-continue').should('be.disabled');
    cy.getById('table-row-select-a-checkmark').click();
    cy.getById('save-and-continue').should('not.be.disabled');
    cy.getById('save-and-continue').click();
    cy.getById('confirmation-modal-wrapper').should('be.visible');
    cy.getById('confirmation-modal-close-button').should('be.visible').click();
    cy.getById('confirmation-modal-wrapper').should('not.exist');
    cy.getById('save-and-continue').click();
    cy.getById('confirmation-modal-wrapper').should('be.visible');
    cy.getById('table-row-a').should('be.visible');
    cy.getById('Verify and continue-button').should('be.visible').click();
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setCurrentCta',
      payload: {
        isDialog: false,
        currentCta: {
          type: 'action',
          title: 'Verify and continue',
          action: 'demo_action',
          autoCallable: false,
        },
      },
    });
    cy.screenshot('renders select license page');
  });

  it('should render contract', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');
    // Create a mock tab object
    const mockTab = {
      closed: false,
      location: { search: '' },
      close: cy.stub(),
    };
    // Stub window.open and alias it for later use
    const openStub = cy.stub(window, 'open').callsFake(() => mockTab);
    cy.wrap(openStub).as('windowOpen'); // Wrap and alias the stub
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'contract',
      },
    });
    cy.getById('checkerForm').should('be.visible');
    cy.getById('loader').should('be.visible');
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setApiStatus',
      payload: { isDialog: false, apiStatus: 'in_progress' },
    });
    cy.then(() => {
      mockTab.closed = true; // Mark the tab as closed
    });
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setApiStatus',
      payload: { isDialog: false, apiStatus: 'completed' },
    });
    cy.screenshot('renders contract page');
  });

  it('should render error', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'error',
      },
    });
    cy.getById('stepper-alert-error-wrapper')
      .should('be.visible')
      .contains('Internal Server Error');
    cy.screenshot('renders error');
  });

  it('should render consents correctly', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'consents',
      },
    });

    cy.getById('consentItem-wrapper').should('be.visible');
    cy.getById('consentItem-readOnlyText')
      .should('be.visible')
      .find('span')
      .should('be.visible')
      .and(
        'contain.text',
        'I voluntarily opt for validation of my PAN details through NSDL based on the PAN number that I have submitted and store them for future reference. I/we will ensure that any update/change in any information or documents provided by me/us is intimated to ABSLI promptly.',
      );
    cy.getById('consentItem-checkbox-checkmark').should('be.visible');
    cy.getById('consentItem-checkbox-input')
      .invoke('attr', 'type')
      .should('equal', 'checkbox');
    cy.getById('consentItem-checkbox-label').should('be.visible');
    cy.get('span')
      .contains(
        'By continuing, you acknowledge that you accept above consent and agree to our ',
      )
      .should('be.visible');
    cy.getById('consentItem-checkbox-label')
      .find('span')
      .eq(2)
      .should('exist')
      .invoke('attr', 'class')
      .should('include', 'consent_consent__consentItem__required');
    cy.get('a')
      .should('be.visible')
      .invoke('attr', 'href')
      .should(
        'equal',
        'https://abcselect.adityabirlacapital.com/Steller-ABSLAMC-terms-and-conditions',
      );
    cy.get('a').should('contain.text', '[Terms and Conditions]');
    cy.getById('cta-recruitment_consent')
      .should('be.visible')
      .and('contain.text', 'Save and continue')
      .and('be.disabled');
    cy.getById('consentItem-checkbox-checkmark').should('be.visible').click();
    cy.getById('cta-recruitment_consent').should('not.be.disabled');
  });

  it('should render html content correctly', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
    cy.intercept('GET', 'https://example.com/external-script1.js', {
      statusCode: 200,
      body: 'console.log("External Script 1 Loaded");',
    }).as('script1');
    cy.intercept('GET', 'https://example.com/external-script2.js', {
      statusCode: 200,
      body: 'console.log("External Script 2 Loaded");',
    }).as('script2');

    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'html',
      },
    });

    cy.getRequest('script1').then(() => {
      cy.get('script[src="https://example.com/external-script1.js"]').should(
        'exist',
      );
    });

    cy.getRequest('script2').then(() => {
      cy.get('script[src="https://example.com/external-script2.js"]').should(
        'exist',
      );
    });

    cy.get('@consoleLog').should(
      'have.been.calledWith',
      'External Script 1 Loaded',
    );
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      'External Script 2 Loaded',
    );

    cy.get('@consoleLog').should('have.been.calledWith', 'Inline Script 1');
    cy.get('@consoleLog').should('have.been.calledWith', 'Inline Script 2');
  });

  it('should render custom loader correctly', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'customLoader',
      },
    });

    cy.getById('custom-loader-container').should('exist');
    cy.getById('loader').should('be.visible').find('svg').should('exist');
    cy.getById('custom-loader-status-text')
      .should('exist')
      .and('contain.text', 'Loading..');
    cy.getById('custom-loader-description')
      .should('exist')
      .and('contain.text', 'Please wait while we fetch your data.');
  });

  it('should render dataSync correctly', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'dataSync',
      },
    });

    cy.getById('dataSync-header').should('exist');
    cy.getById('dataSync-header').find('svg').should('exist');
    cy.getById('dataSync-header').should(
      'contain.text',
      'Data Sync in Progress',
    );
    cy.getById('dataSync-init-message')
      .should('be.visible')
      .and('have.text', 'We have Initiated the Data Sync Process');
    cy.getById('dataSync-checkback-note')
      .should('be.visible')
      .and(
        'have.text',
        'Please check back after some time to complete the sync.',
      );
    cy.getById('dataSync-explore-suggestion')
      .should('be.visible')
      .and(
        'have.text',
        'While you wait, would you like to explore other businesses.',
      );
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setTemplateUi',
      payload: { templateUi: { content: { grow: true } } },
    });
  });

  it('should apply correct class for mobile view', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'dataSync',
      },
    });

    cy.window().then((win) => {
      cy.stub(win.navigator, 'userAgent').value('iPhone');
    });

    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'workspace/setFullPage',
      payload: true,
    });
  });

  it('should render assessment correctly', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'assessment',
      },
    });

    cy.getById('checkmark-assessment-What is 2 + 2?_0').click();
    cy.getById('cta-submit')
      .should('be.visible')
      .and('have.text', 'Submit')
      .click();
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setTemplateUi',
      payload: {
        isDialog: false,
        templateUi: {
          header: { hide: { title: true, description: true } },
          footer: { hide: { cta: true } },
        },
      },
    });
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setApiStatus',
      payload: { isDialog: false, apiStatus: 'cta_clicked' },
    });
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setCurrentCta',
      payload: {
        isDialog: false,
        currentCta: {
          type: 'action',
          action: 'submit',
          title: 'Submit',
        },
      },
    });
  });

  it('should render stepper debug correctly', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    cy.renderModule(Modules.PROGRESSIVE_STEPPER, {
      props: {
        debugMode: 'playground',
      },
    });
    cy.setScenario({
      portalInitV3: {
        section: 'basicDetails',
      },
    });

    cy.getById('popup').should('exist').and('have.length', 2);
    cy.getById('popup')
      .eq(0)
      .find('button')
      .should('contain.text', 'SAMPLE CONFIGS');
    cy.getById('popup')
      .eq(1)
      .find('button')
      .should('contain.text', 'UPDATE CONFIG');
    cy.getById('popup').eq(0).find('button').click();
    cy.getById('popup-content').should('be.visible');
    cy.get('div').contains('Nominee Details').should('be.visible').click();
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setTemplateData',
      payload: nomineeDetails,
    });
    cy.getById('popup').eq(0).find('button').click();
    cy.get('div').contains('InfoSection').should('be.visible').click();
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'stepper/setTemplateData',
      payload: {
        ...nomineeDetails,
        infoSection,
      },
    });
  });

  it('should redirect to the given URL when callbackAction is rendered', () => {
    cy.renderModule(Modules.PROGRESSIVE_STEPPER);
    cy.setScenario({
      portalInitV3: {
        section: 'callbackAction',
      },
    });
    cy.wait(1000).then(() => {
      cy.location('href').should('contain', 'https://staging.lms.getvymo.com');
      cy.screenshot('redirects to url mentioned in the meta');
    });
  });
});
