import React from 'react';
import TagInput from '../index';

describe('TagInput Component', () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    cy.renderComponent(
      <TagInput
        value={[
          { label: 'Cheque', value: 'Cheque' },
          { label: 'DD', value: 'DD' },
        ]}
        data-test-id="tag-input"
      />,
    );
  });

  it('should render the TagInput component', () => {
    cy.getById('tag-input').should('exist');
  });

  it('should allow a user to add a tag', () => {
    const tagText = 'New Tag';

    cy.getById('tag-input').type(tagText).type('{enter}');
    cy.getById('tag-input-value').should('contain.text', tagText);
  });

  it('should allow a user to remove a tag', () => {
    const tagText = 'Tag to Remove';

    cy.getById('tag-input').type(tagText).type('{enter}');
    cy.getById('tag-input-Tag to Remove-close').click();
    cy.getById('tag-input-Tag to Remove-close').should('not.exist');
  });

  it('should clear input after adding a tag', () => {
    const tagText = 'Another Tag';

    cy.getById('tag-input').type(tagText).type('{enter}');
    cy.getById('tag-input').should('have.value', '');
  });

  it('should not add a tag if the input is empty and Enter is pressed', () => {
    cy.getById('tag-input').type('{enter}');
    cy.getById('tag-input-value').should('have.length', 1);
  });

  it('should trigger onChange callback when a tag is added', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy');
    cy.renderComponent(
      <TagInput value={[]} onChange={onChangeSpy} data-test-id="tag-input" />,
    );

    const tagText = 'New Tag';
    cy.getById('tag-input').type(tagText).type('{enter}');
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should trigger onChange callback when a tag is removed', () => {
    const tagText = 'Removable Tag';
    const onChangeSpy = cy.spy().as('onChangeSpy');

    cy.renderComponent(
      <TagInput
        value={[{ label: tagText, value: tagText }]}
        onChange={onChangeSpy}
        data-test-id="tag-input"
      />,
    );
    cy.getById(`tag-input-${tagText}-close`).click();
    cy.get('@onChangeSpy').should('have.been.calledOnce');
  });

  it('should support custom tags with prefixes', () => {
    const tagWithPrefix = {
      label: 'Custom Tag',
      value: 'customTag',
      displayPrefix: '#',
    };
    cy.renderComponent(
      <TagInput value={[tagWithPrefix]} data-test-id="tag-input" />,
    );

    cy.getById('tag-input-value').should(
      'contain.text',
      `#${tagWithPrefix.label}`,
    );
  });

  it('should not allow duplicate tags', () => {
    const tagText = 'Duplicate Tag';

    cy.getById('tag-input').type(tagText).type('{enter}');
    cy.getById('tag-input').type(tagText).type('{enter}');

    cy.getById('tag-input-value').should('have.length', 1);
  });

  // This functionality has to be added.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should remove all tags when clear button is clicked', () => {
    cy.getById('tag-input')
      .trigger('mouseover')
      .getById('tag-input-clearInput')
      .click();

    cy.getById('tag-input-value').should('have.length', 1);
  });

  it('should respect the `createTagOnEnter` prop', () => {
    const tagText = 'No Tag Creation';

    cy.renderComponent(
      <TagInput
        value={[
          { label: 'Cheque', value: 'Cheque' },
          { label: 'DD', value: 'DD' },
        ]}
        createTagOnEnter={false}
        data-test-id="tag-input"
      />,
    );
    cy.getById('tag-input').type(tagText).type('{enter}');

    cy.getById('tag-input-value').should('have.length', 1);
  });
});
