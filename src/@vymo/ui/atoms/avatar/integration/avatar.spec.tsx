import React from 'react';
import Avatar from 'src/@vymo/ui/atoms/avatar';

describe('Avatar Component', () => {
  it('should render avatar with image correctly', () => {
    cy.renderComponent(
      <Avatar
        data-test-id="test"
        imageUrl="https://www.w3schools.com/howto/img_avatar.png"
      />,
    );

    cy.getById('test-image').should('be.visible');
    cy.screenshot('Should render avatar with image');
  });

  it('should render avatar with text correctly', () => {
    cy.renderComponent(<Avatar data-test-id="test" text="P" />);
    cy.getById('test-text').should('be.visible');
    cy.screenshot('Should render avatar with text');
  });
});
