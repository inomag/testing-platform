import _ from 'lodash';
import React from 'react';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';

const mockInputFields = {
  sifg: [
    {
      type: 'sifg',
      code: 'would_you_like_to_work_as_a_agent_or_a_posp',
      required: true,
      hint: 'Would you like to work as a Agent or a Point of Sales Person (POSP)?',
      sifg_options: {
        selection: {
          type: 'code_name_spinner',
          code: 'would_you_like_to_work_as_a_agent_or_a_posp',
          hint: 'Would you like to work as a Agent or a Point of Sales Person (POSP)?',
          code_name_spinner_options: [
            {
              code: 'none',
              name: 'Select',
              order: 0,
            },
            {
              code: 'agent',
              name: 'Agent',
            },
            {
              code: 'posp',
              name: 'POSP',
            },
          ],
          required: false,
        },
        inputs: {
          agent: [
            {
              type: 'sifg',
              code: 'identify_transfer_agent',
              required: true,
              hint: 'Have you been employed as an agent earlier with any other life insurance company?',
              sifg_options: {
                selection: {
                  type: 'code_name_spinner',
                  code: 'identify_transfer_agent',
                  hint: 'Have you been employed as an agent earlier with any other life insurance company?',
                  code_name_spinner_options: [
                    {
                      code: 'none',
                      name: 'Select',
                      order: 0,
                    },
                    {
                      code: 'Yes',
                      name: 'Yes',
                    },
                    {
                      code: 'No',
                      name: 'No',
                    },
                  ],
                  required: true,
                },
                inputs: {
                  Yes: [],
                  No: [
                    {
                      type: 'sifg',
                      code: 'identify_composite_agent',
                      required: true,
                      hint: 'Are you currently working with any health insurance or general insurance company?',
                      sifg_options: {
                        selection: {
                          type: 'code_name_spinner',
                          code: 'identify_composite_agent',
                          hint: 'Are you currently working with any health insurance or general insurance company?',
                          code_name_spinner_options: [
                            {
                              code: 'none',
                              name: 'Select',
                              order: 0,
                            },
                            {
                              code: 'Yes',
                              name: 'Yes',
                            },
                            {
                              code: 'No',
                              name: 'No',
                            },
                          ],
                          required: true,
                        },
                        inputs: {
                          Yes: [],
                          No: [],
                        },
                      },
                      oif_options: {
                        type: 'default',
                      },
                      read_only: true,
                      retain_form_context: false,
                      display_in_form_type: 'MODULE',
                      search_options: null,
                      value: 'Yes',
                    },
                  ],
                },
              },
              oif_options: {
                type: 'default',
              },
              read_only: true,
              retain_form_context: false,
              display_in_form_type: 'MODULE',
              search_options: null,
              value: 'No',
            },
          ],
          posp: [],
        },
      },
      oif_options: {
        type: 'default',
      },
      read_only: true,
      retain_form_context: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      hidden: false,
      value: 'agent',
      readOnly: true,
    },
  ],

  sifgWithSelect: [
    {
      type: 'sifg',
      code: 'would_you_like_to_work_as_a_agent_or_a_posp',
      required: true,
      hint: 'Would you like to work as a Agent or a Point of Sales Person (POSP)?',
      sifg_options: {
        selection: {
          type: 'code_name_spinner',
          code: 'would_you_like_to_work_as_a_agent_or_a_posp',
          hint: 'Would you like to work as a Agent or a Point of Sales Person (POSP)?',
          code_name_spinner_options: [
            {
              code: 'none',
              name: 'Select',
              order: 0,
            },
            {
              code: 'agent',
              name: 'Agent',
            },
            {
              code: 'posp',
              name: 'POSP',
            },
            {
              code: 'agen1',
              name: 'Agent1',
            },
            {
              code: 'posp1',
              name: 'POSP1',
            },
            {
              code: 'agent2',
              name: 'Agent2',
            },
            {
              code: 'posp2',
              name: 'POSP2',
            },
          ],
          required: false,
        },
        inputs: {
          agent: [],
          posp: [],
          agent1: [],
          posp1: [],
          agent2: [],
          posp2: [],
        },
      },
      oif_options: {
        type: 'default',
      },
      read_only: false,
      retain_form_context: false,
      display_in_form_type: 'MODULE',
      search_options: null,
      hidden: false,
    },
  ],
};

const formValues = {
  would_you_like_to_work_as_a_agent_or_a_posp: {
    value: 'Agent',
    code: 'would_you_like_to_work_as_a_agent_or_a_posp',
  },
  identify_transfer_agent: {
    value: 'No',
    code: 'identify_transfer_agent',
  },
  identify_composite_agent: {
    value: 'Yes',
    code: 'identify_composite_agent',
  },
};

describe('Sifg Component', () => {
  it('Should render sifg prepopulated component with dependent fields correctly', () => {
    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: mockInputFields.sifg,
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={_.noop}
        value={formValues}
      />,
    );
    cy.getById(
      'input-formItem-would_you_like_to_work_as_a_agent_or_a_posp-element-Would you like to work as a Agent or a Point of Sales Person (POSP)?_0',
    ).should('be.checked');
    cy.getById(
      'input-formItem-identify_transfer_agent-element-Have you been employed as an agent earlier with any other life insurance company?_1',
    ).should('be.checked');
    cy.screenshot(
      'Should render sifg prepopulated component with dependent fields correctly',
    );
  });

  it('should render options of sifg component correctly', () => {
    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: mockInputFields.sifgWithSelect,
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={() => {}}
      />,
    );
    cy.getById(
      'formItem-would_you_like_to_work_as_a_agent_or_a_posp-element',
    ).should('be.visible');
    cy.screenshot('Should render options list correctly');
  });
});
