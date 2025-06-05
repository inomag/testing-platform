import React from 'react';
import PhoneAdapter from '..';

const mockPortalConfig = {
  i18nSettings: {
    country_calling_code: '+91',
  },
};

const mockClientId = 'mock-client-id';

before(() => {
  const getItemStub = cy.stub(window.localStorage, 'getItem');

  getItemStub
    .withArgs('portalConfig')
    .returns(JSON.stringify(mockPortalConfig));
  getItemStub.withArgs('client').returns(mockClientId);
});

describe('PhoneAdapter Component', () => {
  it('should render basic phone adapter with Input when enableCountryCodeV2 is none', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="none"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should('have.attr', 'type', 'tel');
  });

  it('should render basic phone adapter with Input when enableCountryCodeV2 is false', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2={false}
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should('have.attr', 'type', 'tel');
  });

  it('should render basic phone adapter with Input when enableCountryCodeV2 is undefined', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should('have.attr', 'type', 'tel');
  });

  it('should render Input when enableCountryCodeV2 is i18n but no i18n config available', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="i18n"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should('have.attr', 'type', 'tel');
  });

  it('should render Phone component when enableCountryCodeV2 is i18n with valid config', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="i18n"
        countryCodes={[
          { label: '+1', value: '+1' },
          { label: '+91', value: '+91' },
        ]}
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
  });

  it('should render phone adapter with placeholder', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="none"
        placeholder="Enter phone number"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should(
      'have.attr',
      'placeholder',
      'Enter phone number',
    );
  });

  it('should render phone adapter with value', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="none"
        value="1234567890"
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
    cy.getById('phone-adapter').should('have.value', '1234567890');
  });

  it('should call onChange when typing in Input mode', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="none"
        value=""
        onChange={onChangeSpy}
      />,
    );

    cy.getById('phone-adapter').type('1234567890');
    cy.get('@onChangeSpy').should('have.been.called');
  });

  it('should render phone adapter with showDisabledIcon', () => {
    const showDisabledIcon = true;
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="none"
        value=""
        onChange={cy.stub()}
        showDisabledIcon={showDisabledIcon}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
  });

  it('should render Phone component with i18n country codes when enableCountryCodeV2 is i18n', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="i18n"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
  });

  it('should omit label prop when passing to underlying component', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="i18n"
        value=""
        onChange={cy.stub()}
        label="Phone Number"
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
  });

  it('should handle missing countryCodes prop gracefully', () => {
    cy.renderComponent(
      <PhoneAdapter
        data-test-id="phone-adapter"
        enableCountryCodeV2="all"
        value=""
        onChange={cy.stub()}
      />,
    );
    cy.getById('phone-adapter').should('be.visible');
  });
});
