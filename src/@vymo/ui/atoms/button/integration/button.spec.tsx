import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';

describe('Button Component', () => {
  it('should render simple button correctly', () => {
    cy.renderComponent(<Button data-test-id="custom-button">Button</Button>);
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium');
    cy.screenshot('Should render simple button');
  });

  it('should render outlined button of large size correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" type="outlined" size="large">
        Button
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'outlined')
      .and('include', 'large');
    cy.screenshot('Should render large outlined button');
  });

  it('should render link button of large size correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" type="link" size="large">
        Button
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'link')
      .and('include', 'large');
    cy.screenshot('Should render large link button');
  });

  it('should render text button of medium size correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" type="text" size="medium">
        Button
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'text')
      .and('include', 'medium');
    cy.screenshot('Should render medium text button');
  });

  it('should render success button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" variant="success">
        Success
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'success');
    cy.screenshot('Should render success button');
  });

  it('should render warning button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" variant="warning">
        Warning
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'warning');
    cy.screenshot('Should render warning button');
  });

  it('should render danger button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" variant="danger">
        Danger
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'danger');
    cy.screenshot('Should render danger button');
  });

  it('should render success rounded button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" variant="success" rounded>
        Success
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'success')
      .and('include', 'rounded');
    cy.screenshot('Should render success rounded button');
  });

  it('should render disabled button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" disabled>
        Disabled
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'disabled');
    cy.screenshot('Should render disabled button');
  });

  it('should render default loading button correctly', () => {
    cy.renderComponent(
      <Button data-test-id="custom-button" loading>
        Button
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium')
      .and('include', 'disabled');
    cy.screenshot('Should render loading button');
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = cy.stub().as('handleClick');

    cy.renderComponent(
      <Button data-test-id="custom-button" onClick={handleClick}>
        Click Me
      </Button>,
    );
    cy.getById('custom-button').should('be.visible');
    cy.getById('custom-button')
      .invoke('attr', 'class')
      .should('include', 'primary')
      .and('include', 'medium');
    cy.getById('custom-button').click();
    cy.get('@handleClick').should('have.been.calledOnce');
    cy.screenshot('Should call onClick when clicked');
  });
});
