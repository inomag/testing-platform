import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Assessment from '..';

describe('Assessment Component', () => {
  it('should render component correctly', () => {
    const assessmentConfig = {
      numberOfQuestions: '1',
      duration: '300',
      questions: [
        {
          code: 'q1',
          name: 'What is 2 + 2?',
          single_select: true,
          options: [
            { code: 'a', name: '3' },
            { code: 'b', name: '4' },
            { code: 'c', name: '5' },
          ],
        },
      ],
    };

    const router = createBrowserRouter([
      {
        path: '*',
        element: (
          <Assessment
            assessmentConfig={assessmentConfig}
            onSubmit={() => {}}
            allowNavigation
          />
        ),
      },
    ]);

    cy.renderComponent(<RouterProvider router={router} />);
    cy.getById('assessment').should('be.visible');
    cy.getById('card-container').should('be.visible');
    cy.getById('assessment-footer').should('be.visible');

    cy.contains('What is 2 + 2?').should('be.visible');
    cy.contains('3').should('be.visible');
    cy.contains('4').should('be.visible');
    cy.contains('5').should('be.visible');
  });

  it('should select the option correctly', () => {
    const assessmentConfig = {
      numberOfQuestions: '1',
      duration: '300',
      questions: [
        {
          code: 'q1',
          name: 'What is 2 + 2?',
          single_select: true,
          options: [
            { code: 'a', name: '3' },
            { code: 'b', name: '4' },
            { code: 'c', name: '5' },
          ],
        },
      ],
    };

    const router = createBrowserRouter([
      {
        path: '*',
        element: (
          <Assessment
            assessmentConfig={assessmentConfig}
            onSubmit={() => {}}
            allowNavigation
          />
        ),
      },
    ]);

    cy.renderComponent(<RouterProvider router={router} />);
    cy.getById('assessment').should('be.visible');
    cy.getById('card-container').should('be.visible');
    cy.getById('assessment-footer').should('be.visible');

    cy.getById('checkmark-assessment-What is 2 + 2?_1').click();

    cy.getById('checkmark-assessment-What is 2 + 2?_1').should(
      'have.attr',
      'data-selected',
      'true',
    );
    cy.getById('checkmark-assessment-What is 2 + 2?_0').should(
      'have.attr',
      'data-selected',
      'false',
    );
    cy.getById('checkmark-assessment-What is 2 + 2?_2').should(
      'have.attr',
      'data-selected',
      'false',
    );
  });

  it('should navigate between questions correctly', () => {
    const assessmentConfig = {
      numberOfQuestions: '2',
      duration: '300',
      questions: [
        {
          code: 'q1',
          name: 'What is 2 + 2?',
          single_select: true,
          options: [
            { code: 'a', name: '3' },
            { code: 'b', name: '4' },
            { code: 'c', name: '5' },
          ],
        },
        {
          code: 'q2',
          name: 'What is 3 + 3?',
          single_select: true,
          options: [
            { code: 'a', name: '5' },
            { code: 'b', name: '6' },
            { code: 'c', name: '7' },
          ],
        },
      ],
    };

    const router = createBrowserRouter([
      {
        path: '*',
        element: (
          <Assessment
            assessmentConfig={assessmentConfig}
            onSubmit={() => {}}
            allowNavigation
          />
        ),
      },
    ]);

    cy.renderComponent(<RouterProvider router={router} />);
    cy.getById('assessment').should('be.visible');
    cy.getById('card-container').should('be.visible');
    cy.getById('assessment-footer').should('be.visible');

    cy.contains('What is 2 + 2?').should('be.visible');
    cy.contains('3').should('be.visible');
    cy.contains('4').should('be.visible');
    cy.contains('5').should('be.visible');

    cy.contains('Next').should('be.disabled');

    cy.getById('checkmark-assessment-What is 2 + 2?_1').click();
    cy.getById('checkmark-assessment-What is 2 + 2?_1').should(
      'have.attr',
      'data-selected',
      'true',
    );

    cy.contains('Next').click();
    cy.contains('What is 3 + 3?').should('be.visible');
    cy.contains('Previous').click();
    cy.contains('What is 2 + 2?').should('be.visible');
  });

  it('should trigger onSubmit callback on Submit button click', () => {
    const assessmentConfig = {
      numberOfQuestions: '1',
      duration: '300',
      questions: [
        {
          code: 'q1',
          name: 'What is 2 + 2?',
          single_select: true,
          options: [
            { code: 'a', name: '3' },
            { code: 'b', name: '4' },
            { code: 'c', name: '5' },
          ],
        },
      ],
    };

    const onSubmitSpy = cy.spy().as('onSubmitSpy');
    const router = createBrowserRouter([
      {
        path: '*',
        element: (
          <Assessment
            assessmentConfig={assessmentConfig}
            onSubmit={onSubmitSpy}
            allowNavigation
          />
        ),
      },
    ]);

    cy.renderComponent(<RouterProvider router={router} />);
    cy.getById('assessment').should('be.visible');
    cy.getById('card-container').should('be.visible');
    cy.getById('assessment-footer').should('be.visible');

    cy.getById('checkmark-assessment-What is 2 + 2?_1').click();

    cy.contains('Submit').click();
    cy.get('@onSubmitSpy').should('have.been.calledOnce');
  });

  it('should trigger onTimerEnd callback when time is up', () => {
    const assessmentConfig = {
      numberOfQuestions: '1',
      duration: '2',
      questions: [
        {
          code: 'q1',
          name: 'What is 2 + 2?',
          single_select: true,
          options: [
            { code: 'a', name: '3' },
            { code: 'b', name: '4' },
            { code: 'c', name: '5' },
          ],
        },
      ],
    };

    const onTimerEndSpy = cy.spy().as('onTimerEndSpy');
    const router = createBrowserRouter([
      {
        path: '*',
        element: (
          <Assessment
            assessmentConfig={assessmentConfig}
            onSubmit={() => {}}
            onTimerEnd={onTimerEndSpy}
            allowNavigation
          />
        ),
      },
    ]);

    cy.renderComponent(<RouterProvider router={router} />);
    cy.getById('assessment').should('be.visible');
    cy.getById('card-container').should('be.visible');
    cy.getById('assessment-footer').should('be.visible');

    cy.wait(3000).then(() => {
      cy.get('@onTimerEndSpy').should('have.been.calledOnce');
    });
  });
});
