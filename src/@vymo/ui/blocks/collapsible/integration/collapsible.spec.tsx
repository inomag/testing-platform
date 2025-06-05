import React from 'react';
import Collapsible from '..';

describe('Collapsible component', () => {
  it('renders with title', () => {
    cy.renderComponent(
      <Collapsible title="Test Title" open={false}>
        <div>Test Content</div>
      </Collapsible>,
    );
    cy.getById('collapsible-header').should('have.text', 'Test Title');
    cy.screenshot('renders with title and description');
  });

  it('toggles open/close when header is clicked', () => {
    cy.renderComponent(
      <Collapsible title="Test Title" open={false}>
        <div>Test Content</div>
      </Collapsible>,
    );

    cy.getById('toggle-collapsible-btn').click();
    cy.getById('collapsible-content').should('contain', 'Test Content');
    cy.getById('toggle-collapsible-btn').click();
    cy.getById('collapsible-content').should('not.be.visible', 'Test Content');
  });
});
