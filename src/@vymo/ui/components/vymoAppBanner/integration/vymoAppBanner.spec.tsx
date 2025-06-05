import React from 'react';
import VymoAppBanner from '..';

describe('VymoAppBanner', () => {
  it('should display the banner initially', () => {
    cy.renderComponent(<VymoAppBanner />);
    cy.getById('vymo-app-banner').should('be.visible');
    cy.getById('vymo-app-banner-icon-container').should('be.visible');
    cy.getById('vymo-app-banner-button')
      .should('be.visible')
      .and('have.text', 'Open App');
  });

  it('should hide the banner when the close button is clicked', () => {
    cy.renderComponent(<VymoAppBanner data-test-id="custom-vymo-banner" />);
    cy.getById('custom-vymo-banner').should('be.visible');
    cy.getById('custom-vymo-banner-icon-container')
      .should('be.visible')
      .within(() => {
        cy.get('[class*="vymoAppBanner_appBanner__icon__close"]')
          .should('be.visible')
          .click();
        cy.getById('custom-vymo-banner').should('not.exist');
      });
  });

  it('should open the app when the Open App button is clicked', () => {
    const openAppUrl =
      'https://play.google.com/store/apps/details?id=com.abc.android';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('openApp');
    });

    cy.renderComponent(<VymoAppBanner data-test-id="custom-vymo-banner" />);
    cy.getById('custom-vymo-banner').should('be.visible');
    cy.getById('custom-vymo-banner-button')
      .should('be.visible')
      .click()
      .get('@openApp')
      .should('have.been.calledWith', openAppUrl);
  });

  it('should display the correct text in the banner', () => {
    cy.renderComponent(<VymoAppBanner data-test-id="custom-vymo-banner" />);
    cy.getById('custom-vymo-banner').should('be.visible');
    cy.getById('custom-vymo-banner-icon-container')
      .should('be.visible')
      .within(() => {
        cy.get('[class*="text_text__h5"]')
          .should('be.visible')
          .and('have.text', ' Vymo ');
      });
  });

  it('should display the app icon', () => {
    cy.renderComponent(<VymoAppBanner data-test-id="custom-vymo-banner" />);
    cy.getById('custom-vymo-banner').should('be.visible');
    cy.getById('custom-vymo-banner-icon-container')
      .should('be.visible')
      .within(() => {
        cy.get('svg').should('be.visible').and('have.length', 2);
      });
  });
});
