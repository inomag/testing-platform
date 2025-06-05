import * as Modules from 'src/modules/constants';

describe('src/modules/uiBuilder/integration/builder', () => {
  it('should render builder module', () => {
    cy.renderModule(Modules.UI_BUILDER, { props: {} });
    // cy.wait(5000);
    cy.getById('atoms-collapsible').should('be.visible').click();
    cy.getById('Input-list-item').scrollIntoView().should('be.visible');
    cy.dragAndDrop({
      dropId: 'builder-mainPane',
      dragId: 'Input-list-item',
    });
    cy.dragAndDrop({
      dropId: 'builder-mainPane',
      dragId: 'Input-list-item',
    });
    // cy.dragAndDrop({ dropId: 'builder-canvas', dragId: 'Input-list-item' });
  });
});
