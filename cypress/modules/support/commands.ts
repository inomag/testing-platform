import '@cypress/code-coverage/support';
import 'cypress-plugin-tab';
import { mount } from 'cypress/react18';
import { CyHttpMessages } from 'cypress/types/net-stubbing';
import * as scenarioTypes from 'src/mock/serverData/scenarioTypes';
import type { FeatureFlag } from 'src/featureFlags';
import '../commands';
import {
  dragAndDrop,
  getRequest,
  getStoreData,
  renderComponentDefinition,
  renderModuleDefinition,
  setScenarioDefinition,
  unmountReactElement,
} from './definition';

export type Options = {
  props?: Record<string, string | number | boolean>;
  featureFlags?: Record<FeatureFlag, any> | {};
  scenario?: scenarioTypes.Scenario;
  route?: string;
};

export type RenderComponentOptions = {
  isStoreRequired?: boolean;
  isTestWrapperOnChangeStateRequired?: boolean;
};

declare global {
  interface Window {
    clientCode: string;
    Cypress: boolean;
    isCypressModule: boolean;
    store: Object;
  }
  namespace Cypress {
    interface Chainable {
      mount: (arg0) => void;
      getById: (selector: string) => Cypress.Chainable<JQuery<HTMLElement>>;
      renderModule: (string, options?: Options) => void;
      renderComponent: (ReactElement, options?: RenderComponentOptions) => void;
      setScenario: (scenarios: scenarioTypes.Scenario) => void;
      getRequest: (
        scenario: string,
      ) => Cypress.Chainable<CyHttpMessages.IncomingRequest>;
      getStoreData: (path: string) => Cypress.Chainable<Object>;
      dragAndDrop: ({
        dragId,
        dropId,
      }: {
        dragId: string;
        dropId: string;
      }) => Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mount', mount);

Cypress.Commands.add('getById', (selector) =>
  cy.get(`[data-test-id="${selector}"]`),
);

Cypress.Commands.add('renderModule', renderModuleDefinition);

Cypress.Commands.add('renderComponent', renderComponentDefinition);

Cypress.Commands.add('setScenario', setScenarioDefinition);

Cypress.Commands.add('getStoreData', getStoreData);

Cypress.Commands.add('getRequest', getRequest);

Cypress.Commands.add('dragAndDrop', dragAndDrop);

Cypress.on('test:after:run', () => unmountReactElement);

Cypress.on('uncaught:exception', () => false);
