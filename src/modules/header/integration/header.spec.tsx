import React from 'react';
// eslint-disable-next-line vymo-ui/restrict-import
import * as genericResponse from 'src/mock/serverData/portal/v3/data/genericResponse.json';
import * as Modules from 'src/modules/constants';
import { setPortalConfig } from 'src/models/portalConfig//slice';
import { store } from 'src/store';
import Header from '../index';

describe('Header component with empty portalConfig', () => {
  it('should not render the header component', () => {
    cy.renderModule(Modules.HEADER);
    cy.get('[data-test-id="app-header"]').should('not.exist');
  });
});

describe('Header component with defined portalConfig', () => {
  it('should render the header component', () => {
    store.dispatch(
      setPortalConfig({
        // @ts-ignore
        portalConfig: genericResponse.portalConfig,
        client: 'abc',
      }),
    );
    cy.renderComponent(<Header />);
    cy.get('[data-test-id="app-header"]').should('be.visible');
    cy.get('[data-test-id="app-header"] img')
      .should('have.attr', 'src', 'https://i.postimg.cc/fLkKqYzm/abslamc.png')
      .and('have.attr', 'width', '90')
      .and('have.attr', 'height', '48');
  });
});
