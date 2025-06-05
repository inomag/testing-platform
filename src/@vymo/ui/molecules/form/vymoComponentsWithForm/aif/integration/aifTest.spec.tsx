/* eslint-disable jest/no-commented-out-tests */
import React from 'react';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';

const mockInputFields = {
  aif: [
    {
      type: 'aif',
      code: 'AIF Field',
      required: true,
      hint: 'Transaction Mode AIF',
      value: [],
      group_title: 'Transaction',
      add_action_title: 'Add Transaction',
      min_group: 1,
      max_group: 5,
      input_fields: [
        {
          type: 'text',
          code: 'aif1',
          hint: 'Transaction Code',
          required: true,
          oif_options: null,
          read_only: false,
          display_in_form_type: 'MODULE',
        },
        {
          type: 'text',
          code: 'aif2',
          hint: 'Transaction name',
          required: false,
          oif_options: null,
          read_only: false,
          display_in_form_type: 'MODULE',
        },
        {
          type: 'text',
          code: 'aif3',
          hint: 'Transaction desc',
          required: true,
          oif_options: null,
          read_only: false,
          display_in_form_type: 'MODULE',
        },
      ],
      oif_options: {
        type: 'default',
      },
      read_only: false,
      display_in_form_type: 'MODULE',
    },
  ],
};

describe('Aif Component', () => {
  it('should render aif component correctly', () => {
    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: mockInputFields.aif,
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={() => {}}
      />,
    );
    cy.getById('collapsible-component').should('be.visible');
    cy.screenshot('Should render aif');
  });

  it('on click, it should show the button', () => {
    const updatedAif = {
      ...mockInputFields.aif[0],
      max_group: 4,
    };

    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: [updatedAif],
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={() => {}}
      />,
    );
    cy.getById('collapsible-component').should('be.visible');
    cy.getById('toggle-collapsible-btn').click();
    cy.getById('AIF Field-aif-button').should('be.visible');
    cy.screenshot('Should render a button on click');
  });

  it('should able to click button max_group number of times', () => {
    const maxGroupCount = 4;

    const updatedAif = {
      ...mockInputFields.aif[0],
      max_group: maxGroupCount,
    };

    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: [updatedAif],
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={() => {}}
      />,
    );
    cy.getById('collapsible-component').should('be.visible');
    cy.getById('group-collapsible').click();
    cy.getById('AIF Field-aif-button').should('be.visible');

    for (let counter = 0; counter < maxGroupCount; counter++) {
      cy.getById('AIF Field-aif-button').click();
    }

    cy.getById('AIF Field-aif-button').should('not.exist');
    cy.screenshot('Should able to click button max_group number of times');
  });

  // need to be fix @Prashanth
  // it('on click delete button, it should delete the input', () => {
  //   const updatedAif = {
  //     ...mockInputFields.aif[0],
  //     max_group: 4,
  //   };

  //   cy.renderComponent(
  //     <Form
  //       config={{
  //         version: FormVersion.web,
  //         data: [updatedAif],
  //         grouping: [],
  //       }}
  //       id="testForm"
  //       name="testForm"
  //       key="defaultForm"
  //       onChange={() => {}}
  //     />,
  //   );
  //   cy.getById('collapsible-component').should('be.visible');
  //   cy.getById('group-collapsible').click();
  //   for (let counter = 0; counter < 1; counter++) {
  //     cy.getById('AIF Field-aif-button').click();
  //   }
  //   cy.get('[data-test-id$="-remove"]').last().click();
  //   cy.getById('AIF Field-aif-button').should('be.visible');
  //   cy.screenshot('Should render a button on click');
  // });
});
