import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';

describe('Text Component', () => {
  it('should render simple text correctly', () => {
    cy.renderComponent(<Text data-test-id="custom-text">Simple text</Text>);
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').should('have.text', 'Simple text');
    cy.screenshot('Should render simple text');
  });

  it('should render bold text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" bold>
        Bold text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').should('have.text', 'Bold text');
    cy.getById('custom-text').invoke('attr', 'class').should('include', 'bold');
    cy.screenshot('Should render bold text');
  });

  it('should render italic text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" italic>
        Italic text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').should('have.text', 'Italic text');
    cy.getById('custom-text')
      .invoke('attr', 'class')
      .should('include', 'italic');
    cy.screenshot('Should render italic text');
  });

  it('should render underlined text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" underline>
        Underline text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').should('have.text', 'Underline text');
    cy.getById('custom-text')
      .invoke('attr', 'class')
      .should('include', 'underline');
    cy.screenshot('Should render underline text');
  });

  it('should render h1 text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" type="h1">
        Header text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').invoke('attr', 'class').should('include', 'h1');
    cy.screenshot('Should render h1 text');
  });

  it('should render h3 text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" type="h3">
        Subheader text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text').invoke('attr', 'class').should('include', 'h3');
    cy.screenshot('Should render h3 text');
  });

  it('should render success text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" variant="success">
        Success text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text')
      .invoke('attr', 'class')
      .should('include', 'success');
    cy.screenshot('Should render success text');
  });

  it('should render error text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" variant="error">
        Error text
      </Text>,
    );
    cy.getById('custom-text').should('be.visible');
    cy.getById('custom-text')
      .invoke('attr', 'class')
      .should('include', 'error');
    cy.screenshot('Should render error text');
  });

  it('should render link text correctly', () => {
    cy.renderComponent(
      <Text data-test-id="custom-text" link="/text-link">
        Link text
      </Text>,
    );
    cy.getById('custom-text')
      .should('be.visible')
      .and('have.text', 'Link text');
    cy.getById('custom-text').invoke('attr', 'class').should('include', 'link');
    cy.screenshot('Should render link text');
  });
});
