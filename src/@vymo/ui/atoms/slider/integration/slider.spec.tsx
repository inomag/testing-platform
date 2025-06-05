import React from 'react';
import Slider from 'src/@vymo/ui/atoms/slider';

describe('Slider Component', () => {
  it('should render default linear slider correctly', () => {
    cy.renderComponent(<Slider data-test-id="slider" />);
    cy.getById('linear-slider').should('be.visible');
    cy.getById('linear-slider-input').should('exist').and('have.value', '50');
    cy.getById('linear-slider-text')
      .should('be.visible')
      .and('have.text', '50 %');
    cy.screenshot('should render default linear slider correctly');
  });

  it('should render linear slider with min and max values correctly', () => {
    cy.renderComponent(
      <Slider
        data-test-id="slider"
        type="linear"
        min={0}
        max={60}
        value={30}
      />,
    );
    cy.getById('linear-slider').should('be.visible');
    cy.getById('linear-slider-input')
      .should('exist')
      .and('have.value', '30')
      .and('have.attr', 'min', '0')
      .and('have.attr', 'max', '60');
    cy.getById('linear-slider-text')
      .should('be.visible')
      .and('have.text', '30 %');
    cy.screenshot(
      'should render linear slider with min and max values correctly',
    );
  });

  it('should render angle slider correctly', () => {
    cy.renderComponent(<Slider data-test-id="slider" type="angle" />);
    cy.getById('angle-slider').should('be.visible');
    cy.getById('angle-slider-input').should('exist').and('have.value', '50');
    cy.getById('angle-slider-text')
      .should('be.visible')
      .and('have.text', '50 %');
    cy.screenshot('should render angle slider correctly');
  });

  it('should render angle slider with min and max values correctly', () => {
    cy.renderComponent(
      <Slider data-test-id="slider" type="angle" min={0} max={60} value={30} />,
    );
    cy.getById('angle-slider').should('be.visible');
    cy.getById('angle-slider-input')
      .should('exist')
      .and('have.value', '30')
      .and('have.attr', 'min', '0')
      .and('have.attr', 'max', '60');
    cy.getById('angle-slider-text')
      .should('be.visible')
      .and('have.text', '30 %');
    cy.screenshot(
      'should render angle slider with min and max values correctly',
    );
  });
});
