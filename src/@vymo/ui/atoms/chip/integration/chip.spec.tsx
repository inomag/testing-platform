import React from 'react';
import { ReactComponent as CheckIcon } from 'src/assets/icons/check.svg';
import Chip from '..';

describe('Chip component', () => {
  it('should render', () => {
    cy.renderComponent(
      <Chip
        type="success"
        label="test"
        data-test-id="test-chip"
        iconProps={{ icon: <CheckIcon />, iconPosition: 'left' }}
      />,
    );
    cy.getById('test-chip').should('be.visible');
    cy.screenshot('should render chip');
  });
});
