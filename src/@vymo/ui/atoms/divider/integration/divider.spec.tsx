import React from 'react';
import Divider from '..';

describe('Divider component', () => {
  it('Should render divider component', () => {
    cy.renderComponent(<Divider data-test-id="divider-component" />);
    cy.getById('divider-component').should('be.visible');
    cy.screenshot('Should render divider component');
  });
});
