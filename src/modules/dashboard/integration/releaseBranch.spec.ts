import * as Modules from 'src/modules/constants';

describe('src/modules/dashboard/releaseBranch', () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    cy.renderModule(Modules.DASHBOARD, {
      props: { playgroundType: 'releaseBranch' },
    });
  });

  it('should render the Web Platform tab and its content', () => {
    cy.getById('releaseBranch-webPlatform').should('be.visible').click();
    // cy.getById('releaseBranchHistory-webPlatform').should('be.visible');
    cy.screenshot('renders Web Platform tab');
  });

  it('should render the Vymo Web tab and its content', () => {
    cy.getById('releaseBranch-vymoWeb').should('be.visible').click();
    cy.getById('releaseBranchHistory-vymoWeb').should('be.visible');
    cy.screenshot('renders Vymo Web tab');
  });

  it('should render the selfserve tab and its content', () => {
    cy.getById('releaseBranch-selfserve').should('be.visible').click();
    cy.getById('releaseBranchHistory-selfserve').should('be.visible');
    cy.screenshot('renders selfserve tab');
  });

  it('should switch between tabs and display the correct content', () => {
    // Switch to Web Platform tab
    cy.getById('releaseBranch-webPlatform').should('be.visible').click();
    // cy.getById('releaseBranchHistory-webPlatform').should(
    //   'contain',
    //   'Web Platform',
    // );
    cy.screenshot('switches to Web Platform tab');

    // Switch to Vymo Web tab
    cy.getById('releaseBranch-vymoWeb').should('be.visible').click();
    cy.getById('releaseBranchHistory-vymoWeb').should('be.visible');
    cy.screenshot('switches to Vymo Web tab');

    // Switch to selfserve tab
    cy.getById('releaseBranch-selfserve').should('be.visible').click();
    cy.getById('releaseBranchHistory-selfserve').should('be.visible');
    cy.screenshot('switches to selfserve tab');
  });
});
