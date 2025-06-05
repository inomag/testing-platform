import * as Modules from 'src/modules/constants';
import { setAuthScenarioType, setMetaData } from 'src/models/auth//slice';
import { MetaData } from 'src/models/auth/types';
import { store } from 'src/store';

describe('src/modules/auth/integration/auth', () => {
  it('should render Auth component with userID and type phone', () => {
    store.dispatch(setAuthScenarioType({ scenario: 'userId', type: 'PHONE' }));
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-phone').should('be.visible');
  });

  it('should render Auth component with userID and type email', () => {
    store.dispatch(setAuthScenarioType({ scenario: 'userId', type: 'EMAIL' }));
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email').should('be.visible');
  });

  it('should render Auth component with scenario setupAuth and type MPIN and same MPIN value', () => {
    store.dispatch(
      setMetaData({
        numberOfDigits: 6,
        client: 'abc',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'setupAuth', type: 'MPIN' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-mpin').should('be.visible');
    cy.getById('auth-module-confirm-mpin').should('be.visible');
    cy.getById('auth-module-mpin-input-0').type('123456');
    cy.getById('auth-module-confirm-mpin-input-0').type('123456');
    cy.getById('auth-section-error').should('not.exist');
  });

  it('should render Auth component with scenario userAuthentication and type PASSWORD', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: 'PASSWORD' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email-label')
      .should('be.visible')
      .and('contain.text', 'Password');
    cy.getById('auth-module-email')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter Password');
    cy.getById('auth-module-email')
      .clear()
      .type('password123')
      .should('have.value', 'password123');
  });

  it('should render Auth component with scenario userAuthentication and type OTP', () => {
    store.dispatch(
      setMetaData({
        forgotMpinConfig: {
          cta: { type: 'action', action: 'reset', title: 'Reset MPIN' },
        },
        numberOfDigits: 6,
        verificationAttemptsRemaining: 3,
        resendAttemptsRemaining: 5,
        resendOTPConfig: {
          enabled: true,
          interval: 5000,
          backoff: 0,
        },
        phone: '9897231231',
        countryCode: '',
        client: 'test',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: 'OTP' }),
    );

    cy.renderModule(Modules.AUTH);

    cy.get('span').contains('Enter OTP').should('be.visible');

    for (let index = 0; index < 6; index++) {
      cy.getById(`auth-module-otp-input-${index}`).should('be.visible');
    }

    cy.getById('auth-module-otp-resend')
      .should('be.visible')
      .and('contain.text', 'Resend OTP');
    cy.getById('cta-reset').should('be.visible').and('have.text', 'Reset MPIN');
  });

  it('should dispatch correct actions on CTA click', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    store.dispatch(
      setMetaData({
        forgotMpinConfig: {
          cta: { type: 'action', action: 'reset', title: 'Reset MPIN' },
        },
        numberOfDigits: 6,
        verificationAttemptsRemaining: 3,
        resendAttemptsRemaining: 5,
        resendOTPConfig: {
          enabled: true,
          interval: 5000,
          backoff: 0,
        },
        phone: '9897231231',
        countryCode: '',
        client: 'test',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: 'OTP' }),
    );

    cy.renderModule(Modules.AUTH);

    cy.getById('cta-reset')
      .should('be.visible')
      .and('have.text', 'Reset MPIN')
      .click();
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'appConfig/setApiStatus',
      payload: 'cta_clicked',
    });
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'auth/setCurrentCta',
      payload: {
        type: 'action',
        action: 'reset',
        title: 'Reset MPIN',
      },
    });
  });

  it('should dispatch correct actions on value change', () => {
    cy.spy(store, 'dispatch').as('dispatchSpy');

    store.dispatch(
      setMetaData({
        forgotMpinConfig: {
          cta: { type: 'action', action: 'reset', title: 'Reset MPIN' },
        },
        numberOfDigits: 6,
        verificationAttemptsRemaining: 3,
        resendAttemptsRemaining: 5,
        resendOTPConfig: {
          enabled: true,
          interval: 5000,
          backoff: 0,
        },
        phone: '9897231231',
        countryCode: '',
        client: 'test',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: 'OTP' }),
    );

    cy.renderModule(Modules.AUTH);

    cy.getById(`auth-module-otp-input-0`).type('1');
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'appConfig/setApiStatus',
      payload: undefined,
    });
    cy.get('@dispatchSpy').should('have.been.calledWith', {
      type: 'auth/setPayload',
      payload: {
        inputs: [
          {
            code: 'mpin',
            value: '1',
          },
        ],
        encryptPayload: true,
        valid: true,
      },
    });
  });

  it('should render Auth component with scenario userAuthentication and type MPIN', () => {
    store.dispatch(
      setMetaData({
        numberOfDigits: 6,
        client: 'abc',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: 'MPIN' }),
    );
    cy.renderModule(Modules.AUTH);

    cy.getById('auth-module-mpin')
      .should('exist')
      .find('span')
      .should('have.text', 'Enter MPIN');

    for (let index = 0; index < 6; index++) {
      cy.getById(`auth-module-mpin-input-${index}`).should('be.visible');
    }
    cy.getById('auth-module-mpin-input-6').should('not.exist');

    cy.getById('auth-module-mpin-input-0').type('123456');

    for (let index = 0; index < 6; index++) {
      cy.getById(`auth-module-mpin-input-${index}`).should(
        'have.value',
        index + 1,
      );
    }
  });

  it('should render Auth component with scenario userAuthentication and type undefined', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'userAuthentication', type: undefined }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email-label')
      .should('be.visible')
      .and('contain.text', 'Password');
    cy.getById('auth-module-email')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter Password');
    cy.getById('auth-module-email')
      .clear()
      .type('password123')
      .should('have.value', 'password123');
  });

  it('should render Auth component with scenario verifyUserInput and type EMAIL', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'verifyUserInput', type: 'EMAIL' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email-label')
      .should('be.visible')
      .and('contain.text', 'Email');
    cy.getById('auth-module-email')
      .should('be.visible')
      .invoke('attr', 'placeholder')
      .should('equal', 'Enter Email');
    cy.getById('auth-module-email')
      .clear()
      .type('a@a.com')
      .should('have.value', 'a@a.com');
  });

  it('should render Auth component with scenario verifyUserInput and type PHONE', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'verifyUserInput', type: 'PHONE' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email-label')
      .should('be.visible')
      .and('contain.text', 'Primary Phone Number');
    cy.getById('auth-module-email')
      .should('be.visible')
      .invoke('attr', 'placeholder')
      .should('equal', 'Enter 10 digit phone number');
    cy.getById('auth-module-email')
      .clear()
      .type('1234567890')
      .should('have.value', '1234567890');
  });

  it('should render Auth component with scenario verifyUserInput and type undefined', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'verifyUserInput', type: undefined }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-email-label')
      .should('be.visible')
      .and('contain.text', 'Primary Phone Number');
    cy.getById('auth-module-email')
      .should('be.visible')
      .invoke('attr', 'placeholder')
      .should('equal', 'Enter 10 digit phone number');
  });

  it('should render Auth component with scenario verifyUserAuth and type OTP', () => {
    store.dispatch(
      setMetaData({
        numberOfDigits: 6,
        verificationAttemptsRemaining: 3,
        resendAttemptsRemaining: 5,
        resendOTPConfig: {
          enabled: true,
          interval: 30000,
          backoff: 0,
        },
        phone: '9897231231',
        countryCode: '',
        requestId: '44d74c7f389b861a5974984aece4b11a',
        client: 'abc',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'verifyUserAuth', type: 'OTP' }),
    );

    cy.renderModule(Modules.AUTH);
    cy.getById('auth-module-otp').should('be.visible');
    cy.getById('auth-module-otp-input-0').type('123456');
  });

  it('should render Auth component with scenario verifyUserAuth and type OTP and click on resend button', () => {
    store.dispatch(
      setMetaData({
        numberOfDigits: 6,
        verificationAttemptsRemaining: 3,
        resendAttemptsRemaining: 5,
        resendOTPConfig: {
          enabled: true,
          interval: 30000,
          backoff: 0,
        },
        phone: '9897231231',
        countryCode: '',
        requestId: '44d74c7f389b861a5974984aece4b11a',
        client: 'abc',
      }),
    );
    store.dispatch(
      setAuthScenarioType({ scenario: 'verifyUserAuth', type: 'OTP' }),
    );
    cy.renderModule(Modules.AUTH, {
      scenario: {
        sendOtp: {
          isError: false,
        },
      },
    });
    cy.getById('auth-module-otp').should('be.visible');
    cy.getById('auth-module-otp-input-0').type('123456');
    cy.wait(30000).then(() => {
      cy.getById('auth-module-otp-resend').click();
      cy.getRequest('sendOtp')
        .its('body')
        .should((body) => {
          // @ts-ignore
          expect(JSON.stringify(body)).to.eq(
            '{"useCase":"agency","type":"OTP","client":"abc","visitor":{"requestId":"44d74c7f389b861a5974984aece4b11a","phone":{"countryCode":"","number":"9897231231"}},"device_details":{}}',
          );
        });
    });
  });

  it('should render Auth component with scenario loginType and type INTERNAL', () => {
    store.dispatch(
      setAuthScenarioType({ scenario: 'loginType', type: 'INTERNAL' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.getById('auth-wrapper-button')
      .should('be.visible')
      .and('have.text', 'Login with other options');
  });

  it('should render Auth component with scenario loginType and type EXTERNAL', () => {
    const metaData: MetaData = {
      providers: ['google', 'facebook'],
    };
    store.dispatch(setMetaData(metaData));
    store.dispatch(
      setAuthScenarioType({ scenario: 'loginType', type: 'EXTERNAL' }),
    );
    cy.renderModule(Modules.AUTH);
    cy.get('button').should('have.length', metaData.providers?.length);
    cy.getById('google-button')
      .should('be.visible')
      .and('have.text', 'Login with Google');
    cy.getById('facebook-button')
      .should('be.visible')
      .and('have.text', 'Login with Facebook');
  });

  it('should render Auth component with scenario loginType and type ALL', () => {
    const metaData: MetaData = {
      providers: ['google', 'facebook'],
    };
    store.dispatch(setMetaData(metaData));
    store.dispatch(setAuthScenarioType({ scenario: 'loginType', type: 'ALL' }));
    cy.renderModule(Modules.AUTH);
    cy.getById('google-button')
      .should('be.visible')
      .and('have.text', 'Login with Google');
    cy.getById('facebook-button')
      .should('be.visible')
      .and('have.text', 'Login with Facebook');
    cy.getById('auth-wrapper-button')
      .should('be.visible')
      .and('have.text', 'Login with other options');
  });
});
