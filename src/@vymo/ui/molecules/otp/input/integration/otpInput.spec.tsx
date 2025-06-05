import React from 'react';
import OTP from 'src/@vymo/ui/molecules/otp';
import OTPInput from 'src/@vymo/ui/molecules/otp/input';

describe('OTP and OTPInput Component', () => {
  it('should render the basic otp component correctly', () => {
    cy.renderComponent(<OTP verifyEndpoint="" resendEndpoint="" />);
    cy.getById('auth-module-otp-resend').should('be.visible');
    cy.getById('auth-module-otp-resend').should('have.text', 'Resend OTP');
    cy.getById('auth-module-otp-back').should('be.visible');
    cy.getById('auth-module-otp-back').should('have.text', 'Back');
    cy.getById('auth-module-otp-continue').should('be.visible');
    cy.getById('auth-module-otp-continue').should('have.text', 'Continue');
  });
  it('should render the basic otpInput component with four boxes correctly', () => {
    cy.renderComponent(
      <OTPInput
        onVerify={() => {}}
        onResend={() => {}}
        onBack={() => {}}
        numOfBoxes={4}
        error=""
        resendTimer={8000}
        isLoading={false}
        userId="1"
        otpResendsRemaining={2}
        data-test-id="custom-otp-input"
      />,
    );
    cy.getById('custom-otp-input-resend').should('be.visible');
    cy.getById('custom-otp-input-resend').should('have.text', 'Resend OTP');
    cy.getById('custom-otp-input-back').should('be.visible');
    cy.getById('custom-otp-input-back').should('have.text', 'Back');
    cy.getById('custom-otp-input-continue').should('be.visible');
    cy.getById('custom-otp-input-continue').should('have.text', 'Continue');
  });
});
