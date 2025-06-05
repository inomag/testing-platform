import React from 'react';
import Loader from 'src/@vymo/ui/atoms/loader';

describe('Loader Component', () => {
  it('should render simple loader correctly', () => {
    cy.renderComponent(<Loader />);
    cy.getById('loader').should('be.visible');
    cy.screenshot('Should render simple loader');
  });

  it('should render simple blue color loader correctly', () => {
    cy.renderComponent(<Loader color="blue" />);
    cy.getById('loader').should('be.visible');
    cy.getById('loader').within(() => {
      cy.get('svg').should('be.visible');
      cy.get('svg').should('have.attr', 'stroke', 'blue');
    });
    cy.screenshot('Should render blue color loader');
  });

  it('should render loader with children correctly', () => {
    cy.renderComponent(
      <Loader>
        <div>
          <p>Content</p>
        </div>
      </Loader>,
    );
    cy.getById('loader').should('be.visible');
    cy.screenshot('Should render loader with children');
  });

  it('should render full page loader correctly', () => {
    cy.renderComponent(
      <Loader fullPage>
        <div>
          <p>Content</p>
        </div>
      </Loader>,
    );
    cy.getById('loader').should('be.visible');
    cy.screenshot('Should render full page loader');
  });

  it('should render large size loader correctly', () => {
    cy.renderComponent(<Loader size="large" />);
    cy.getById('loader').should('be.visible');
    cy.screenshot('Should render large size loader');
  });

  it('should render loader after 3 seconds correctly', () => {
    cy.renderComponent(<Loader delay={3000} />);
    cy.getById('loader').should('be.visible');
    cy.screenshot('Should render loader after 3 seconds');
  });
});
