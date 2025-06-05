import React from 'react';
import Carousel from 'src/@vymo/ui/blocks/carousel';

describe('Carousel Component', () => {
  it('should render simple carousel correctly', () => {
    cy.renderComponent(<Carousel slides={['']} />);
    cy.getById('carousel')
      .should('be.visible')
      .within(() => {
        cy.getById('carousel-slide').should('be.visible').and('have.length', 1);
      });
    cy.screenshot('should render simple carousel correctly');
  });

  it('should render carousel without arrows and dots correctly', () => {
    cy.renderComponent(
      <Carousel
        data-test-id="custom-carousel"
        slides={['', '', '', '']}
        showNavArrows={false}
        showNavDots={false}
      />,
    );
    cy.getById('custom-carousel')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-slide')
          .should('be.visible')
          .and('have.length', 4);
      });
    cy.getById('custom-carousel-arrow-left').should('not.exist');
    cy.getById('custom-carousel-arrow-right').should('not.exist');
    cy.getById('custom-carousel-nav-dots').should('not.exist');
    cy.screenshot('should render carousel without arrows and dots correctly');
  });

  it('should render carousel with autoslide correctly', () => {
    cy.renderComponent(
      <Carousel
        data-test-id="custom-carousel"
        slides={['', '', '', '']}
        autoSlide
        autoSlideInterval={1000}
      />,
    );
    cy.getById('custom-carousel').should('be.visible');
    cy.getById('custom-carousel-arrow-left').should('be.visible');
    cy.getById('custom-carousel-arrow-right').should('be.visible');
    cy.getById('custom-carousel-nav-dots').should('be.visible');
    cy.getById('custom-carousel-nav-dots')
      .find('span')
      .should('have.length', 4)
      .and('be.visible');
    cy.screenshot('should render carousel with autoslide correctly');
  });

  it('on click, it should move to next slide correctly', () => {
    cy.renderComponent(
      <Carousel data-test-id="custom-carousel" slides={['', '', '', '']} />,
    );
    cy.getById('custom-carousel').should('be.visible');
    cy.getById('custom-carousel-nav-dots')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-nav-dot')
          .should('be.visible')
          .and('have.length', 4)
          .eq(1)
          .should('be.visible')
          .click()
          .invoke('attr', 'class')
          .should('include', 'activeDot');
      });
    cy.screenshot('on click, it should move to next slide correctly');
  });

  it('on click right arrow, it should move to next slide correctly', () => {
    cy.renderComponent(
      <Carousel data-test-id="custom-carousel" slides={['', '', '', '']} />,
    );
    cy.getById('custom-carousel').should('be.visible');
    cy.getById('custom-carousel-arrow-left').should('be.visible');
    cy.getById('custom-carousel-arrow-right').should('be.visible').click();
    cy.getById('custom-carousel-nav-dots')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-nav-dot')
          .should('have.length', 4)
          .and('be.visible')
          .eq(1)
          .should('be.visible')
          .invoke('attr', 'class')
          .should('include', 'activeDot');
      });
    cy.screenshot(
      'on click right arrow, it should move to next slide correctly',
    );
  });

  it('on click left arrow, it should move to last slide correctly', () => {
    cy.renderComponent(
      <Carousel data-test-id="custom-carousel" slides={['', '', '', '']} />,
    );
    cy.getById('custom-carousel').should('be.visible');
    cy.getById('custom-carousel-arrow-left').should('be.visible').click();
    cy.getById('custom-carousel-nav-dots')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-nav-dot')
          .should('have.length', 4)
          .and('be.visible')
          .eq(3)
          .invoke('attr', 'class')
          .should('include', 'activeDot');
      });
    cy.screenshot(
      'on click left arrow, it should move to last slide correctly',
    );
  });

  it('on click right arrow from last slide, it should move to first slide correctly', () => {
    cy.renderComponent(
      <Carousel data-test-id="custom-carousel" slides={['', '', '', '']} />,
    );
    cy.getById('custom-carousel').should('be.visible');
    cy.getById('custom-carousel-arrow-left').should('be.visible').click();
    cy.getById('custom-carousel-nav-dots')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-nav-dot')
          .should('have.length', 4)
          .eq(3)
          .should('be.visible')
          .invoke('attr', 'class')
          .should('include', 'activeDot');
      });
    cy.getById('custom-carousel-arrow-right').should('be.visible').click();
    cy.getById('custom-carousel-nav-dots')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-carousel-nav-dot')
          .should('have.length', 4)
          .eq(0)
          .should('be.visible')
          .invoke('attr', 'class')
          .should('include', 'activeDot');
      });
    cy.screenshot(
      'on click right arrow from last slide, it should move to first slide correctly',
    );
  });
});
