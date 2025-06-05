import React from 'react';
import { Option, RadioGroup } from '..';

describe('Form Component', () => {
  it('should render radio group with options', () => {
    let value = '';
    const onChange = (newValue: any) => {
      value = newValue;
    };
    cy.renderComponent(
      <RadioGroup
        data-test-id="test"
        name="testRadio"
        value="option3"
        onChange={onChange}
      >
        <Option label="Option 1" value="option1" disabled />
        <Option label="Option 2" value="option2" />
        <Option label="Option 3" value="option3" />
      </RadioGroup>,
    );

    cy.getById('radio-group-test').should('be.visible');
    cy.getById('radio-group-test')
      .should('be.visible')
      .children()
      .should('have.length', 3);
    cy.getById('input-test-testRadio_0').should('be.disabled');
    cy.getById('input-test-testRadio_1').should('be.enabled');
    cy.getById('checkmark-test-testRadio_1')
      .click()
      .then(() => {
        expect(value).to.be.an('array');
        expect(value).to.be.an('array').length(1);
        expect(value[0]).to.have.property('code', 'option2');
      });
    cy.screenshot('Should render radio group');
  });

  it('should render tabs group with options', () => {
    let value = '';
    const onChange = (newValue: any) => {
      value = newValue;
    };
    cy.renderComponent(
      <RadioGroup
        data-test-id="test"
        name="testRadio"
        value="option3"
        onChange={onChange}
        type="tabs"
      >
        <Option label="Option 1" value="option1" disabled />
        <Option label="Option 2" value="option2" />
        <Option label="Option 3" value="option3" />
      </RadioGroup>,
    );

    cy.getById('radio-group-test').should('be.visible');

    cy.getById('radio-group-test').should('satisfy', ($element) => {
      const { classList } = $element[0];
      return Array.from(classList).some((className) =>
        /radio-group__tabs/.test(className as string),
      );
    });
    cy.getById('radio-group-test')
      .should('be.visible')
      .children()
      .should('have.length', 3);
    cy.getById('input-test-testRadio_0').should('be.disabled');
    cy.getById('label-test-testRadio_1')
      .should('be.visible')
      .click()
      .then(() => {
        expect(value).to.be.an('array');
        expect(value).to.be.an('array').length(1);
        expect(value[0]).to.have.property('code', 'option2');
      });
    cy.screenshot('Should render tabs group');
  });
});
