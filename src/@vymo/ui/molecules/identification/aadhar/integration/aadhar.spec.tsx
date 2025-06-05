import React from 'react';
import Aadhar from 'src/@vymo/ui/molecules/identification/aadhar';

describe('Aadhar Component', () => {
  it('should render simple aadhar component correctly', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} />,
    );
    cy.getById('custom-aadhar').should('be.visible');
  });

  it('should render aadhar component with required field correctly', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} required />,
    );
    cy.getById('custom-aadhar').should('be.visible');
  });

  it('should render aadhar component with label correctly', () => {
    cy.renderComponent(
      <Aadhar
        data-test-id="custom-aadhar"
        onChange={undefined}
        label="Aadhar Number"
      />,
    );
    cy.getById('custom-aadhar').should('be.visible');
    cy.getById('custom-aadhar-label').should('be.visible');
    cy.getById('custom-aadhar-label').should('have.text', 'Aadhar Number');
  });

  it('should render readonly aadhar component correctly', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} readOnly />,
    );
    cy.getById('custom-aadhar').should('be.visible');
    cy.getById('custom-aadhar').should('have.attr', 'disabled');
  });

  it('should render aadhar component without validation correctly', () => {
    cy.renderComponent(
      <Aadhar
        data-test-id="custom-aadhar"
        onChange={undefined}
        hideValidation
      />,
    );
    cy.getById('custom-aadhar').should('be.visible');
  });

  it('on click, it should type the value correctly', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} />,
    );
    cy.getById('custom-aadhar').should('be.visible');
    cy.getById('custom-aadhar').type('111111111111');
    cy.getById('custom-aadhar').should('have.value', '1111-1111-1111');
  });

  it('should clear value on clicking cross button', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} />,
    );
    cy.getById('custom-aadhar').should('be.visible');
    cy.getById('custom-aadhar').type('111111111111');
    cy.getById('custom-aadhar').should('have.value', '1111-1111-1111');
    cy.getById('custom-aadhar').trigger('mouseover');
    cy.getById('custom-aadhar-icon').click();
    cy.getById('custom-aadhar').should('have.value', '');
  });

  it('should show validation error correctly', () => {
    cy.renderComponent(
      <Aadhar data-test-id="custom-aadhar" onChange={undefined} />,
    );
    cy.getById('custom-aadhar').should('be.visible');
    cy.getById('custom-aadhar').type('11111111111');
    cy.getById('custom-aadhar').should('have.value', '1111-1111-111');
    cy.getById('custom-aadhar-error-0').should('be.visible');
    cy.getById('custom-aadhar-error-0').should(
      'have.text',
      'Invalid Aadhar Number',
    );
  });
});
