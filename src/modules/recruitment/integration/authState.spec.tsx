import * as Modules from 'src/modules/constants';

describe('src/modules/recruitment/integration/recruitment-navigation', () => {
  it('Redirect to Auth page when not authorized', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Recruitment' },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: false,
      },
    });
    cy.wait(500).then(() => {
      cy.getStoreData('register.apiState.status').then((data) => {
        expect(data).to.eq('unauthorized');
      });
      cy.screenshot('Redirect to Auth page');
    });
  });
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Redirect to Auth page back button is pressed', () => {
    cy.renderModule(Modules.RECRUITMENT, {
      props: { lastPage: 'Test page' },
    });
    cy.setScenario({
      init: {
        hasError: false,
        isAuthorized: true,
      },
    });
    cy.window().its('store').invoke('dispatch', {
      type: 'register/resetState',
    });
    cy.go('back');
    cy.wait(100).then(() => {
      cy.getStoreData('workspace.redirectPath').then((data) => {
        expect(data).to.eq('/auth');
      });
    });
  });
});
