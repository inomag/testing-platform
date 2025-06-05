import React from 'react';
import Switch from '..';

describe('Switch component', () => {
  it('should render correctly with default props', () => {
    cy.renderComponent(
      <Switch
        value
        onChange={() => {}}
        disabled={false}
        size="medium"
        data-test-id="switch-test"
        classNames="custom-class"
      />,
    );
    cy.get('[data-test-id="switch-test"]').should('exist');
    cy.get('[data-test-id="switch-test-input"]').should('exist');
  });

  it('should render in "on" state when value is true', () => {
    cy.renderComponent(
      <Switch
        value
        onChange={() => {}}
        disabled={false}
        size="medium"
        data-test-id="switch-test"
        classNames="custom-class"
      />,
    );
    cy.get('[data-test-id="switch-test"]').should(($element) => {
      const classes = $element.attr('class');
      expect(classes).to.include('switch__on');
    });
  });

  it('should trigger onChange handler when clicked', () => {
    cy.renderComponent(
      <Switch
        value
        onChange={() => {}}
        disabled={false}
        size="medium"
        data-test-id="switch-test"
        classNames="custom-class"
      />,
    );
    cy.get('[data-test-id="switch-test-input"]').parent().click();
    // You can add assertions for the expected behavior after the change.
  });

  it('should render with custom classNames', () => {
    cy.renderComponent(
      <Switch
        value
        onChange={() => {}}
        disabled={false}
        size="medium"
        data-test-id="switch-test"
        classNames="custom-class"
      />,
    );
    cy.get('[data-test-id="switch-test"]').should('have.class', 'custom-class');
  });

  it('should apply correct size styles', () => {
    cy.renderComponent(
      <Switch
        value
        onChange={() => {}}
        disabled={false}
        size="medium"
        data-test-id="switch-test"
        classNames="custom-class"
      />,
    );
    cy.get('[data-test-id="switch-test"]').should('have.css', 'width', '32px'); // Medium size width
  });

  // Add more test cases as needed
});
