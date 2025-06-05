import { CypressRequest } from 'src/mock/serverData/types';
import responseBody from './data/default.json';

export const getHistory: CypressRequest = {
  url: 'https://embedexa-staging-ws.lms.getvymo.com:8123/chat_history?**',
  hostname: 'embedexa-staging-ws.lms.getvymo.com',
  scenarioName: 'getHistory',
  defaultScenario: {},
  currentScenario: {},
  request() {
    const statusCode = 200;
    if (this.currentScenario.isError) {
      return { statusCode: 500 };
    }

    if (this.currentScenario.isClearAPI) {
      return { statusCode: 200 };
    }

    const body = responseBody;
    return { body, statusCode };
  },
};
