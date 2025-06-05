import * as Modules from 'src/modules/constants';

describe('src/modules/auth/integration/auth', () => {
  it('Should load auth page under module settings', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
    });
    cy.getById('auth-module-phone').should('be.visible').type('932999333');
    cy.getById('auth-module-phone-subMessage')
      .should('be.visible')
      .should('have.text', 'Please enter a valid phone number.');
    // check whether submit button is disabled
    cy.getById('auth-module-submit').should('be.disabled');
    cy.screenshot('Should load sample page under module settings');

    cy.getById('auth-module-phone').type('4');
    cy.getById('auth-module-phone-subMessage').should('not.exist');
    // check whether submit button is enabled
    cy.getById('auth-module-submit').should('be.enabled');

    cy.getById('auth-module-phone').type('4');
    cy.getById('auth-module-phone-subMessage')
      .should('be.visible')
      .should('have.text', 'Please enter a valid phone number.');
    // check whether submit button is disabled
  });

  it('Should click submit button', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: true,
        },
      },
    });

    cy.setScenario({
      sendOtp: {
        isError: false,
      },
    });

    cy.getById('auth-module-phone').should('be.visible').type('9999999999');

    cy.getById('auth-module-submit').should('be.enabled').click();
    cy.getRequest('sendOtp')
      .its('body')
      .should((body) => {
        // @ts-ignore
        expect(JSON.stringify(body)).to.eq(
          '{"useCase":"agency","type":"OTP","client":"test","visitor":{"phone":{"countryCode":"+91","number":"9999999999"}},"device_details":{},"locale":"en-IN","zone":"+0530"}',
        );
      });
    cy.getStoreData('auth.isAuthenticated').should('deep.equal', false);
  });

  it('should fill the otp by pasting in the  field and click continue', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: false,
        },
      },
    });

    cy.getById('auth-module-otp-continue').should('be.disabled');
    // filling the otp field
    cy.getStoreData('otpAuth.otpConfig.otpLength').then((length) => {
      const otpLength = parseInt(length.toString(), 10) || 6;
      let otp = '';
      for (let i = 0; i < otpLength; i++) {
        otp = otp.concat(`${i + 1}`);
      }
      cy.getById(`auth-module-otp-input-0`).type(otp);
    });

    cy.getById('auth-module-otp-continue').should('be.enabled').click();
    cy.getRequest('verifyOtp')
      .its('body')
      .should((body) => {
        // @ts-ignore
        expect(JSON.stringify(body)).to.eq(
          '{"otp":{"value":"123456"},"useCase":"agency","type":"OTP","visitor":{"phone":{}},"client":"","device_details":{},"locale":"en-IN","zone":"+0530"}',
        );
      });
    cy.getStoreData('otpAuth.currentState.isVerified').should(
      'deep.equal',
      true,
    );
  });

  it('should get error after filling the wrong otp in the field and click continue', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: true,
        },
      },
    });
    cy.getById('auth-module-phone').should('be.visible').type('9999999999');

    cy.getById('auth-module-submit').should('be.enabled').click();

    cy.getById('auth-module-otp-continue').should('be.disabled');
    // filling the otp field
    cy.getStoreData('otpAuth.otpConfig.otpLength').then((length) => {
      const otpLength = parseInt(length.toString(), 10) || 6;
      let otp = '';
      for (let i = 0; i < otpLength; i++) {
        otp = otp.concat(`${0}`);
      }
      cy.getById(`auth-module-otp-input-0`).type(otp);
    });

    cy.getById('auth-module-otp-continue').should('be.enabled').click();
    // cy.getStoreData('otpAuth.currentState.isVerified').should('deep.equal', false);
    cy.getRequest('verifyOtp')
      .its('body')
      .should((body) => {
        // @ts-ignore
        expect(JSON.stringify(body)).to.eq(
          '{"otp":{"requestId":"06d75790-6837-11ee-8ae3-1fd0207becc9","value":"000000"},"useCase":"agency","type":"OTP","visitor":{"phone":{"countryCode":"+91","number":"9999999999"}},"client":"test","device_details":{},"locale":"en-IN","zone":"+0530"}',
        );
      });
    cy.getById('auth-module-otp-error').should('be.visible');
  });

  it('should show error when retry OTP limit exceeded', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: false,
          isFlowLocked: true,
        },
      },
    });
    cy.getStoreData('otpAuth.otpConfig.otpLength').then((length) => {
      const otpLength = parseInt(length.toString(), 10) || 6;
      let otp = '';
      for (let i = 0; i < otpLength; i++) {
        otp = otp.concat(`${0}`);
      }
      cy.getById(`auth-module-otp-input-0`).type(otp);
    });
    cy.getById('auth-module-otp-continue').click();
    cy.getById('auth-module-otp-error')
      .should('be.visible')
      .contains(
        'Verify OTP limit exhausted. Try again after 2024-01-15 09:21:38',
      );
  });

  it('should resend otp on resend click', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: true,
        },
      },
    });

    cy.getById('auth-module-otp-resend').should('be.disabled');

    cy.wait(30000).then(() => {
      cy.getById('auth-module-otp-resend').should('be.enabled').click();
      cy.getById('auth-module-otp-success')
        .should('be.visible')
        .contains('OTP Sent Successfully');
    });
  });

  it('should go back on back click', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: true,
        },
      },
    });

    cy.getById('auth-module-otp-back').should('be.enabled').click();
    cy.getById('auth-module-phone').should('be.visible');
  });

  it('should disable OTP resend button when resend attempts are 0', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
          resendAttemptsExhausted: true,
        },
        verifyOtp: {
          isError: false,
          isWrongOtp: false,
        },
      },
    });
    cy.getById('auth-module-phone').type('9999999999');
    cy.getById('auth-module-submit').click();
    cy.getById('auth-module-otp-resend').should('be.disabled');
  });

  it('should show error message when flow is locked', () => {
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        sendOtp: {
          isError: false,
          isFlowLocked: true,
        },
      },
    });
    cy.getById('auth-module-otp-back').click();
    cy.getById('auth-module-phone').should('be.visible').type('9999999999');
    cy.getById('auth-module-submit').click();
    cy.getById('auth-module-error')
      .should('be.visible')
      .should(
        'have.text',
        'Resend OTP limit exhausted. Try again after 2024-01-15 13:29:17',
      );
  });
});

describe('src/modules/auth/integration/emailAuth', () => {
  it('should show email login component when login type is EMAIL', () => {
    cy.window().its('store').invoke('dispatch', {
      type: 'auth/setAuthenticated',
      payload: false,
    });
    cy.renderModule(Modules.LEGACY_AUTH, {
      props: { lastPage: 'Test page' },
      scenario: {
        init: {
          isAuthorized: false,
          emailLogin: true,
          hasError: false,
        },
      },
    });
    cy.getById('auth-module-email').should('be.visible');
  });
});
