/* eslint-disable no-case-declarations */

/* eslint-disable complexity */

/* eslint-disable max-lines-per-function */
import _ from 'lodash';
import moment from 'moment';
import { getCurrentModule } from 'src/models/lmsConfig/queries';
import { CardConfig, CardRequestInfo, TabConfig } from './types';

export const singleCardRequest = (
  card: CardConfig,
  tab: TabConfig,
  user: string,
) => {
  const genericBody = {
    module: 'user',
    limit: 1,
    card_code: card.code,
    tab_code: tab.code,
    user_code: user,
  };

  const activityTypes = {
    pending_activities: 'pending_activity',
    upcoming_activities: 'next_activity',
    completed_activities: 'last_engagement',
  };
  switch (card.card_type) {
    case 'summary_card':
      return {
        type: 'post',
        api: `/v1/user_360_cards/mappings?card_code=${card.code}&tab_code=${tab.code}&user_code=${user}`,
        body: genericBody,
        cardCode: card.code,
      };

    case 'suggestions':
      return {
        type: 'post',
        api: `/v3/nudges?tz=${moment().format('Z').replace(':', '')}`,
        body: {
          nudgeType: 'SUGGESTION',
          showMore: false,
          timeStamp: new Date().getTime(),
          actionData: {},
          actionRequest: null,
          entity: { subuserId: user },
        },
        cardCode: card.code,
      };

    case 'profile':
      return null;
    case 'pending_activities':
    case 'upcoming_activities':
    case 'completed_activities':
      return {
        type: 'post',
        api: `/cs/web/calendar-items?source=web&tz=${moment()
          .format('Z')
          .replace(':', '')}`,
        body: {
          user_region: user,
          calendarType: activityTypes[card.card_type],
          limit: card.card_type === 'upcoming_activities' ? 1 : 3,
          filters: [
            {
              user_code: user,
            },
          ],
        },
        cardCode: card.code,
      };
    case 'referral_card':
      const currentModuleStartState =
        getCurrentModule(card.code)?.start_state || '';
      return {
        type: 'get',
        api: `/v2/bulk/leads?referred_by=${user}&start_state=${currentModuleStartState}`,
        body: genericBody,
        cardCode: card.code,
      };
    case 'audit_history':
      return {
        type: 'get',
        api: `/v1/vymo/audit/user?entity_id=${user}&from_web2=true`,
        body: genericBody,
        cardCode: 'audit_history',
      };
    case 'appointments':
      return {
        type: 'get',
        api: `/onboarding/v1/userProfile/fetchAppointments?category=appointments&usercode=${user}`,
        body: {
          category: 'appointments',
        },
        cardCode: card.code,
      };

    case 'licenses':
      return {
        type: 'get',
        api: `/onboarding/v1/userProfile/fetchLicenses?category=licenses&usercode=${user}`,
        body: {
          category: 'licenses',
        },
        cardCode: card.code,
      };

    default:
      return null;
  }
};
export const processCardsRequest = (tabs: TabConfig[], user: string) => {
  const requests: Array<CardRequestInfo> = [];

  tabs.forEach((tab) => {
    (tab.cards || []).forEach((card) => {
      const requestData: any = singleCardRequest(card, tab, user);
      if (requestData) {
        requests.push(requestData);
      }
    });
  });

  return requests;
};

export const getConvertedValues = (inputs: any[]) => {
  const values = {};
  inputs.forEach((input) => {
    values[input.code] = { value: input.value, code: input.code };
  });
  return values;
};

export const processDetailInputs = (sections, data) => {
  const groups: any = [];
  const combinedInputs: any = _.unionBy(
    data.user_360_inputs || [],
    data.inputs || [],
    'code',
  );

  const inputs: any = [];
  sections.forEach(({ code, name, attributes }) => {
    const sectionFieldCodes = (attributes || []).map((attr) => attr.code);

    const sectionFields = sectionFieldCodes
      .map((fieldCode) =>
        combinedInputs.find((input) => input.code === fieldCode),
      )
      .filter(Boolean);
    groups.push({
      code,
      name,
      fields: sectionFieldCodes,
    });
    inputs.push({ inputs: sectionFields, code, name });
  });

  return { groups, inputs };
};

export const getTagValue = (tag) => {
  if (!tag) return '';
  return tag.length <= 10 ? tag : `${tag.slice(0, 10)}...`;
};
