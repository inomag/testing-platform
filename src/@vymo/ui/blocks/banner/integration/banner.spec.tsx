import React from 'react';
import Banner from 'src/@vymo/ui/blocks/banner';

describe('Banner Component', () => {
  it('should render banner with children and message correctly', () => {
    cy.renderComponent(
      <Banner data-test-id="custom-banner" message="Banner message">
        <div data-test-id="custom-banner-children">
          <h2>Banner heading</h2>
        </div>
      </Banner>,
    );
    cy.getById('custom-banner').should('be.visible');
    cy.getById('custom-banner-children')
      .should('be.visible')
      .and('have.text', 'Banner heading');
    cy.getById('custom-banner-wrapper')
      .should('be.visible')
      .and('have.text', 'Banner message');
    cy.screenshot('should render banner with children and message correctly');
  });
});
