import _ from 'lodash';
import React from 'react';
import Select from '../index';
import { nestedOptionList } from './data';

describe('src/@vymo/ui/blocks/select/integration/select', () => {
  describe('single select', () => {
    it('Should load select with nested options', () => {
      cy.renderComponent(
        <Select
          onChange={_.noop}
          options={nestedOptionList}
          value={['A-1-1']}
          expandedNodesLevel={1}
          data-test-id="blocks-select"
        />,
        { isTestWrapperOnChangeStateRequired: false },
      );

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.text', 'A-1-1');

      cy.getById('blocks-select').click();
      cy.screenshot('nested select options second level list');
      cy.getById('blocks-select-optionList-B__B-1').click();
      cy.screenshot('nested select options third level list');
      cy.getById('blocks-select-optionList-B__B-1__B-1-2').click();

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.text', 'B-1-2');
    });

    it('Should expand the options by n depth when given expandedNodesLevel', () => {
      cy.renderComponent(
        <Select
          onChange={_.noop}
          options={nestedOptionList}
          expandedNodesLevel={2}
          placeholder="select The option"
          data-test-id="blocks-select"
        />,
        { isTestWrapperOnChangeStateRequired: false },
      );

      // text should be the placeholder value
      cy.getById('blocks-select').should('have.text', 'select The option');
      cy.getById('blocks-select').click();
      cy.screenshot('nested select options third level list');

      // search
      cy.getById('blocks-select').type('1');

      cy.getById('blocks-select-optionList-A__A-1__A-1-1').click();

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.text', 'A-1-1');
    });

    it('Should load select with options with search + placeholder if no default value given', () => {
      cy.renderComponent(
        <Select
          onChange={_.noop}
          options={nestedOptionList}
          search
          placeholder="select The option"
          data-test-id="blocks-select"
        />,
        { isTestWrapperOnChangeStateRequired: false },
      );

      // text should be the placeholder value
      cy.getById('blocks-select').should(
        'have.attr',
        'placeholder',
        'select The option',
      );

      // search
      cy.getById('blocks-select').type('B-1');
      cy.screenshot('nested select options filter list');

      cy.getById('blocks-select-optionList-B__B-1__B-1-1').click();

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.value', 'B-1-1');
    });
  });

  describe('multi select', () => {
    it('Should load multi select with options', () => {
      cy.renderComponent(
        <Select
          onChange={_.noop}
          options={nestedOptionList}
          value={['A-1-1', 'B-1-1']}
          data-test-id="blocks-select"
          search
          multi
        />,
        { isTestWrapperOnChangeStateRequired: false },
      );

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.text', 'A-1-1✕B-1-1✕');
      cy.screenshot('multi select list');

      cy.getById('blocks-select').click().type('B');
      cy.screenshot('nested select options list');
      cy.getById('blocks-select-optionList-B__B-1__B-1-2').click();

      cy.getById('blocks-select')
        .should('be.visible')
        .should('have.text', 'A-1-1✕B-1-1✕B-1-2✕');

      cy.screenshot('multi select option added');
    });
  });
});
