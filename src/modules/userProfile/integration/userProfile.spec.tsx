import * as Modules from 'src/modules/constants';
import {
  configWithCategoryLabels,
  groupingViewConfig,
  inputListViewConfig,
} from './data';

describe('UserProfile Component', () => {
  it('renders user profile module with grouping', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('client', 'namonboarding');
      window.localStorage.setItem('config', groupingViewConfig);
    });
    cy.renderModule(Modules.USER_PROFILE);
    cy.setScenario({
      userProfile: {
        section: 'groupingView',
      },
    });
    cy.getById('grouping_view').should('have.length', 4);
    cy.screenshot('renders user profile module with grouping view');
  });

  it('renders user profile module with inputFieldListView', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('client', 'namonboarding');
      window.localStorage.setItem('config', inputListViewConfig);
    });
    cy.renderModule(Modules.USER_PROFILE);
    cy.setScenario({
      userProfile: {
        section: 'inputFieldListView',
      },
    });

    cy.getById('user_item').should('have.length', 1);
    cy.screenshot('renders user profile module with input field list view');
  });

  it('renders user profile module with labels under categories', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('client', 'collections');
      window.localStorage.setItem('config', configWithCategoryLabels);
    });
    cy.renderModule(Modules.USER_PROFILE);
    cy.getById('group-category-label-wrapper').should('be.visible');
    cy.getById('group-category-label')
      .should('be.visible')
      .find('span')
      .contains('to apply')
      .should('be.visible');
    cy.getById('category-label-cta-wrapper')
      .should('be.visible')
      .find('button')
      .should('have.length', 1);
    cy.getById('category-label-cta-wrapper')
      .find('button')
      .first()
      .should('contain.text', 'Create an Application');
    cy.window().then((window) => {
      cy.stub(window, 'open').as('openWindow');
      cy.getById('category-label-cta-wrapper').find('button').first().click();
      cy.get('@openWindow').should('have.been.called');
    });
    cy.screenshot('renders user profile module with labels under categories');
  });
});
