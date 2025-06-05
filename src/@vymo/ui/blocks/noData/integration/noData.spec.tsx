import React from 'react';
import NoData from 'src/@vymo/ui/blocks/noData';

describe('NoData Component', () => {
  it('should render noData with default message correctly', () => {
    cy.renderComponent(<NoData />);
    cy.getById('noDataMessage').should('be.visible').contains('No Data');
    cy.screenshot('Should render no data with default message');
  });

  it('should render no data with custom message correctly', () => {
    cy.renderComponent(<NoData message="Custom No Data Message" />);
    cy.getById('noDataMessage')
      .should('be.visible')
      .contains('Custom No Data Message');
    cy.screenshot('Should render no data with custom message');
  });
});
