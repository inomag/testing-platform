import { CypressRequest } from 'src/mock/serverData/types';
import documentResponse from '../action/documentSectionResponse.json';
import groupedInputResponse from '../action/groupedInputResponse.json';
import infoResponse from '../action/infoSectionResponse.json';
import meetingResponse from '../action/meetingSectionResponse.json';
import validateResponse from '../action/validate.json';
import aadharResponse from './data/aadhar.json';
import assistedOnbResponse from './data/assistedOnbResponse.json';
import responseBody from './data/default.json';
import emailLoginResponse from './data/emailLoginResponse.json';
import esignMetaResponse from './data/esignMetaResponse.json';
import esignResponse from './data/esignResponse.json';
import tableSectionResponse from './data/tableSectionResponse.json';
import termsAndConditionsResponse from './data/termsAndConditionsResponse.json';
import unauthorisedResponse from './data/unauthorisedResponse.json';

export const init: CypressRequest = {
  url: 'portal/recruitment/init?portalId=',
  scenarioName: 'init',
  defaultScenario: {},
  currentScenario: {},
  // eslint-disable-next-line complexity
  request() {
    if (this.currentScenario.hasError) {
      return { statusCode: 500 };
    }
    if (!this.currentScenario.isAuthorized) {
      if (this.currentScenario.emailLogin) {
        return { body: emailLoginResponse, statusCode: 401 };
      }
      return { body: unauthorisedResponse, statusCode: 401 };
    }
    if (this.currentScenario.isAssistedOnboarding) {
      return { body: assistedOnbResponse, statusCode: 200 };
    }
    switch (this.currentScenario.section) {
      case 'aadhar':
        return { body: aadharResponse, statusCode: 200 };
      case 'inputform':
        return { body: validateResponse, statusCode: 200 };
      case 'multimedia':
        return { body: documentResponse, statusCode: 200 };
      case 'info':
        return { body: infoResponse, statusCode: 200 };
      case 'meeting':
        return { body: meetingResponse, statusCode: 200 };
      case 'groupedFields':
        return { body: groupedInputResponse, statusCode: 200 };
      case 'table':
        return { body: tableSectionResponse, statusCode: 200 };
      case 'esign':
        return { body: esignResponse, statusCode: 200 };
      case 'termsAndConditions':
        return { body: termsAndConditionsResponse, statusCode: 200 };
      default:
        return { body: responseBody, statusCode: 200 };
    }
  },
};

export const esign: CypressRequest = {
  url: 'portal/e-sign',
  scenarioName: 'esign',
  defaultScenario: {},
  currentScenario: {},
  request() {
    return { body: esignMetaResponse, statusCode: 200 };
  },
};
