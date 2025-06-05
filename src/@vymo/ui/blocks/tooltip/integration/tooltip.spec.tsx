import React from 'react';
import Tooltip from 'src/@vymo/ui/blocks/tooltip';

describe('Tooltip Component', () => {
  it('should render tooltip component correctly', () => {
    cy.renderComponent(
      <Tooltip content={<div>Custom text</div>} placement="left" />,
    );
    cy.getById('popup').should('be.visible').trigger('mouseover');
    cy.getById('popup-content')
      .should('be.visible')
      .and('have.text', 'Custom text');
  });
});
