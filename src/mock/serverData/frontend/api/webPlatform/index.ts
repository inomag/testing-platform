import { CypressRequest } from 'src/mock/serverData/types';
import responseBody from './data/default.json';

export const releaseBranches: CypressRequest = {
  url: 'frontend/api/**',
  scenarioName: 'frontendWebPlatform',
  defaultScenario: {},
  currentScenario: {},
  request() {
    const statusCode = 200;
    if (this.currentScenario.isError) {
      return { statusCode: 500 };
    }

    const body = responseBody;
    return { body, statusCode };
  },
};
