import React from 'react';
import CustomMonthHeader from '../monthHeader';
import CustomYearHeader from '../yearHeader';

const today = new Date();
const year = today.getFullYear();
const props = {
  monthDate: today,
  date: today,
  changeYear: () => {},
  changeMonth: () => {},
  customHeaderCount: 1,
  decreaseMonth: () => {},
  increaseMonth: () => {},
  prevMonthButtonDisabled: false,
  nextMonthButtonDisabled: false,
  decreaseYear: () => {},
  increaseYear: () => {},
  prevYearButtonDisabled: false,
  nextYearButtonDisabled: false,
};

describe('CustomMonthHeader', () => {
  it('should display the current year in the center of the header', () => {
    cy.renderComponent(
      <CustomMonthHeader {...props} onClickYearPicker={() => {}} />,
    );
    cy.getById('month-header').should('be.visible');
    cy.getById('month-header-nav-left-wrapper')
      .should('be.visible')
      .and('have.text', '<');
    cy.getById('month-header-nav-right-wrapper')
      .should('be.visible')
      .and('have.text', '>');
    cy.getById('month-header-content-wrapper')
      .should('be.visible')
      .and('have.text', year);
  });

  it('should call decreaseYear when the previous year button is clicked', () => {
    const mockDecreaseYear = cy.stub();

    cy.renderComponent(
      <CustomMonthHeader
        {...props}
        onClickYearPicker={() => {}}
        decreaseYear={mockDecreaseYear}
      />,
    );
    cy.getById('month-header').should('be.visible');
    cy.get('[data-test-id="month-header-nav-left-wrapper"] button')
      .should('be.visible')
      .click();
    cy.wrap(mockDecreaseYear).should('have.been.calledOnce');
  });

  it('should call increaseYear when the next year button is clicked', () => {
    const mockIncreaseYear = cy.stub();

    cy.renderComponent(
      <CustomMonthHeader
        {...props}
        onClickYearPicker={() => {}}
        increaseYear={mockIncreaseYear}
      />,
    );
    cy.getById('month-header').should('be.visible');
    cy.get('[data-test-id="month-header-nav-right-wrapper"] button')
      .should('be.visible')
      .click();
    cy.wrap(mockIncreaseYear).should('have.been.calledOnce');
  });

  it('should call onClickYearPicker when the year button is clicked', () => {
    const mockOnClickYearPicker = cy.stub();

    cy.renderComponent(
      <CustomMonthHeader
        {...props}
        onClickYearPicker={mockOnClickYearPicker}
      />,
    );
    cy.getById('month-header').should('be.visible');
    cy.getById('month-header-content-wrapper').should('be.visible').click();
    cy.wrap(mockOnClickYearPicker).should('have.been.calledOnce');
  });

  it('should disable the previous year button when prevYearButtonDisabled is true', () => {
    cy.renderComponent(
      <CustomMonthHeader
        {...props}
        onClickYearPicker={() => {}}
        prevYearButtonDisabled
      />,
    );
    cy.getById('month-header').should('be.visible');
    cy.get('[data-test-id="month-header-nav-left-wrapper"] button').should(
      'be.disabled',
    );
  });

  it('should disable the next year button when nextYearButtonDisabled is true', () => {
    cy.renderComponent(
      <CustomMonthHeader
        {...props}
        onClickYearPicker={() => {}}
        nextYearButtonDisabled
      />,
    );
    cy.getById('month-header').should('be.visible');
    cy.get('[data-test-id="month-header-nav-right-wrapper"] button').should(
      'be.disabled',
    );
  });

  it('should show both year buttons as enabled by default', () => {
    cy.renderComponent(
      <CustomMonthHeader {...props} onClickYearPicker={() => {}} />,
    );
    cy.getById('month-header').should('be.visible');
    cy.get('[data-test-id="month-header-nav-left-wrapper"] button').should(
      'not.be.disabled',
    );
    cy.get('[data-test-id="month-header-nav-right-wrapper"] button').should(
      'not.be.disabled',
    );
  });
});

describe('CustomYearHeader', () => {
  it('should render default CustomYearHeader component', () => {
    cy.renderComponent(<CustomYearHeader {...props} />);
    cy.getById('year-header').should('be.visible');
    cy.getById('year-header-nav-left-wrapper')
      .should('be.visible')
      .and('have.text', '<');
    cy.getById('year-header-nav-right-wrapper')
      .should('be.visible')
      .and('have.text', '>');
    cy.getById('year-header-content-wrapper')
      .should('be.visible')
      .and('have.text', ' - ');
  });

  it('should call decreaseYear when the previous year button is clicked', () => {
    const mockDecreaseYear = cy.stub();

    cy.renderComponent(
      <CustomYearHeader {...props} decreaseYear={mockDecreaseYear} />,
    );
    cy.getById('year-header').should('be.visible');
    cy.get('[data-test-id="year-header-nav-left-wrapper"] button')
      .should('be.visible')
      .click();
    cy.wrap(mockDecreaseYear).should('have.been.calledOnce');
  });

  it('should call increaseYear when the next year button is clicked', () => {
    const mockIncreaseYear = cy.stub();

    cy.renderComponent(
      <CustomYearHeader {...props} increaseYear={mockIncreaseYear} />,
    );
    cy.getById('year-header').should('be.visible');
    cy.get('[data-test-id="year-header-nav-right-wrapper"] button')
      .should('be.visible')
      .click();
    cy.wrap(mockIncreaseYear).should('have.been.calledOnce');
  });

  it('should disable the previous year button when prevYearButtonDisabled is true', () => {
    cy.renderComponent(<CustomYearHeader {...props} prevYearButtonDisabled />);
    cy.getById('year-header').should('be.visible');
    cy.get('[data-test-id="year-header-nav-left-wrapper"] button').should(
      'be.disabled',
    );
  });

  it('should disable the next year button when nextYearButtonDisabled is true', () => {
    cy.renderComponent(<CustomYearHeader {...props} nextYearButtonDisabled />);
    cy.getById('year-header').should('be.visible');
    cy.get('[data-test-id="year-header-nav-right-wrapper"] button').should(
      'be.disabled',
    );
  });

  it('should show both year buttons as enabled by default', () => {
    cy.renderComponent(<CustomYearHeader {...props} />);
    cy.getById('year-header').should('be.visible');
    cy.get('[data-test-id="year-header-nav-left-wrapper"] button').should(
      'not.be.disabled',
    );
    cy.get('[data-test-id="year-header-nav-right-wrapper"] button').should(
      'not.be.disabled',
    );
  });
});
