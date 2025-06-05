import React from 'react';
import { RangePicker } from 'src/@vymo/ui/blocks/dateTime';

describe('RangePicker Component', () => {
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

  it('should render simple rangePicker correctly', () => {
    cy.renderComponent(
      <RangePicker data-test-id="range-picker" value={[null, null]} />,
    );
    cy.getById('range-picker').should('be.visible');
  });

  it('should render rangePicker with date and time correctly', () => {
    cy.renderComponent(
      <RangePicker
        data-test-id="range-picker"
        value={[today, today]}
        showTime
      />,
    );
    cy.getById('range-picker').should('be.visible');
    cy.get('[class*="rangePicker_rangePicker__start"]').should(
      'have.text',
      `${monthName} ${date}, ${year} ${hours}:${formattedMinutes} ${ampm}`,
    );
    cy.get('[class*="rangePicker_rangePicker__end"]').should(
      'have.text',
      `${monthName} ${date}, ${year} ${hours}:${formattedMinutes} ${ampm}`,
    );
  });

  it('should select current date on clicking today button', () => {
    cy.renderComponent(
      <RangePicker data-test-id="range-picker" value={[null, null]} />,
    );
    cy.get('[class*="rangePicker_rangePicker__start"]').should('be.visible');
    cy.get('[class*="rangePicker_rangePicker__end"]').should('be.visible');
    cy.get('[class*="rangePicker_rangePicker__start"]').click();
    cy.get('.react-datepicker__today-button').click();
    cy.get('.react-datepicker__today-button').click();
    cy.get('[class*="rangePicker_rangePicker__start"]').should(
      'have.text',
      formattedToday,
    );
    cy.get('[class*="rangePicker_rangePicker__end"]').should(
      'have.text',
      formattedToday,
    );
  });

  it('should select current date with time correctly', () => {
    cy.renderComponent(
      <RangePicker data-test-id="range-picker" value={[null, null]} showTime />,
    );
    cy.get('[class*="rangePicker_rangePicker__start"]').should('be.visible');
    cy.get('[class*="rangePicker_rangePicker__end"]').should('be.visible');
    cy.get('[class*="rangePicker_rangePicker__start"]').click();
    cy.get(
      `.react-datepicker__day--${formattedDate}.react-datepicker__day--today`,
    ).click();
    cy.get('.react-datepicker__today-button button').click();
    cy.get(
      `.react-datepicker__day--${formattedDate}.react-datepicker__day--today`,
    ).click();
    cy.get('.react-datepicker__today-button button').click();
    cy.get('[class*="rangePicker_rangePicker__start"]').should(
      'have.text',
      `${monthName} ${date}, ${year} 12:00 AM`,
    );
    cy.get('[class*="rangePicker_rangePicker__end"]').should(
      'have.text',
      `${monthName} ${date}, ${year} 12:00 AM`,
    );
  });

  it('should clear values on clicking cross icon', () => {
    cy.renderComponent(
      <RangePicker
        data-test-id="range-picker"
        value={[today, today]}
        showTime
      />,
    );
    cy.getById('range-picker').should('be.visible');
    cy.getById('range-picker').trigger('mouseover');
    cy.getById('range-picker-icon').click();
    cy.get('[class*="rangePicker_rangePicker__start"]').should('have.text', '');
    cy.get('[class*="rangePicker_rangePicker__end"]').should('have.text', '');
  });
});
