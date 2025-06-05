import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Modal, { Body, Footer, Header } from '..';

describe('Modal Component', () => {
  it('should render the modal component', () => {
    cy.renderComponent(
      <Modal data-test-id="modal-test" open onClose={() => {}}>
        <Header data-test-id="modal-header">
          <span> Modal Header </span>
        </Header>
        <Body data-test-id="modal-body">
          <p> This is the modal body </p>
        </Body>
        <Footer data-test-id="modal-footer">
          <div>
            <Button data-test-id="modal-test-button" type="primary">
              Ok
            </Button>
          </div>
        </Footer>
      </Modal>,
    );
    cy.getById('modal-test-wrapper').should('be.visible');
    cy.getById('modal-header').should('be.visible');
    cy.getById('modal-body').should('be.visible');
    cy.getById('modal-footer').should('be.visible');
  });

  it('should not render the closed modal component', () => {
    cy.renderComponent(
      <Modal data-test-id="custom-modal" open={false} onClose={() => {}}>
        <Header data-test-id="modal-header">
          <span> Modal Header </span>
        </Header>
        <Body data-test-id="modal-body">
          <p> This is the modal body </p>
        </Body>
        <Footer data-test-id="modal-footer">
          <div>
            <Button data-test-id="modal-test-button" type="primary">
              Ok
            </Button>
          </div>
        </Footer>
      </Modal>,
    );
    cy.getById('custom-modal').should('not.exist');
  });

  it('should show error message when modal children are different than Header, Body or Footer', () => {
    cy.renderComponent(
      <Modal data-test-id="custom-modal" onClose={() => {}}>
        Test Modal
      </Modal>,
    );
    cy.getById('custom-modal-wrapper')
      .should('be.visible')
      .and(
        'have.text',
        'Invalid Modal Children. Modal children can be of Header , Body or Footer',
      );
  });

  it('should close the modal when "Escape" key is pressed', () => {
    const onCloseSpy = cy.spy().as('onCloseSpy');

    cy.renderComponent(
      <Modal data-test-id="modal-test" open onClose={onCloseSpy} closeOnEscape>
        <Header data-test-id="modal-header">
          <span> Modal Header </span>
        </Header>
        <Body data-test-id="modal-body">
          <p> This is the modal body </p>
        </Body>
        <Footer data-test-id="modal-footer">
          <div>
            <Button data-test-id="modal-test-button" type="primary">
              Ok
            </Button>
          </div>
        </Footer>
      </Modal>,
    );
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@onCloseSpy').should('have.been.calledOnce');
  });

  it('should trigger onBackdropClick when backdrop is clicked', () => {
    const onBackdropClickSpy = cy.spy().as('onBackdropClickSpy');

    cy.renderComponent(
      <Modal
        data-test-id="modal-test"
        open
        onBackdropClick={onBackdropClickSpy}
      >
        <Header data-test-id="modal-header">
          <span> Modal Header </span>
        </Header>
        <Body data-test-id="modal-body">
          <p> This is the modal body </p>
        </Body>
        <Footer data-test-id="modal-footer">
          <div>
            <Button data-test-id="modal-test-button" type="primary">
              Ok
            </Button>
          </div>
        </Footer>
      </Modal>,
    );
    cy.get('body').click(0, 0);
    cy.get('@onBackdropClickSpy').should('have.been.calledOnce');
  });
});
