import React from 'react';
import Input from 'src/@vymo/ui/atoms/input';

describe('Input Component', () => {
  it('should render simple input correctly', () => {
    cy.renderComponent(<Input data-test-id="custom-input" />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.screenshot('Should render simple input field');
  });

  it('should render input with label correctly', () => {
    cy.renderComponent(<Input data-test-id="custom-input" label="Name" />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input-label').should('be.visible');
    cy.getById('custom-input-label').should('have.text', 'Name');
    cy.screenshot('Should render input with label');
  });

  it('should render number input with label correctly', () => {
    cy.renderComponent(
      <Input data-test-id="custom-input" label="Age" type="number" />,
    );
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input')
      .should('have.attr', 'type', 'text')
      .and('have.attr', 'inputmode', 'numeric');
    cy.getById('custom-input-label').should('be.visible');
    cy.getById('custom-input-label').should('have.text', 'Age');
    cy.screenshot('Should render number input with label');
  });

  it('should render email input correctly', () => {
    cy.renderComponent(<Input data-test-id="custom-input" type="email" />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'email');
    cy.screenshot('Should render email input');
  });

  it('should render simple input with placeholder correctly', () => {
    cy.renderComponent(
      <Input data-test-id="custom-input" placeholder="Enter your name" />,
    );
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input').should(
      'have.attr',
      'placeholder',
      'Enter your name',
    );
    cy.screenshot('Should render input with placeholder');
  });

  it('should render input with subMessage correctly', () => {
    cy.renderComponent(
      <Input data-test-id="custom-input" subMessage={<p>Sub message</p>} />,
    );
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input-subMessage').should('be.visible');
    cy.getById('custom-input-subMessage').should('have.text', 'Sub message');
    cy.screenshot('Should render input with sub message');
  });

  it('should render input with value correctly', () => {
    cy.renderComponent(
      <Input data-test-id="custom-input" value="Default Value" />,
    );
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input').should('have.attr', 'value', 'Default Value');
    cy.screenshot('Should render input with value');
  });

  it('should render disabled input correctly', () => {
    cy.renderComponent(<Input data-test-id="custom-input" disabled />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input').should('have.attr', 'disabled');
    cy.screenshot('Should render disabled input');
  });

  it('should type value in input field correctly', () => {
    cy.renderComponent(<Input data-test-id="custom-input" />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').should('have.attr', 'type', 'text');
    cy.getById('custom-input').type('New value');
    cy.getById('custom-input').should('have.value', 'New value');
    cy.screenshot('Should render input field with typed value');
  });

  it('should clear input value on clicking cross icon', () => {
    cy.renderComponent(<Input data-test-id="custom-input" />);
    cy.getById('custom-input').should('be.visible');
    cy.getById('custom-input').type('New value');
    cy.getById('custom-input').should('have.value', 'New value');
    cy.getById('custom-input').trigger('mouseover');
    cy.getById('custom-input-icon').click();
    cy.getById('custom-input').should('have.value', '');
    cy.screenshot('Should clear value on clicking cross icon');
  });
});
