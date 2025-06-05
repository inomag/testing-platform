import React from 'react';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';

describe('SkeletonLoader Component', () => {
  it('should render avtar SkeletonLoader correctly', () => {
    cy.renderComponent(<SkeletonLoader data-test-id="custom-skeleton" avtar />);
    cy.getById('custom-skeleton-avtar').should('be.visible');
    cy.screenshot('should render avtar SkeletonLoader correctly');
  });

  it('should render lines SkeletonLoader correctly', () => {
    cy.renderComponent(
      <SkeletonLoader data-test-id="custom-skeleton" lines={2} />,
    );
    cy.getById('custom-skeleton-lines')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-skeleton-line')
          .should('be.visible')
          .and('have.length', 2);
      });
    cy.screenshot('should render lines SkeletonLoader correctly');
  });
});
