import React from 'react';
import CountryCodeDropdown from 'src/@vymo/ui/molecules/countryDropdown';

describe('CountryCodeDropdown Component', () => {
  it('should render simple countryDropdown correctly', () => {
    cy.renderComponent(
      <CountryCodeDropdown
        data-test-id="custom-select"
        selectedCode="+1"
        onCodeChange={() => {}}
      />,
    );
    cy.getById('custom-select').should('be.visible');
    cy.getById('custom-select').should('have.text', 'USA (+1)');
    cy.screenshot('Should render simple countryDropdown');
  });
});
