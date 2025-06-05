/* eslint-disable jest/valid-expect */
import React from 'react';
import { Checkbox, CheckboxGroup } from '..';

describe('Form Component', () => {
  it('should render radio group with options', () => {
    let value = [] as string[];
    const onChange = (newValue: string[]) => {
      value = newValue;
    };
    cy.renderComponent(
      <CheckboxGroup
        data-test-id="test"
        value={['option3']}
        onChange={onChange}
      >
        <Checkbox label="Option 1" value="option1" disabled />
        <Checkbox label="Option 2" value="option2" />
        <Checkbox label="Option 3" value="option3" />
      </CheckboxGroup>,
    );
    cy.getById('test-checkbox-group').should('be.visible');
    cy.getById('test-checkbox-group')
      .should('be.visible')
      .children()
      .should('have.length', 3);
    cy.getById('test-0-input').should('be.disabled');
    cy.getById('test-1-input').should('be.enabled');
    cy.getById('test-1-checkmark')
      .click()
      .then(() => {
        expect(JSON.stringify(value)).to.eq(
          JSON.stringify(['option3', 'option2']),
        );
      });
    cy.screenshot('Should render checkbox group');
  });

  it('should render single checkbox without using checkbox group', () => {
    let value = false;
    const onChange = (newValue: boolean) => {
      value = newValue;
    };

    cy.renderComponent(
      <Checkbox
        size="small"
        data-test-id="test"
        label="Option 1"
        value={value}
        onChange={onChange}
      />,
    );
    cy.getById('test-wrapper').should('be.visible');
    cy.getById('test-input').should('be.enabled');
    cy.getById('test-checkmark')
      .click()
      .then(() => {
        expect(value).to.eq(true);
      });
    cy.screenshot('Should render checkbox without checkbox group');
  });
});
