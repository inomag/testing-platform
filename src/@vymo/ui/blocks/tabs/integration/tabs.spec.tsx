import React from 'react';
import TabLayout from 'src/@vymo/ui/blocks/tabs';

describe('Tab Layout Component', () => {
  it('should render avatar with image correctly', () => {
    cy.renderComponent(
      <TabLayout
        items={[
          {
            key: '1',
            label: 'Tab 1',
            children: <div data-test-id="tab-1-content">Tab 1 Content</div>,
          },
          {
            key: '2',
            label: 'Tab 2',
            children: <div data-test-id="tab-2-content">Tab 2 Content</div>,
          },
        ]}
        defaultKey="1"
        onChange={() => {}}
      />,
    );

    cy.getById('tab-1-content').should('be.visible');
    cy.screenshot('Should render tab layout with default content');
  });

  it('should render tab layout & check on change', () => {
    cy.renderComponent(
      <TabLayout
        data-test-id="tab"
        items={[
          {
            key: '1',
            label: 'Tab 1',
            children: <div data-test-id="tab-1-content">Tab 1 Content</div>,
          },
          {
            key: '2',
            label: 'Tab 2',
            children: <div data-test-id="tab-2-content">Tab 2 Content</div>,
          },
        ]}
        defaultKey="1"
        onChange={() => {}}
      />,
    );

    cy.getById('tab-1-content').should('be.visible');
    cy.getById('tab-2').click();
    cy.getById('tab-2-content').should('be.visible');
    cy.screenshot('Should render tab layout & change content');
  });
});
