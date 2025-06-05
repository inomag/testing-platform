import React from 'react';
import Pan from 'src/@vymo/ui/molecules/identification/pan';

describe('Pan Component', () => {
  it('should render simple pan component correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} />);
    cy.getById('pan-input').should('be.visible');
  });

  it('should render pan component with required field correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} required />);
    cy.getById('pan-input').should('be.visible');
  });

  it('should render pan component with label correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} label="PAN" />);
    cy.getById('pan-input').should('be.visible');
    cy.getById('pan-input-label').should('be.visible');
    cy.getById('pan-input-label').should('have.text', 'PAN');
  });

  it('should render readonly pan component correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} readOnly />);
    cy.getById('pan-input').should('be.visible');
    cy.getById('pan-input').should('have.attr', 'disabled');
  });

  it('should render pan component without validation correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} hideValidation />);
    cy.getById('pan-input').should('be.visible');
  });

  it('on click, it should type the value correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} />);
    cy.getById('pan-input').should('be.visible');
    cy.getById('pan-input').type('AAAAA0000A');
    cy.getById('pan-input').should('have.value', 'AAAAA0000A');
  });

  it('should clear value on clicking cross button', () => {
    cy.renderComponent(<Pan onChange={undefined} value="AAAAA0000A" />);
    cy.getById('pan-input').should('be.visible');
    cy.getById('pan-input').should('have.value', 'AAAAA0000A');
    cy.getById('pan-input').trigger('mouseover');
    cy.getById('pan-input-icon').click();
    cy.getById('pan-input').should('have.value', '');
  });

  it('should show validation error correctly', () => {
    cy.renderComponent(<Pan onChange={undefined} />);
    cy.getById('pan-input').should('be.visible');
    cy.getById('pan-input').type('AAAAA00000');
    cy.getById('pan-input').should('have.value', 'AAAAA00000');
    cy.getById('pan-input-error-0').should('be.visible');
    cy.getById('pan-input-error-0').should('have.text', 'Invalid PAN number');
  });
});
