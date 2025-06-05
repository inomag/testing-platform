import React from 'react';
import Input from 'src/@vymo/ui/atoms/input';
import FormItem from '../formItem';
import Form from '../legacy';

describe('Form Component', () => {
  it('should initialize the form with the name provided in props', () => {
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={() => {}}>
        <FormItem label="Enter Name" code="name">
          <Input id="form-input" />
        </FormItem>
      </Form>,
      { isStoreRequired: true, isTestWrapperOnChangeStateRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-name').should('be.visible');
    cy.getById('testForm-formItem-name-element').should('be.visible');
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
      { isStoreRequired: true, isTestWrapperOnChangeStateRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-firstName').should('be.visible');
    cy.getById('testForm-formItem-lastName').should('be.visible');
    cy.getStoreData('form.testForm').should('exist');
    cy.screenshot('Should render mulitple form items');
  });

  it('match the response of onchange', () => {
    let value = 'test';
    const formCallBackFunc = (formData) => {
      value = formData.name.value;
    };
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
        <FormItem label="Enter Name" code="name">
          <Input id="form-input" />
        </FormItem>
      </Form>,
      { isStoreRequired: true, isTestWrapperOnChangeStateRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-name').should('be.visible');
    cy.getById('testForm-formItem-name-element')
      .should('be.visible')
      .type(value);
    cy.wait(1000).then(() => {
      cy.getStoreData('form.testForm').then((data: any) => {
        expect(data.fields.name.value).to.eq(value);
      });
    });
    cy.screenshot(
      'Should match the response of typed and value received in onchange callback',
    );
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it('checking required property on formitem', () => {
    let value = 't';
    const formCallBackFunc = (formData) => {
      value = formData.name.value;
    };
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
        <FormItem required label="Enter Name" code="name">
          <Input />
        </FormItem>
      </Form>,
      { isStoreRequired: true, isTestWrapperOnChangeStateRequired: false },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-name').should('be.visible');
    cy.getById('testForm-formItem-name-element')
      .should('be.visible')
      .type(value);

    cy.getById('testForm-formItem-name-element')
      .should('be.visible')
      .type('{backspace}');
    cy.getById('testForm-formItem-name-element').blur();
    cy.getById('testForm-formItem-name-error').should('be.visible');
    cy.getStoreData('form.testForm').then((data: any) => {
      expect(JSON.stringify(data.fields.name.error)).to.eq(
        JSON.stringify(['Required']),
      );
      expect(data.fields.name.touched).to.eq(true);
      cy.screenshot('Required property on formitem');
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it('validate the value typed in input field', () => {
    let value = 'test1';
    const formCallBackFunc = (formData) => {
      value = formData.name.value;
    };
    cy.renderComponent(
      <Form id="testForm" name="testForm" onChange={formCallBackFunc}>
        <FormItem
          validations={[{ regex: /^[a-zA-Z]*$/, errorMessage: 'Invalid' }]}
          label="Enter Name"
          code="name"
        >
          <Input id="form-input" />
        </FormItem>
      </Form>,
      { isStoreRequired: true },
    );
    cy.getById('testForm').should('be.visible');
    cy.getById('testForm-formItem-name').should('be.visible');
    cy.getById('testForm-formItem-name-element')
      .should('be.visible')
      .type(value);
    cy.getById('testForm-formItem-name-element').blur();
    cy.wait(1000).then(() => {
      cy.getById('testForm-formItem-name-error').should('be.visible');
      cy.getStoreData('form.testForm').then((data: any) => {
        expect(JSON.stringify(data.fields.name.error)).to.eq(
          JSON.stringify(['Invalid']),
        );
        expect(data.fields.name.touched).to.eq(true);
        cy.screenshot('Checking validations on formitem');
      });
    });
  });
});
