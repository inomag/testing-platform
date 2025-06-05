import { CypressRequest } from 'src/mock/serverData/types';
import actionsResponse from './data/actions.json';
import activitiesResponse from './data/activities.json';
import detailsResponse from './data/details.json';
import engagementResponse from './data/engagement.json';
import historyResponse from './data/history.json';

export const engagement: CypressRequest = {
  url: 'v1/user_360_cards/mappings?card_code=summary&tab_code=highlights*',
  scenarioName: 'engagement',
  defaultScenario: {},
  currentScenario: {},
  // eslint-disable-next-line complexity
  request() {
    return { body: engagementResponse, statusCode: 200 };
  },
};

export const activities: CypressRequest = {
  url: 'calendar-items*',
  scenarioName: 'activities',
  defaultScenario: {},
  currentScenario: {},
  request() {
    return { body: activitiesResponse, statusCode: 200 };
  },
};

export const details: CypressRequest = {
  url: 'users/profile/*',
  scenarioName: 'details',
  defaultScenario: {},
  currentScenario: {},
  request() {
    return { body: detailsResponse, statusCode: 200 };
  },
};

export const history: CypressRequest = {
  url: 'v1/vymo/audit/user*',
  scenarioName: 'history',
  defaultScenario: {},
  currentScenario: {},
  request() {
    return { body: historyResponse, statusCode: 200 };
  },
};

export const actions: CypressRequest = {
  url: 'v3/nudges*',
  scenarioName: 'actions',
  defaultScenario: {},
  currentScenario: {},
  request() {
    return { body: actionsResponse, statusCode: 200 };
  },
};
