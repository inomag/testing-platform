import React from 'react';
import Group from 'src/@vymo/ui/molecules/form/vymoComponentsWithForm/group';

describe('Group Component', () => {
  it('should render simple group component correctly', () => {
    cy.renderComponent(
      <Group
        groupTitle="Sample title"
        code="random_code"
        deleteFieldsAtCode={() => {}}
      >
        <div>
          <p>Group child</p>
        </div>
      </Group>,
    );
    cy.getById('collapsible-component').should('be.visible');
    cy.getById('group-collapsible-title').should('have.text', 'Sample title');
    cy.screenshot('Should render group component');
  });

  it('should render the group component children on clicking', () => {
    cy.renderComponent(
      <Group
        groupTitle="Sample title"
        code="random_code"
        deleteFieldsAtCode={() => {}}
      >
        <div>
          <p>Group child</p>
        </div>
      </Group>,
    );
    cy.getById('collapsible-component').should('be.visible');
    cy.getById('group-collapsible-title').should('have.text', 'Sample title');
    cy.getById('group-collapsible').click();
    cy.getById('collapsible-content').should('be.visible');
    cy.screenshot('Should render group component children');
  });
});
