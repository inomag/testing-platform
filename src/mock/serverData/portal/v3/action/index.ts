import { CypressRequest } from 'src/mock/serverData/types';
import genericResponse from '../data/genericResponse.json';
import multiLobOngoingResponse from '../data/multiLobOnGoingResponse.json';

export const actionV3: CypressRequest = {
  url: '/portal/v3/action/*',
  scenarioName: 'portalActionV3',
  defaultScenario: {},
  currentScenario: {},
  request() {
    switch (this.currentScenario.section) {
      case 'default':
      default:
        return {
          statusCode: 200,
          body: { ...genericResponse, ...multiLobOngoingResponse },
        };
    }
  },
};
