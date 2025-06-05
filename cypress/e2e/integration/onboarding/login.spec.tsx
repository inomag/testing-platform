describe('Onboarding login', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '/portal/v3/init*',
    }).as('initApi');
    cy.intercept({
      method: 'POST',
      url: '/portal/login/v2/action/*',
    }).as('authActionApi');
    cy.portalVisit('abc-recruitment-portal');
  });

  it('Distributor login should validate invalid pan number', () => {
    cy.wait('@initApi').then((response: any) => {
      // eslint-disable-next-line jest/valid-expect
      expect(response?.response?.statusCode).to.eq(401);

      const { body } = response.response;

      const { title, description } = body.result.template;

      cy.getByText('span', title).should('be.visible');
      cy.getByText('span', description).should('be.visible');

      cy.getInputByLabel('Full Name').should('be.visible').type('test');
      cy.getInputByLabel('PAN').should('be.visible').type('ABC');
      cy.getByText('button', 'Continue').should('be.visible').click();
      cy.getValidationByLabel('PAN')
        .should('be.visible')
        .should('have.text', 'PAN is not valid');
    });
  });

  it('Distributor login should submit with valid pan', () => {
    cy.wait('@initApi').then((response: any) => {
      // eslint-disable-next-line jest/valid-expect
      expect(response?.response?.statusCode).to.eq(401);

      const { body } = response.response;

      const { title, description } = body.result.template;

      cy.getByText('span', title).should('be.visible');
      cy.getByText('span', description).should('be.visible');

      cy.getInputByLabel('Full Name').should('be.visible').type('test');
      cy.getInputByLabel('PAN').clear().type('ABCPE1234F');
      cy.getByText('button', 'Continue').should('be.visible').click();

      cy.wait('@authActionApi').then((actionResponse: any) => {
        // eslint-disable-next-line jest/valid-expect
        expect(actionResponse?.response?.statusCode).to.eq(200);
      });
    });
  });
});
