/* eslint-disable testing-library/await-async-utils */
import '@cypress/code-coverage/support';
import { portalUrlMap } from './constants';

declare global {
  namespace Cypress {
    interface Chainable {
      login: () => void;
      logout: () => void;
      portalVisit: (portalId: string) => void;
      getByText: (
        selector: string,
        text: string,
      ) => Cypress.Chainable<JQuery<HTMLElement>>;
      getInputByLabel: (
        inputLabel: string,
      ) => Cypress.Chainable<JQuery<HTMLElement>>;
      getValidationByLabel: (
        inputLabel: string,
      ) => Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }
}

const login = () => {
  cy.session('vymoPlatform', () => {});
};

Cypress.Commands.add('logout', () => {
  cy.visit('/logout');
});

Cypress.Commands.add('portalVisit', (portalId) => {
  const env = Cypress.env('TEST_ENV') || 'localhost';
  const url = portalUrlMap[portalId][env];
  cy.visit(url);
  if (env === 'localhost') {
    cy.get('select[id="portal-select"]')
      .should('exist')
      .select('abc-recruitment-portal');

    cy.get('button[id="submit-portal-id"]').should('exist').click();
  }
});

Cypress.Commands.add(
  'getByText',
  {
    prevSubject: 'optional',
  },
  (subject, selector, text) => cy.wrap(subject).contains(selector, text),
);

Cypress.Commands.add('getInputByLabel', (inputLabel) => {
  cy.getByText('label', inputLabel).parent().next().find('input');
});

Cypress.Commands.add('getValidationByLabel', (inputLabel) => {
  cy.getByText('label', inputLabel).parent().next().next().find('span');
});

Cypress.Commands.addAll({ login });

Cypress.on('uncaught:exception', () => false);
