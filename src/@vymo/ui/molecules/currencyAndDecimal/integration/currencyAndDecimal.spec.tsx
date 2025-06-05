import React from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import { loadLmsConfig } from 'src/models/auth/lmsLogin/slice';
// eslint-disable-next-line vymo-ui/restrict-import
import { store } from 'src/store';
import CurrencyAndDecimalInput from '..';
import i18nConfig from './i18nConfig.json';

describe('src/@vymo/ui/molecules/currencyAndDecimal/integration/currencyDecimal', () => {
  describe('CurrencyAndDecimalInput Props Validation', () => {
    const defaultProps = {
      code: 'testCode',
      value: undefined,
      disabled: false,
      'data-test-id': 'currency-deciaml-input-test',
      onChange: () => {},
      placeholder: 'Enter value',
      minLength: 0,
      maxLength: 100,
      isCurrency: true,
      validations: [],
      hideValidation: false,
    };
    beforeEach(() => {
      store.dispatch(loadLmsConfig({ i18n_config: i18nConfig }));
    });

    it('should render CurrencyAndDecimalInput correctly', () => {
      cy.renderComponent(<CurrencyAndDecimalInput {...defaultProps} />);
      cy.getById('currency-deciaml-input-test').should('exist');
    });

    it('should display the currency symbol when isCurrency is true', () => {
      cy.renderComponent(<CurrencyAndDecimalInput {...defaultProps} />);
      cy.getById('currency-deciaml-input-test').should(
        'have.attr',
        'placeholder',
        'Enter value',
      );
      cy.getById('currency-deciaml-input-test-icon')
        .should('exist')
        .and('contain.text', '₹');
    });

    it('should not display the currency symbol when isCurrency is false', () => {
      const decimalProps = { ...defaultProps, isCurrency: false };
      cy.renderComponent(<CurrencyAndDecimalInput {...decimalProps} />);
      cy.getById('currency-deciaml-input-test-icon').should('not.exist');
    });

    it('should handle input change correctly for currency input', () => {
      const handleChange = cy.stub();
      cy.renderComponent(
        <CurrencyAndDecimalInput {...defaultProps} onChange={handleChange} />,
      );
      cy.getById('currency-deciaml-input-test').type('123');
      cy.wrap(handleChange).should('be.called');
    });

    it('should apply min and max validation', () => {
      const validationProps = { ...defaultProps, minLength: 2, maxLength: 10 };
      cy.renderComponent(<CurrencyAndDecimalInput {...validationProps} />);
      cy.getById('currency-deciaml-input-test').type('1');
      cy.getById('currency-deciaml-input-test').should('have.value', '1');
    });

    it('should handle placeholder correctly', () => {
      const placeholderProps = { ...defaultProps, placeholder: 'Enter amount' };
      cy.renderComponent(<CurrencyAndDecimalInput {...placeholderProps} />);
      cy.getById('currency-deciaml-input-test').should(
        'have.attr',
        'placeholder',
        'Enter amount',
      );
    });

    it('should hide validation messages when hideValidation is true', () => {
      const hideValidationProps = {
        ...defaultProps,
        hideValidation: true,
        min: 5,
        max: 10,
      };
      cy.renderComponent(<CurrencyAndDecimalInput {...hideValidationProps} />);
      cy.getById('currency-deciaml-input-test').type('1234');
      cy.getById('currency-deciaml-input-test-error-0').should('not.exist');
    });
  });
  describe('CurrencyAndDecimalInput UI Validation', () => {
    it('renders Currency Input', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          isCurrency
          data-test-id="currency"
        />,
      );
      cy.getById('currency').should('be.visible');
      cy.screenshot('renders a currency field');
    });

    it('changes the input value and calls onChange', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          isCurrency
          data-test-id="currency"
          value={123.45}
        />,
      );
      cy.getById('currency').should('have.value', '123.45');
      cy.getById('currency').clear().type('111');
      cy.getById('currency').should('have.value', '111');
      cy.screenshot('renders a currency field with onchange validation');
    });

    it('renders Decimal Input when isCurrency is false', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          data-test-id="decimal"
          isCurrency={false}
        />,
      );
      cy.getById('decimal').should('be.visible');
      cy.screenshot('renders a decimal field');
    });

    it('handles disabled state correctly', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          isCurrency
          data-test-id="currency"
          disabled
        />,
      );
      cy.getById('currency').should('be.disabled');
      cy.screenshot('renders a disabled currency field');
    });

    it('handles min max validation', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          isCurrency
          data-test-id="currency"
          minLength={1}
          maxLength={3}
        />,
      );
      cy.getById('currency').should('be.visible');
      cy.getById('currency').clear().type('11').blur();
      cy.getById('currency-error-0').should('not.exist');
      cy.getById('currency').clear().type('111');
      cy.getById('currency').should('have.value', '111');
      cy.screenshot('renders a currency field with min max validation');
    });

    it('handles decimal format validation', () => {
      cy.renderComponent(
        <CurrencyAndDecimalInput
          code="test"
          onChange={() => {}}
          isCurrency={false}
          data-test-id="decimal"
        />,
      );
      cy.getById('decimal').should('be.visible');
      cy.getById('decimal').clear().type('11.1').blur();
      cy.getById('decimal-error-0').should('not.exist');
      cy.getById('decimal').clear().type('1111.11111').blur();
      cy.getById('decimal-error-0').should('be.visible');
      cy.screenshot('renders a decimal field with format validation');
    });
  });
});
