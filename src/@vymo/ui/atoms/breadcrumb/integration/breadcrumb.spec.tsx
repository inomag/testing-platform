import React from 'react';
import Breadcrumb from 'src/@vymo/ui/atoms/breadcrumb';

describe('Breadcrumb Component', () => {
  it('should render simple breadcrumb correctly', () => {
    const items = [
      {
        path: '/home',
        title: 'Home',
      },
      {
        path: '/products',
        title: 'Products',
      },
      {
        title: 'Menu item 1',
        menu: [
          { value: '1', label: 'Menu item 1' },
          { value: '2', label: 'Menu item 2' },
          { value: '3', label: 'Menu item 3' },
        ],
      },
    ];

    cy.renderComponent(
      <Breadcrumb className="custom-breadcrumb" items={items} />,
    );
    cy.getById('breadcrumb').should('be.visible');
    cy.getById('breadcrumb').within(() => {
      cy.getById('breadcrumb-item').should('have.length', items.length);
    });
    cy.screenshot('should render simple breadcrumb correctly');
  });

  it('should display breadcrumb menu on hover', () => {
    cy.renderComponent(
      <Breadcrumb
        data-test-id="custom-breadcrumb"
        className="custom-breadcrumb"
        items={[
          {
            path: '/home',
            title: 'Home',
          },
          {
            path: '/products',
            title: 'Products',
          },
          {
            title: 'Menu item 1',
            menu: [
              { value: '1', label: 'Menu item 1' },
              { value: '2', label: 'Menu item 2' },
              { value: '3', label: 'Menu item 3' },
            ],
          },
        ]}
      />,
    );
    cy.getById('custom-breadcrumb').should('be.visible');
    cy.getById('custom-breadcrumb-menu-item')
      .should('be.visible')
      .trigger('mouseover');
    cy.getById('custom-breadcrumb-menu-container').should('be.visible');
    cy.getById('custom-breadcrumb-menu-item').trigger('mouseout');
    cy.getById('custom-breadcrumb-menu-container').should('not.exist');
    cy.screenshot('should display breadcrumb menu on hover');
  });

  it('on clicking menu item, it should update the name', () => {
    const items = [
      {
        path: '/home',
        title: 'Home',
      },
      {
        path: '/products',
        title: 'Products',
      },
      {
        title: 'Menu item 1',
        menu: [
          { value: '1', label: 'Menu item 1' },
          { value: '2', label: 'Menu item 2' },
          { value: '3', label: 'Menu item 3' },
        ],
      },
    ];

    cy.renderComponent(
      <Breadcrumb
        data-test-id="custom-breadcrumb"
        className="custom-breadcrumb"
        items={items}
      />,
    );

    cy.getById('custom-breadcrumb').should('be.visible');
    cy.getById('custom-breadcrumb-menu-item')
      .should('be.visible')
      .and('have.text', 'Menu item 1')
      .trigger('mouseover');
    cy.getById('custom-breadcrumb-menu-container')
      .should('be.visible')
      .within(() => {
        cy.getById('custom-breadcrumb-menu-container-item').should(
          'have.length',
          3,
        );
        cy.getById('custom-breadcrumb-menu-container-item').eq(1).click();
      });
    cy.getById('custom-breadcrumb-menu-item')
      .should('be.visible')
      .and('have.text', 'Menu item 2');
    cy.screenshot('on clicking menu item, it should update the name');
  });

  it('should render breadcrumb with given separator', () => {
    const items = [
      {
        title: 'Home',
        className: 'home-item',
      },
      {
        title: 'Products',
        className: 'products-item',
      },
    ];

    cy.renderComponent(
      <Breadcrumb
        data-test-id="custom-breadcrumb"
        items={items}
        separator="-"
      />,
    );
    cy.getById('custom-breadcrumb').should('be.visible');
    cy.get('[data-test-id="custom-breadcrumb"] > div + span')
      .should('be.visible')
      .and('have.text', '-');
    cy.screenshot('should render breadcrumb with given separator');
  });

  it('should call the onClick function when a breadcrumb item is clicked', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    const items = [
      {
        title: 'Home',
        className: 'home-item',
        onClick: onClickSpy,
      },
      {
        title: 'Products',
        className: 'products-item',
      },
    ];

    cy.renderComponent(
      <Breadcrumb data-test-id="custom-breadcrumb" items={items} />,
    );
    cy.getById('custom-breadcrumb').should('be.visible');
    cy.get('.home-item').should('be.visible').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
    cy.screenshot(
      'should call the onClick function when a breadcrumb item is clicked',
    );
  });

  it('should trigger onClick with Enter key', () => {
    const onClickSpy = cy.spy().as('onClick');
    const items = [
      {
        path: '/home',
        title: 'Home',
      },
      {
        path: '/products',
        title: 'Products',
        onClick: onClickSpy,
      },
      {
        path: '/menu1',
        title: 'Menu item 1',
        menu: [
          { value: '1', label: 'Menu item 1' },
          { value: '2', label: 'Menu item 2' },
          { value: '3', label: 'Menu item 3' },
        ],
      },
    ];

    cy.renderComponent(
      <Breadcrumb data-test-id="custom-breadcrumb" items={items} />,
    );
    cy.getById('custom-breadcrumb').should('be.visible');
    cy.getById('custom-breadcrumb-item')
      .should('be.visible')
      .eq(1)
      .within(() => {
        cy.get('a').focus().type('{enter}');
      });
    cy.get('@onClick').should('have.been.calledOnce');
    cy.screenshot('should trigger onClick with Enter key');
  });
});
