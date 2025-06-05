import * as Modules from 'src/modules/constants';

describe('src/modules/copilot/integration/copilot', () => {
  it('should render Copilot component', () => {
    cy.renderModule(Modules.COPILOT);
    cy.getById('copilot-module-header').should('be.visible');
    cy.getById('copilot-module-footer').should('be.visible');
  });

  it('should handle get history api failure case', () => {
    cy.renderModule(Modules.COPILOT);
    cy.setScenario({
      getHistory: {
        isError: true,
      },
    });
    cy.getById('toast').should('be.visible');
  });

  it('should handle get history api success case', () => {
    cy.renderModule(Modules.COPILOT);
    cy.setScenario({
      getHistory: {
        isError: false,
      },
    });

    cy.getRequest('getHistory');

    cy.getStoreData('copilot.messages').should('have.length', 4);
    cy.getById('user-message').should('be.visible');
    cy.getById('system-message').should('be.visible');
    cy.getById('lead-message').should('be.visible');
    cy.getById('table-message').should('be.visible');
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should handle send message button', () => {
    cy.renderModule(Modules.COPILOT);

    cy.getById('input-element').type('List of leads created yesterday');
    cy.getById('send-icon').click();

    cy.getById('typing').should('be.visible');

    cy.getById('toast').should('be.visible');

    cy.getStoreData('copilot.messages').should('have.length', 5);
  });

  it('should handle clear history api success case', () => {
    cy.setScenario({
      getHistory: {
        isError: true,
        isClearAPI: true,
      },
    });

    cy.renderModule(Modules.COPILOT);

    cy.wait(1000).then(() => {
      cy.getById('menu-button').click();
    });

    cy.wait(1000).then(() => {
      cy.getById('clear-history-button').click();
    });

    cy.getRequest('getHistory');

    cy.getStoreData('copilot.messages').should('have.length', 0);
  });
});
