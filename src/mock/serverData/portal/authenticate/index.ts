import { CypressRequest } from 'src/mock/serverData/types';
import responseBody from './data/default.json';
import flowLockedResponse from './data/flowLockedResponse.json';
import wrongOtpResponse from './data/wrongOtpResponse.json';

export const verifyOtp: CypressRequest = {
  url: 'portal/authenticate?portalId=',
  scenarioName: 'verifyOtp',
  defaultScenario: {},
  currentScenario: {},
  request() {
    if (this.currentScenario.isError) {
      return { statusCode: 500 };
    }

    if (this.currentScenario.isWrongOtp) {
      return { statusCode: 200, body: wrongOtpResponse };
    }

    if (this.currentScenario.isFlowLocked) {
      return { statusCode: 200, body: flowLockedResponse };
    }

    return { body: responseBody, statusCode: 200 };
  },
};
