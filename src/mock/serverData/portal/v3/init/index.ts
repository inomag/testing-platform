import { CypressRequest } from 'src/mock/serverData/types';
import activityCardResponse from '../data/activityCardResponse.json';
import assessmentResponse from '../data/assessmentResponse.json';
import basicDetailsResponse from '../data/basicDetailsResponse.json';
import callbackResponse from '../data/callbackResponse.json';
import ckycDetailsResponse from '../data/ckycResponse.json';
import consentResponse from '../data/consentResponse.json';
import contractResponse from '../data/contractResponse.json';
import customLoaderResponse from '../data/customLoaderResponse.json';
import dataSyncResponse from '../data/dataSyncResponse.json';
import genericResponse from '../data/genericResponse.json';
import htmlResponse from '../data/htmlResponse.json';
import multiLobResponse from '../data/multiLobResponse.json';
import paymentResponse from '../data/paymentResponse.json';
import selectLicenseResponse from '../data/selectLicenseResponse.json';

export const initV3: CypressRequest = {
  url: 'portal/v3/init*',
  scenarioName: 'portalInitV3',
  defaultScenario: {},
  currentScenario: {},
  // eslint-disable-next-line complexity, max-lines-per-function
  request() {
    switch (this.currentScenario.section) {
      case 'multiLob':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...multiLobResponse },
        };
      case 'selectLicense':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...selectLicenseResponse },
        };
      case 'payment':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...paymentResponse },
        };
      case 'basicDetails':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...basicDetailsResponse },
        };
      case 'ckyc':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...ckycDetailsResponse },
        };
      case 'activityCard':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...activityCardResponse },
        };

      case 'error':
        return {
          statusCode: 400,
          body: { error: 'Internal Server Error' },
        };

      case 'contract':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...contractResponse },
        };
      case 'callbackAction':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...callbackResponse },
        };
      case 'consents':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...consentResponse },
        };
      case 'html':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...htmlResponse },
        };
      case 'customLoader':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...customLoaderResponse },
        };
      case 'dataSync':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...dataSyncResponse },
        };
      case 'assessment':
        return {
          statusCode: 200,
          body: { ...genericResponse, ...assessmentResponse },
        };
      case 'default':
      default:
        return {
          statusCode: 200,
          body: { ...genericResponse, ...basicDetailsResponse },
        };
    }
  },
};
