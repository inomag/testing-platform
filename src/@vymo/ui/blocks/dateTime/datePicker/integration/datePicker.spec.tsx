import React from 'react';
import { DatePicker } from 'src/@vymo/ui/blocks/dateTime';

describe('DatePicker Component', () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  const formattedToday = today
    .toLocaleDateString('en-GB', options)
    .replace(',', '');
  const date = today.getDate();
  const formattedDate = date.toString().padStart(3, '0');
  const monthName = today.toLocaleString('en-US', { month: 'long' });
  const year = today.getFullYear();
  let hours = today.getHours();
  const minutes = today.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;

  it('should render simple datePicker correctly', () => {
    cy.renderComponent(
      <DatePicker data-test-id="date-picker" value={null} showTime />,
    );
    cy.getById('date-picker').should('be.visible');
  });

  it('should render datePicker with date correctly', () => {
    cy.renderComponent(<DatePicker data-test-id="date-picker" value={null} />);
    cy.getById('date-picker').should('be.visible').click();
    cy.get('.react-datepicker__month-container').should('be.visible');
    cy.get('.react-datepicker__today-button').should('be.visible').click();
    cy.getById('date-picker').should('have.text', formattedToday);
  });

  it('should render datePicker with time correctly', () => {
    cy.renderComponent(
      <DatePicker data-test-id="date-picker" value={today} showTime />,
    );
    cy.getById('date-picker').should('be.visible').click();
    cy.get('.react-datepicker__month-container').should('be.visible');
    cy.get('.react-datepicker__input-time-container').should('be.visible');
    cy.contains('button', 'Ok').should('be.visible').click();
    cy.getById('date-picker').should(
      'have.text',
      `${monthName} ${date}, ${year} ${hours}:${formattedMinutes} ${ampm}`,
    );
  });

  it('should clear the date on clicking cross icon', () => {
    cy.renderComponent(<DatePicker data-test-id="date-picker" value={today} />);
    cy.getById('date-picker').should('be.visible');
    cy.getById('date-picker').trigger('mouseover');
    cy.getById('date-picker-icon').click();
    cy.getById('date-picker').should('have.text', '');
  });

  it('should render datePicker with date selection for current day', () => {
    cy.renderComponent(
      <DatePicker data-test-id="date-picker" value={null} min={0} max={0} />,
    );
    cy.getById('date-picker').should('be.visible').click();
  });

  it('should render datePicker with current date and time correctly', () => {
    cy.renderComponent(
      <DatePicker data-test-id="date-picker" value={null} showTime />,
    );
    cy.getById('date-picker').should('be.visible').click();
    cy.get(
      `.react-datepicker__day--${formattedDate}.react-datepicker__day--today`,
    ).click();
    cy.get('.react-datepicker__today-button button').click();
    cy.getById('date-picker').should(
      'have.text',
      `${monthName} ${date}, ${year} 12:00 AM`,
    );
  });
});
