import React from 'react';
import Alert from '..';

describe('Modal Component', () => {
  it('should render the Alert component', () => {
    cy.renderComponent(
      <Alert
        data-test-id="alert-test"
        title="This is an error title"
        variant="error"
      >
        This is an error description
      </Alert>,
    );
    cy.getById('alert-test-wrapper').should('be.visible');
    cy.getById('alert-test-message')
      .should('be.visible')
      .should('have.text', 'This is an error title');
    cy.getById('alert-test-description')
      .should('be.visible')
      .should('have.text', 'This is an error description');
  });

  it('should render the closeable Alert component', () => {
    cy.renderComponent(
      <Alert
        data-test-id="alert-test"
        title="This is an error title"
        variant="error"
        closeable
      >
        This is an error description
      </Alert>,
    );
    cy.getById('alert-test-wrapper').should('be.visible');
    cy.getById('alert-test-close-button').should('be.visible');
    cy.getById('alert-test-message')
      .should('be.visible')
      .should('have.text', 'This is an error title');
    cy.getById('alert-test-description')
      .should('be.visible')
      .should('have.text', 'This is an error description');

    cy.getById('alert-test-close-button').click();
    cy.getById('alert-test-wrapper').should('not.exist');
  });
});
