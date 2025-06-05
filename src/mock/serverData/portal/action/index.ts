import { CypressRequest } from 'src/mock/serverData/types';
import documentSectionResponse from './documentSectionResponse.json';
import meetingSectionResponse from './meetingSectionResponse.json';
import validateResponse from './validate.json';

export const actionValidate: CypressRequest = {
  url: 'portal/recruitment/action/validate?portalId=',
  scenarioName: 'actionValidate',
  defaultScenario: {},
  currentScenario: {},
  request() {
    if (this.currentScenario.hasError) {
      return { body: { error: 'User details not found' }, statusCode: 403 };
    }
    return { body: validateResponse, statusCode: 200 };
  },
};

export const actionSubmit: CypressRequest = {
  url: 'portal/recruitment/action/submit?portalId=',
  scenarioName: 'actionSubmit',
  defaultScenario: {},
  currentScenario: {},
  request() {
    if (this.currentScenario.hasError) {
      return { statusCode: 500 };
    }
    if (this.currentScenario.documentSectionResponse) {
      return { body: documentSectionResponse, statusCode: 200 };
    }
    if (this.currentScenario.meetingSectionResponse) {
      return { body: meetingSectionResponse, statusCode: 200 };
    }
    return { body: {}, statusCode: 200 };
  },
};
