import React from 'react';
import UserHierarchy from '..';

describe('UserHierarchy Component', () => {
  const user = {
    code: 'user1',
    name: 'User 1',
    subordinates: [
      {
        code: 'user2',
        name: 'User 2',
        subordinates: [
          {
            code: 'user4',
            name: 'User 4',
            subordinates: [
              {
                code: 'user6',
                name: 'User 6',
              },
            ],
          },
          {
            code: 'user5',
            name: 'User 5',
          },
        ],
      },
      {
        code: 'user3',
        name: 'User 3',
      },
    ],
  };

  it('should render the correct number of Select inputs based on selected users', () => {
    cy.renderComponent(
      <UserHierarchy
        user={user}
        onChange={() => {}}
        selected={['user2', 'user5']}
      />,
    );
    cy.getById('user-hierarchy-wrapper')
      .should('be.visible')
      .and('have.length', 2);
    cy.getById('user-hierarchy-wrapper').eq(0).should('have.text', 'User 2');
    cy.getById('user-hierarchy-wrapper').eq(1).should('have.text', 'User 5');

    cy.renderComponent(
      <UserHierarchy
        user={user}
        onChange={() => {}}
        selected={['user2', 'user4']}
      />,
    );
    cy.getById('user-hierarchy-wrapper')
      .should('be.visible')
      .and('have.length', 3);
    cy.getById('user-hierarchy-wrapper').eq(0).should('have.text', 'User 2');
    cy.getById('user-hierarchy-wrapper').eq(1).should('have.text', 'User 4');
    cy.getById('user-hierarchy-wrapper').eq(2).should('have.text', 'User 6');
  });

  it('should call the onChange callback when a user is selected', () => {
    const mockOnChange = cy.stub();
    cy.renderComponent(
      <UserHierarchy user={user} onChange={mockOnChange} selected={[]} />,
    );
    cy.getById('user-hierarchy-wrapper').should('be.visible').click();
    cy.getById('select-optionList').should('be.visible');
    cy.getById('select-optionList-user2').should('be.visible').click();
    cy.wrap(mockOnChange).should('have.been.calledWith', 'user2');
    cy.getById('user-hierarchy-wrapper')
      .eq(0)
      .should('be.visible')
      .and('have.text', 'User 2');
  });

  it('should disable the select inputs when the disabled prop is passed', () => {
    cy.renderComponent(
      <UserHierarchy user={user} onChange={() => {}} selected={[]} disabled />,
    );
    cy.getById('user-hierarchy-wrapper').should('be.visible');
    cy.get('[class*="select_customSelect__disabled"]').should('exist');
  });

  it('should handle selecting a user and cascading to subordinates correctly', () => {
    const selected = ['user1'];
    const mockOnChange = cy.stub();

    cy.renderComponent(
      <UserHierarchy user={user} onChange={mockOnChange} selected={selected} />,
    );
    cy.getById('user-hierarchy-wrapper').should('be.visible').click();
    cy.getById('select-optionList-user2').should('be.visible').click();
    cy.wrap(mockOnChange).should('have.been.calledWith', 'user2');
    cy.getById('user-hierarchy-wrapper')
      .eq(0)
      .should('be.visible')
      .and('have.text', 'User 2');

    cy.getById('user-hierarchy-wrapper').eq(1).should('be.visible').click();
    cy.getById('select-optionList-user4').should('be.visible').click();
    cy.wrap(mockOnChange).should('have.been.calledWith', 'user4');
    cy.getById('user-hierarchy-wrapper')
      .eq(1)
      .should('be.visible')
      .and('have.text', 'User 4');

    cy.getById('user-hierarchy-wrapper')
      .eq(2)
      .should('be.visible')
      .and('have.text', 'User 6');
  });
});
