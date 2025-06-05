import React from 'react';
import Tag from '../tag';

describe('src/@vymo/ui/atoms/tag/integration/tag.spce.tsx', () => {
  it('renders a tag with close button', () => {
    const onClose = cy.stub().as('onClose');

    cy.renderComponent(
      <Tag closable onClose={onClose} data-test-id="tag">
        Test Tag
      </Tag>,
    );

    cy.getById('tag').should('be.visible');
    cy.getById('tag').should('contain', 'Test Tag');
    cy.getById('tag-close').should('exist').click();
    cy.get('@onClose').should('have.been.calledOnce');
    cy.screenshot('renders a tag with close button');
  });

  it('renders a tag without close button', () => {
    cy.renderComponent(<Tag data-test-id="tag">Test Tag</Tag>);
    cy.getById('tag').should('be.visible');
    cy.getById('tag').should('contain', 'Test Tag');
    cy.getById('.tag__close').should('not.exist');
    cy.screenshot('renders a tag without close button');
  });
});
