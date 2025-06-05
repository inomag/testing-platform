import React from 'react';
import { TimePicker } from 'src/@vymo/ui/blocks/dateTime';

describe('TimePicker Component', () => {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');

  it('should render simple timePicker correctly', () => {
    cy.renderComponent(
      <TimePicker data-test-id="time-picker" value="" onChange={() => {}} />,
      {
        isTestWrapperOnChangeStateRequired: true,
      },
    );
    cy.getById('time-picker').should('be.visible');
  });

  it('should render timePicker with HH:mm:ss format correctly', () => {
    cy.renderComponent(
      <TimePicker
        data-test-id="time-picker"
        value=""
        format="HH:mm:ss"
        onChange={() => {}}
      />,
      {
        isTestWrapperOnChangeStateRequired: true,
      },
    );
    cy.getById('time-picker').should('be.visible');
    cy.getById('time-picker').click();
    cy.get('[class*="timePicker_timePicker__content"]').should('be.visible');
    cy.get('[class*="timePicker_timePicker__content"]')
      .children('[class*="timePicker_timePicker__list"]')
      .should('have.length', 3);
  });

  it('should select current time on clicking now button correctly', () => {
    cy.renderComponent(
      <TimePicker data-test-id="time-picker" value="" onChange={() => {}} />,
      {
        isTestWrapperOnChangeStateRequired: true,
      },
    );
    cy.getById('time-picker').should('be.visible').click();
    cy.contains('button', 'Now').should('be.visible').click();
    cy.getById('time-picker').should('have.text', `${hours}:${minutes}`);
  });

  it('should clear the time on clicking cross icon correctly', () => {
    cy.renderComponent(
      <TimePicker data-test-id="time-picker" value="" onChange={() => {}} />,
      {
        isTestWrapperOnChangeStateRequired: true,
      },
    );
    cy.getById('time-picker').should('be.visible').click();
    cy.contains('button', 'Now').should('be.visible').click();
    cy.getById('time-picker').should('have.text', `${hours}:${minutes}`);
    cy.getById('time-picker').trigger('mouseover');
    cy.getById('time-picker-icon').click();
    cy.getById('time-picker').should('have.text', '');
  });
});
