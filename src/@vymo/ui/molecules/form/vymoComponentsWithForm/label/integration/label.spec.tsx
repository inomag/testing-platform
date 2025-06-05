import React from 'react';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import Label from 'src/@vymo/ui/molecules/form/vymoComponentsWithForm/label';

describe('Label Component', () => {
  it('should render label component correctly', () => {
    cy.renderComponent(
      <Form
        config={{
          version: FormVersion.web,
          data: [],
          grouping: [],
        }}
        id="testForm"
        name="testForm"
        key="defaultForm"
        onChange={() => {}}
      />,
    );
    cy.renderComponent(<Label html="Content" dataTestId="label-text" />);
    cy.getById('label-text').should('be.visible');
    cy.screenshot('should render lable component');
  });
});
