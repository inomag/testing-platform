import React from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import OifWrapper from '..';

// TODO : needHelp
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('OifWrapper Component', () => {
  const defaultProps = {
    code: 'test_code',
    oifOptions: {
      url: '/test-url',
      params: [{ name: 'test_code', code: 'test_code' }],
    },
    onChange: () => {},
    appendFieldsAtCode: () => {},
    isElementDropdownType: false,
    value: '',
    type: '',
    'data-test-id': 'test-oifWrapper',
  };

  it('should render OifWrapper correctly', () => {
    cy.renderComponent(
      <OifWrapper {...defaultProps}>
        <Input />
      </OifWrapper>,
    );
    cy.getById('child-component').should('exist');
  });

  it('should display the Loader when loading', () => {
    const isLoadingProps = { ...defaultProps, isLoading: true };
    cy.renderComponent(
      <OifWrapper {...isLoadingProps}>
        <Input />
      </OifWrapper>,
    );
    cy.get('.loader').should('be.visible');
  });

  it('should render the fetch button when not loading', () => {
    cy.renderComponent(
      <OifWrapper {...defaultProps}>
        <Input />
      </OifWrapper>,
    );
    cy.getById('fetch-oif-button').should('exist');
  });

  it('should call fetchOifData when fetch button is clicked', () => {
    cy.renderComponent(
      <OifWrapper {...defaultProps}>
        <Input />
      </OifWrapper>,
    );
    cy.getById('fetch-oif-button').click();
    cy.wrap(defaultProps.appendFieldsAtCode).should('be.called');
  });

  it('should call onChange when child component changes', () => {
    const childProps = {
      ...defaultProps,
      children: <Input />,
    };
    cy.renderComponent(<OifWrapper {...childProps} />);
    cy.getById('child-input').type('New Value');
    cy.wrap(defaultProps.onChange).should('be.called');
  });

  it('should handle different element types correctly', () => {
    const dropdownProps = {
      ...defaultProps,
      isElementDropdownType: true,
      value: 'test',
    };
    cy.renderComponent(
      <OifWrapper {...dropdownProps}>
        <div id="child-component" />
      </OifWrapper>,
    );
    cy.getById('child-component').should('exist');
  });

  it('should call fetchOifData on mount if value is present and not dropdown type', () => {
    const fetchProps = {
      ...defaultProps,
      value: 'test-value',
    };
    cy.renderComponent(
      <OifWrapper {...fetchProps}>
        <div id="child-component" />
      </OifWrapper>,
    );
    cy.wrap(defaultProps.appendFieldsAtCode).should('be.called');
  });

  it('should call fetchOifData when value changes and element is dropdown type', () => {
    const fetchProps = {
      ...defaultProps,
      isElementDropdownType: true,
      value: 'test-value',
    };
    cy.renderComponent(
      <OifWrapper {...fetchProps}>
        <div id="child-component" />
      </OifWrapper>,
    );
    cy.wrap(defaultProps.appendFieldsAtCode).should('be.called');
  });

  it('should display the sub message correctly', () => {
    const subMessage = 'This is a sub message';
    const subMessageProps = { ...defaultProps, subMessage };
    cy.renderComponent(
      <OifWrapper {...subMessageProps}>
        <div id="child-component" />
      </OifWrapper>,
    );
    cy.getById('test-oifWrapper-subMessage')
      .should('exist')
      .and('contain.text', subMessage);
  });

  it('should apply custom classNames', () => {
    const customClass = 'custom-class';
    const customClassProps = { ...defaultProps, classNames: customClass };
    cy.renderComponent(
      <OifWrapper {...customClassProps}>
        <div id="child-component" />
      </OifWrapper>,
    );
    cy.get(`.${customClass}`).should('exist');
  });
});
