import { CypressRequest } from 'src/mock/serverData/types';
import emptyResponse from './data/empty.json';
import groupingResponse from './data/groupingView.json';
import inputFieldListResponse from './data/inputFieldListView.json';

export const getUserProfile: CypressRequest = {
  url: '/users/tabs/profileEntity?*',
  scenarioName: 'userProfile',
  defaultScenario: {},
  currentScenario: {},
  request() {
    const statusCode = 200;
    let body = {};
    switch (this.currentScenario.section) {
      case 'groupingView':
        body = groupingResponse;
        break;
      case 'inputFieldListView':
        body = inputFieldListResponse;
        break;
      case 'empty':
      default:
        body = emptyResponse;
        break;
    }
    return { body, statusCode };
  },
};
