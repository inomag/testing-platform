import React from 'react';
import ListItem from 'src/@vymo/ui/blocks/list/listItem';

describe('ListItem Component', () => {
  it('should render the list item with the correct class based on isSelected and isHover', () => {
    cy.renderComponent(<ListItem isSelected>Item 1</ListItem>);
    cy.getById('list-item')
      .should('be.visible')
      .invoke('attr', 'class')
      .should('include', 'listItem__selected');

    cy.renderComponent(<ListItem isHover>Item 2</ListItem>);
    cy.getById('list-item')
      .should('be.visible')
      .invoke('attr', 'class')
      .should('include', 'listItem__hover');

    cy.renderComponent(
      <ListItem isSelected isHover>
        Item 3
      </ListItem>,
    );
    cy.getById('list-item')
      .should('be.visible')
      .invoke('attr', 'class')
      .should('include', 'listItem__selected')
      .and('include', 'listItem__hover');
  });

  it('should trigger onItemClick when the item is clicked', () => {
    const mockOnItemClick = cy.stub().as('mockOnItemClick');
    cy.renderComponent(
      <ListItem onItemClick={mockOnItemClick}>Item 1</ListItem>,
    );
    cy.getById('list-item').click();
    cy.get('@mockOnItemClick').should('have.been.calledOnce');
  });

  it('should trigger onItemHover when the item is hovered', () => {
    const mockOnItemHover = cy.stub().as('mockOnItemHover');
    cy.renderComponent(
      <ListItem onItemHover={mockOnItemHover}>Item 1</ListItem>,
    );
    cy.getById('list-item').click();
    cy.get('@mockOnItemHover').should('have.been.calledOnce');
  });

  it('should set the correct tabIndex when isSelected is true and false', () => {
    cy.renderComponent(<ListItem isSelected>Item 1</ListItem>);
    cy.getById('list-item').should('have.attr', 'tabindex', '0');

    cy.renderComponent(<ListItem isSelected={false}>Item 2</ListItem>);
    cy.getById('list-item').should('have.attr', 'tabindex', '-1');
  });
});
