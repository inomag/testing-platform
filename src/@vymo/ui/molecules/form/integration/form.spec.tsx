/* eslint-disable jest/no-commented-out-tests */
import React from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import { DatePicker } from 'src/@vymo/ui/blocks';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import FormItem from '../formItem';
import Form from '../index';

describe('Form Component', () => {
  it('should initialize the form with the name provided in props', () => {
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={() => {}}>
        <FormItem label="Enter Name" code="name">
          <Input id="form-input" />
        </FormItem>
      </Form>,
      { isStoreRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-name').should('be.visible');
    cy.getById('formItem-name-element').should('be.visible');
    cy.screenshot('Should initialize the form with the name provided in props');
  });

  it('rendering multiple form items', () => {
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={() => {}}>
        <FormItem label="Enter First Name" code="firstName">
          <Input />
        </FormItem>

        <FormItem label="Enter Last Name" code="lastName">
          <Input />
        </FormItem>
      </Form>,
      { isStoreRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-firstName').should('be.visible');
    cy.getById('testForm-formItem-lastName').should('be.visible');
    cy.screenshot('Should render mulitple form items');
  });

  // it('match the response of onchange', () => {
  //   let value = 'test';
  //   const formCallBackFunc = (formData) => {
  //     value = formData.name.value;
  //   };
  //   cy.renderComponent(
  //     <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
  //       <FormItem label="Enter Name" code="name">
  //         <Input id="form-input" />
  //       </FormItem>
  //     </Form>,
  //     { isStoreRequired: false },
  //   );
  //   cy.getById('testForm').should('be.visible');
  //   cy.getById('testForm-formItem-name').should('be.visible');
  //   cy.getById('formItem-name-element').should('be.visible').type('test1');
  //   cy.wait(1000).then(() => {
  //     expect(value).to.eq('test1');
  //   });
  //   cy.screenshot(
  //     'Should match the response of typed and value received in onchange callback',
  //   );
  // });

  // it('checking required property on formitem', () => {
  //   let value = 'test';
  //   const formCallBackFunc = (formData) => {
  //     value = formData.name.value;
  //   };
  //   cy.renderComponent(
  //     <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
  //       <FormItem required label="Enter Name" code="name">
  //         <Input id="form-input" />
  //       </FormItem>
  //     </Form>,
  //     { isStoreRequired: false },
  //   );
  //   cy.getById('testForm').should('be.visible');
  //   cy.getById('testForm-formItem-name').should('be.visible');
  //   cy.getById('formItem-name-element').should('be.visible').type('test');

  //   cy.wait(1000).then(() => {
  //     expect(value).to.eq('test');
  //     cy.getById('formItem-name-element').should('be.visible').clear();
  //     cy.wait(1000).then(() => {
  //       cy.getById('testForm-formItem-name-error').should('be.visible');
  //     });
  //   });
  // });

  // it('validate the value typed in input field', () => {
  //   let value = '';
  //   const formCallBackFunc = (formData) => {
  //     value = formData.name.value;
  //   };
  //   cy.renderComponent(
  //     <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
  //       <FormItem
  //         validations={[{ regex: /^[a-zA-Z]*$/, errorMessage: 'Invalid' }]}
  //         label="Enter Name"
  //         code="name"
  //       >
  //         <Input id="form-input" />
  //       </FormItem>
  //     </Form>,
  //     { isStoreRequired: false },
  //   );
  //   cy.getById('testForm').should('be.visible');
  //   cy.getById('testForm-formItem-name').should('be.visible');
  //   cy.getById('formItem-name-element').should('be.visible').type('test1');
  //   cy.wait(1000).then(() => {
  //     expect(value).to.eq('test1');
  //     cy.getById('testForm-formItem-name-error').should('be.visible');
  //   });
  // });

  it('date picker should always return value null on clearing', () => {
    const formData = { value: null };
    const updateFormData = (data) => {
      formData.value = data.date.value;
    };
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={updateFormData}>
        <FormItem label="Date" code="date">
          <DatePicker data-test-id="date-picker" value={null} />
        </FormItem>
      </Form>,
    );
    cy.getById('formItem-date-element').should('be.visible').click();
    cy.contains('div', '12').should('be.visible').click();
    cy.getById('formItem-date-element-icon')
      .should('be.visible')
      .trigger('mouseover')
      .click();
    cy.wrap(formData.value).should('be.null');
    cy.screenshot('Should render Date picker with value null on clearing');
  });

  it('date picker should work on -ve values based on epoch time (before January 1, 1970)', () => {
    const formData = { value: null };
    const updateFormData = (data) => {
      formData.value = data.date.value;
    };

    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={updateFormData}>
        <FormItem label="Date" code="date">
          <DatePicker data-test-id="date-picker" value={null} />
        </FormItem>
      </Form>,
    );

    cy.getById('formItem-date-element').should('be.visible').click();
    cy.get('.react-datepicker__month-container').contains('2025').click();

    for (let i = 0; i < 5; i++) {
      cy.get(
        '[data-test-id="year-header-nav-left-wrapper"] button[data-testid="button"]',
      ).click();
    }

    cy.get('.react-datepicker__year-text').contains('1965').click();
    cy.get('.react-datepicker__month-container').contains('May').click();
    cy.get(
      '.react-datepicker__day--001[aria-label="Choose Saturday, May 1st, 1965"]',
    ).click();

    cy.wrap(formData).its('value').should('not.be.null');
    cy.wrap(formData)
      .its('value')
      .should('satisfy', (val) => {
        const date = new Date(val);
        return (
          date.getFullYear() === 1965 &&
          date.getMonth() === 4 &&
          date.getDate() === 1
        );
      });
  });

  it('input value should be masked if masked config is present', () => {
    cy.renderComponent(
      <Form
        id="testForm"
        name="testForm"
        onChange={() => {}}
        config={{
          data: [
            {
              read_only: false,
              required: false,
              default_value: null,
              validations: [],
              hidden: false,
              placeholder: 'Enter text',
              code: 'test',
              hint: 'Test',
              type: 'text',
              masked: true,
            },
          ],
          version: FormVersion.web,
          grouping: 'card',
        }}
      />,
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('form-formItem-test').should('be.visible');
    cy.getById('formItem-test-element')
      .should('be.visible')
      .clear()
      .type('1234abcd');
    cy.getById('formItem-test-element').should('have.value', '********');
    cy.screenshot('Should render input field with masked value');
  });

  it('input value should not be masked if masked config is not present', () => {
    cy.renderComponent(
      <Form
        id="testForm"
        name="testForm"
        onChange={() => {}}
        config={{
          data: [
            {
              read_only: false,
              required: false,
              default_value: null,
              validations: [],
              hidden: false,
              placeholder: 'Enter text',
              code: 'test',
              hint: 'Test',
              type: 'text',
              masked: false,
            },
          ],
          version: FormVersion.web,
          grouping: 'card',
        }}
      />,
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('form-formItem-test').should('be.visible');
    cy.getById('formItem-test-element')
      .should('be.visible')
      .clear()
      .type('1234abcd');
    cy.getById('formItem-test-element').should('have.value', '1234abcd');
    cy.screenshot('Should render input field without masked value');
  });
});
