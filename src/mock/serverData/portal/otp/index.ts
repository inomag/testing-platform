import { CypressRequest } from 'src/mock/serverData/types';
import resendAttemptsExhaustedResponse from './data/attemptsExhaustedResponse.json';
import responseBody from './data/default.json';
import flowLockedResponse from './data/flowLockedResponse.json';

export const sendOtp: CypressRequest = {
  url: 'portal/otp?portalId=',
  scenarioName: 'sendOtp',
  defaultScenario: {},
  currentScenario: {},
  request() {
    const statusCode = 200;
    if (this.currentScenario.isError) {
      return { statusCode: 500 };
    }

    if (this.currentScenario.isFlowLocked) {
      return { statusCode: 200, body: flowLockedResponse };
    }

    if (this.currentScenario.resendAttemptsExhausted) {
      return { statusCode: 200, body: resendAttemptsExhaustedResponse };
    }

    const body = responseBody;
    return { body, statusCode };
  },
};
