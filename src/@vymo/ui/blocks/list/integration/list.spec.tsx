import React from 'react';
import List from 'src/@vymo/ui/blocks/list';

describe('List Component', () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  it('should render the list with correct number of items', () => {
    cy.renderComponent(
      <List>
        {items.map((item) => (
          <List.Item>{item}</List.Item>
        ))}
      </List>,
    );
    cy.getById('list')
      .should('be.visible')
      .within(() => {
        cy.getById('list-item').should('have.length', items.length);
      });
  });

  it('should trigger onItemClick when an item is clicked', () => {
    const onItemClickSpy = cy.spy().as('onItemClickSpy');
    cy.renderComponent(
      <List data-test-id="custom-list" onItemClick={onItemClickSpy}>
        {items.map((item) => (
          <List.Item>{item}</List.Item>
        ))}
      </List>,
    );
    cy.getById('custom-list').should('be.visible');
    cy.getById('custom-list-item').should('be.visible').eq(1).click();
    cy.get('@onItemClickSpy').should('have.been.calledOnce');
  });

  it('should update the hover index when arrow keys are pressed', () => {
    cy.renderComponent(
      <List data-test-id="custom-list">
        {items.map((item) => (
          <List.Item>{item}</List.Item>
        ))}
      </List>,
    );
    cy.getById('custom-list')
      .should('be.visible')
      .trigger('keydown', { key: 'ArrowDown' });
    cy.getById('custom-list-item')
      .eq(1)
      .should('be.visible')
      .invoke('attr', 'class')
      .should('include', 'hover');
    cy.getById('custom-list').trigger('keydown', { key: 'ArrowUp' });
    cy.getById('custom-list-item')
      .eq(0)
      .should('be.visible')
      .invoke('attr', 'class')
      .should('include', 'hover');
  });

  it('should highlight the selected item when showSelected is true', () => {
    cy.renderComponent(
      <List data-test-id="custom-list" selectedIndex={1} showSelected>
        {items.map((item) => (
          <List.Item>{item}</List.Item>
        ))}
      </List>,
    );
    cy.getById('custom-list').should('be.visible');
    cy.getById('custom-list-item')
      .eq(1)
      .invoke('attr', 'class')
      .should('include', 'selected');
  });

  it('should change hover state correctly on mouse hover', () => {
    cy.renderComponent(
      <List data-test-id="custom-list">
        {items.map((item) => (
          <List.Item>{item}</List.Item>
        ))}
      </List>,
    );
    cy.getById('custom-list').should('be.visible');
    cy.getById('custom-list-item')
      .should('be.visible')
      .eq(1)
      .trigger('mouseover')
      .invoke('attr', 'class')
      .should('include', 'hover');
  });
});
