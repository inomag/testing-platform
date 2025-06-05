import React from 'react';
import TextArea from '..';

describe('TextArea Component', () => {
  const defaultProps = {
    label: 'Testing',
    required: true,
    'data-test-id': 'test-textarea',
  };

  it('should render simple textArea correctly', () => {
    cy.renderComponent(<TextArea {...defaultProps} />);
    cy.getById('test-textarea').should('exist');
  });

  it('should display label correctly', () => {
    cy.renderComponent(<TextArea {...defaultProps} />);
    cy.contains('label', 'Testing').should('exist');
  });

  it('should handle input correctly', () => {
    cy.renderComponent(<TextArea {...defaultProps} />);
    cy.getById('test-textarea').type('Hello, World!');
    cy.getById('test-textarea').should('have.value', 'Hello, World!');
  });

  it('should show validation errors when required and empty', () => {
    const validations = [
      { regex: /^\d+$/, errorMessage: 'This field only accepts digits' },
    ];
    cy.renderComponent(
      <TextArea {...defaultProps} validations={validations} />,
    );
    cy.getById('test-textarea').type('testing');
    cy.getById('test-textarea-error-0')
      .should('exist')
      .and('contain.text', 'This field only accepts digits');
  });

  it('should be disabled when the disabled prop is set', () => {
    cy.renderComponent(<TextArea {...defaultProps} disabled />);
    cy.getById('test-textarea').should('be.disabled');
  });

  it('should display subMessage correctly', () => {
    const subMessage = 'This is a sub message';
    cy.renderComponent(<TextArea {...defaultProps} subMessage={subMessage} />);
    cy.getById('test-textarea-subMessage')
      .should('exist')
      .and('contain.text', subMessage);
  });

  it('should apply custom classNames', () => {
    const customClass = 'custom-class';
    cy.renderComponent(<TextArea {...defaultProps} classNames={customClass} />);
    cy.get(`.${customClass}`).should('exist');
  });

  it('should handle onChange event', () => {
    const handleChange = cy.stub();
    cy.renderComponent(<TextArea {...defaultProps} onChange={handleChange} />);
    cy.getById('test-textarea').type('New text');
    cy.wrap(handleChange).should('be.called');
  });

  it('should render with default value', () => {
    const value = 'Default value';
    cy.renderComponent(<TextArea {...defaultProps} value={value} />);
    cy.getById('test-textarea').should('have.value', value);
  });

  it('renders a sentence field', () => {
    cy.renderComponent(
      <TextArea data-test-id="textArea" label="Test Sentence" />,
    );
    cy.getById('textArea').should('be.visible');
    cy.getById('textArea_label').should('be.visible');
    cy.screenshot('renders a sentence field');
  });

  it('renders a sentence field with minimum 8 lines', () => {
    cy.renderComponent(<TextArea data-test-id="textArea" minLines={8} />);
    cy.getById('textArea').should('be.visible');
    cy.getById('textArea').should('have.attr', 'rows', '8');
    cy.screenshot('renders a sentence field with 8 lines');
  });

  it('renders a sentence field with submessage', () => {
    cy.renderComponent(
      <TextArea data-test-id="textArea" subMessage="Test Sub-Message" />,
    );
    cy.getById('textArea').should('be.visible');
    cy.getById('textArea-subMessage').should('be.visible');
    cy.screenshot('renders a sentence field with sub message');
  });

  it('renders a sentence field with validation', () => {
    cy.renderComponent(
      <TextArea
        data-test-id="textArea"
        validations={[
          {
            regex: /^[a-zA-Z\s]+$/,
            errorMessage: 'Only alphabets and spaces are allowed',
          },
        ]}
        value="1234abc"
      />,
    );
    cy.getById('textArea').should('be.visible');
    cy.getById('textArea').type('1234');
    cy.getById('textArea-error-0').should('be.visible');
    cy.screenshot('renders a sentence field with validation');
  });
});
