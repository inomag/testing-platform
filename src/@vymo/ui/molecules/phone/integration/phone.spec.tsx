import React from 'react';
import PhoneLegacy from 'src/@vymo/ui/molecules/phone/legacy';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CountryCode } from 'libphonenumber-js';
import Phone from '..';

describe('Phone Component', () => {
  it('should render the basic phone component', () => {
    cy.renderComponent(<PhoneLegacy data-test-id="custom-phone" />);
    cy.getById('custom-phone').should('be.visible');
  });

  it('should render the phone component with label', () => {
    cy.renderComponent(
      <PhoneLegacy data-test-id="custom-phone" label="Mobile Number" />,
    );
    cy.getById('custom-phone').should('be.visible');
  });

  it('should render the phone component with subMessage', () => {
    cy.renderComponent(
      <PhoneLegacy data-test-id="custom-phone" subMessage="Sub message" />,
    );
    cy.getById('custom-phone').should('be.visible');
    cy.getById('custom-phone-subMessage').should('be.visible');
    cy.getById('custom-phone-subMessage').should('have.text', 'Sub message');
  });

  it('should render the phone component with subMessage and label', () => {
    cy.renderComponent(
      <PhoneLegacy
        data-test-id="custom-phone"
        label="Mobile Number"
        subMessage="Sub message"
      />,
    );
    cy.getById('custom-phone').should('be.visible');
    cy.getById('custom-phone-subMessage').should('be.visible');
    cy.getById('custom-phone-subMessage').should('have.text', 'Sub message');
  });

  it('should render the phone component with placeholder', () => {
    cy.renderComponent(
      <PhoneLegacy
        data-test-id="custom-phone"
        placeholder="Enter Mobile Number"
      />,
    );
    cy.getById('custom-phone').should('be.visible');
    cy.getById('custom-phone').should(
      'have.attr',
      'placeholder',
      'Enter Mobile Number',
    );
  });

  it('should render the phone component with default value', () => {
    cy.renderComponent(
      <PhoneLegacy
        data-test-id="custom-phone"
        defaultCountryCode="IN"
        value="9999999999"
      />,
    );
    cy.getById('custom-phone').should('be.visible');
  });

  it('should render the phone component with different country code', () => {
    cy.renderComponent(
      <PhoneLegacy data-test-id="custom-phone" defaultCountryCode="US" />,
    );
    cy.getById('custom-phone').should('be.visible');
  });

  it('should render read only phone component', () => {
    cy.renderComponent(<PhoneLegacy data-test-id="custom-phone" readOnly />);
    cy.getById('custom-phone').should('be.visible');
    cy.getById('custom-phone').should('have.attr', 'disabled');
  });

  it('should render phone component with two countries', () => {
    cy.renderComponent(
      <PhoneLegacy data-test-id="custom-phone" countries={['IN', 'US']} />,
    );
    cy.getById('custom-phone').should('be.visible');
  });

  it('should render phone component with no country option', () => {
    cy.renderComponent(
      <PhoneLegacy data-test-id="custom-phone" showCountrySelect={false} />,
    );
    cy.getById('custom-phone').should('be.visible');
  });

  it('should show validation error correctly', () => {
    cy.renderComponent(<PhoneLegacy data-test-id="custom-phone" />);
    cy.getById('custom-phone').should('be.visible');
    cy.getById('custom-phone').type('11');
    cy.getById('custom-phone').should('have.value', '11');
    cy.getById('custom-phone-subMessage').should('be.visible');
    cy.getById('custom-phone-subMessage').should(
      'have.text',
      'Please enter a valid phone number.',
    );
  });
  it('should display formatted number as you type', () => {
    const defaultProps = {
      disabled: false,
      value: '',
      countryCallingCode: '+1' as CountryCode,
      countryCodesFilter: ['US', 'IN'],
      onChange: cy.stub(),
      'data-test-id': 'new-phone',
      viewMode: false,
      locale: 'en',
    };

    cy.renderComponent(<Phone {...defaultProps} />);
    cy.get('[data-test-id="new-phone"] input[type="tel"]').type('2345678901');
    cy.get('[data-test-id="new-phone"] input[type="tel"]').should(
      'have.value',
      '(234) 567-8901',
    );
  });
  it('should switch country codes and format accordingly', () => {
    const defaultProps = {
      disabled: false,
      value: '',
      countryCallingCode: '+1' as CountryCode,
      countryCodesFilter: ['US', 'IN'],
      onChange: cy.stub(),
      'data-test-id': 'new-phone',
      viewMode: false,
      locale: 'en',
    };
    cy.renderComponent(<Phone {...defaultProps} />);
    cy.getById('new-phone').getById('new-phone-select-code').click();
    cy.contains('+91').click();
    cy.get('[data-test-id="new-phone"] input[type="tel"]').type('9876543210');
    cy.get('[data-test-id="new-phone"] input[type="tel"]').should(
      'contain.value',
      '98765',
    );
  });
  it('should display read-only Phone component', () => {
    const defaultProps = {
      disabled: true,
      value: '',
      countryCallingCode: '+1' as CountryCode,
      countryCodesFilter: ['US', 'IN'],
      onChange: cy.stub(),
      'data-test-id': 'new-phone',
      viewMode: false,
      locale: 'en',
    };
    cy.renderComponent(<Phone {...defaultProps} />);
    cy.get('[data-test-id="new-phone"] input').should('be.disabled');
  });
  it('should call onChange with formatted number and country code', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    const defaultProps = {
      disabled: false,
      value: '',
      countryCallingCode: '+1' as CountryCode,
      countryCodesFilter: ['US', 'IN'],
      onChange: onChangeSpy,
      'data-test-id': 'new-phone',
      viewMode: false,
      locale: 'en',
    };

    cy.renderComponent(<Phone {...defaultProps} />);

    cy.get('[data-test-id="new-phone"] input[type="tel"]').type('2345678901');

    cy.get('@onChangeSpy').should((stub: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(stub).to.have.been.called;
      expect(stub.lastCall.args[0]).to.equal('(234) 567-8901');
    });
  });
});
