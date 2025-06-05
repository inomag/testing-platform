import _ from 'lodash';
import * as scenarioTypes from 'src/mock/serverData/scenarioTypes';
import * as severDataTypes from 'src/mock/serverData/types';

const serverDataObject: Record<string, severDataTypes.CypressRequest> = {};

export const initializeServerData = (
  serverDataList: Array<severDataTypes.CypressRequest>,
  scenario?: scenarioTypes.Scenario,
) => {
  cy.intercept('v2/selfserve/**', { hostname: 'localhost' }, (req) => {
    req.redirect(req.url.replace('v2/selfserve', 'public'));
  });
  for (let i = 0; i < serverDataList.length; i++) {
    const serverData = serverDataList[i];
    const { url, scenarioName, hostname = 'localhost' } = serverData;
    serverDataObject[scenarioName] = serverData;
    serverDataObject[scenarioName].currentScenario = {
      ...scenario?.[scenarioName],
    };
    cy.intercept(url, { hostname }, (req) => {
      const { redirectUrl, ...response } = serverData.request(req as any);
      req.reply(response);
      if (redirectUrl) {
        req.redirect(redirectUrl);
      }
    }).as(scenarioName);
  }
};

export const setScenario = (scenarios: scenarioTypes.Scenario) => {
  if (_.isEmpty(serverDataObject) || _.isEmpty(scenarios)) {
    return serverDataObject;
  }
  _.entries(scenarios).forEach(([key, value]) => {
    serverDataObject[key].currentScenario = {
      ...serverDataObject[key].defaultScenario,
      ...(value as Object),
    };
  });

  return true;
};
