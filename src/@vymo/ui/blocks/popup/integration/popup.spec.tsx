import React from 'react';
import Popup from 'src/@vymo/ui/blocks/popup';

describe('Popup Component', () => {
  it('should render default popup correctly', () => {
    cy.renderComponent(
      <Popup content={<div>Popup content</div>}>
        <div>Click me</div>
      </Popup>,
    );
    cy.getById('popup').should('be.visible').and('have.text', 'Click me');
  });

  it('on click, it should open popup content', () => {
    cy.renderComponent(
      <Popup data-test-id="custom-popup" content={<div>Popup content</div>}>
        <div>Click me</div>
      </Popup>,
    );
    cy.getById('custom-popup')
      .should('be.visible')
      .and('have.text', 'Click me')
      .click();
    cy.getById('custom-popup-content').should('be.visible');
  });

  it('on clicking again, it should close popup content', () => {
    cy.renderComponent(
      <Popup data-test-id="custom-popup" content={<div>Popup content</div>}>
        <div>Click me</div>
      </Popup>,
    );
    cy.getById('custom-popup')
      .should('be.visible')
      .and('have.text', 'Click me')
      .click();
    cy.getById('custom-popup-content').should('be.visible');
    cy.getById('custom-popup').click();
    cy.getById('custom-popup-content').should('not.exist');
  });

  it('should close popup content on clicking outside popup content', () => {
    cy.renderComponent(
      <Popup data-test-id="custom-popup" content={<div>Popup content</div>}>
        <div>Click me</div>
      </Popup>,
    );
    cy.getById('custom-popup')
      .should('be.visible')
      .and('have.text', 'Click me')
      .click();
    cy.getById('custom-popup-content').should('be.visible');
    cy.get('body').click(0, 0);
    cy.getById('custom-popup-content').should('not.exist');
  });

  it('on click, it should open popup content on left side', () => {
    cy.renderComponent(
      <Popup
        data-test-id="custom-popup"
        content={<div>Popup content</div>}
        placement="left"
      >
        <div>Click me</div>
      </Popup>,
    );
    cy.getById('custom-popup')
      .should('be.visible')
      .and('have.text', 'Click me')
      .click();
    cy.getById('custom-popup-content')
      .should('be.visible')
      .invoke('attr', 'style')
      .should('include', 'left');
  });
});
