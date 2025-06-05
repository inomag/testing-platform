/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import Link from 'src/@vymo/ui/molecules/form/vymoComponentsWithForm/link';

describe('Link Component', () => {
  it('should render simple link component correctly', () => {
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
    cy.renderComponent(
      <Link
        showLinkIcon={false}
        title="Link"
        button="Test Button"
        url="https://example.com/"
        dataTestId="link-component"
      />,
    );
    cy.getById('link-component').should('be.visible');
    cy.getById('link-component').should('have.text', 'Link');
    cy.screenshot('Should render link component');
  });

  it('should render link component with link icon correctly', () => {
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
    cy.renderComponent(
      <Link
        showLinkIcon
        title="Link"
        button="Test Button"
        url="https://example.com/"
        dataTestId="link-component"
      />,
    );
    cy.getById('link-component').should('be.visible');
    cy.screenshot('should render link compoent with icon');
  });
});
