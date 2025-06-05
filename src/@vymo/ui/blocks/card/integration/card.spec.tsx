import React from 'react';
import Card from '..';

describe('Card component', () => {
  it('Should render card component', () => {
    cy.renderComponent(<Card>Card content</Card>);
    cy.getById('card-container').should('be.visible');
    cy.screenshot('Should render card component');
  });

  it('Should render card component when error', () => {
    cy.renderComponent(<Card hasError>Card content</Card>);
    cy.getById('card-container').should('be.visible');
    cy.screenshot('Should render card component');
  });
});
