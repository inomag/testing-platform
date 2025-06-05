import moment from 'moment';
import {
  getConvertedValues,
  getTagValue,
  processCardsRequest,
  processDetailInputs,
} from './queries';
import { TabConfig } from './types';

describe('src/modules/user360/queries.spec.ts', () => {
  describe('processCardsRequest', () => {
    const currentTimezoneOffset = moment().format('Z').replace(':', '');

    it('should create a post request for a summary_card', () => {
      const tabs: TabConfig[] = [
        {
          code: 'highlights',
          name: 'Highlights',
          order: 1,
          scopeMappings: [],
          cards: [
            {
              code: 'summary',
              name: 'Summary',
              card_type: 'summary_card',
              order: 1,
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('post');
      expect(result[0].api).toBe(
        '/v1/user_360_cards/mappings?card_code=summary&tab_code=highlights&user_code=user123',
      );
      expect(result[0].body).toEqual({
        module: 'user',
        limit: 1,
        card_code: 'summary',
        tab_code: 'highlights',
        user_code: 'user123',
      });
    });

    it('should create post requests for pending, upcoming, and completed activities', () => {
      const tabs: TabConfig[] = [
        {
          code: 'engagement',
          name: 'Engagement',
          order: 3,
          scopeMappings: [],
          cards: [
            {
              code: 'pending_activities',
              name: 'Pending Activities',
              card_type: 'pending_activities',
              order: 1,
            },
            {
              code: 'upcoming_activities',
              name: 'Upcoming Activities',
              card_type: 'upcoming_activities',
              order: 2,
            },
            {
              code: 'completed_activities',
              name: 'Completed Activities',
              card_type: 'completed_activities',
              order: 3,
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);

      expect(result).toHaveLength(3);

      expect(result[0].type).toBe('post');
      expect(result[0].api).toBe(
        `/cs/web/calendar-items?source=web&tz=${currentTimezoneOffset}`,
      );
      expect(result[0].body).toEqual({
        calendarType: 'pending_activity',
        filters: [
          {
            user_code: 'user123',
          },
        ],
        user_region: 'user123',
        limit: 3,
      });

      expect(result[1].type).toBe('post');
      expect(result[1].api).toBe(
        `/cs/web/calendar-items?source=web&tz=${currentTimezoneOffset}`,
      );
      expect(result[1].body).toEqual({
        calendarType: 'next_activity',
        filters: [
          {
            user_code: 'user123',
          },
        ],
        user_region: 'user123',
        limit: 1,
      });

      expect(result[2].type).toBe('post');
      expect(result[2].api).toBe(
        `/cs/web/calendar-items?source=web&tz=${currentTimezoneOffset}`,
      );
      expect(result[2].body).toEqual({
        calendarType: 'last_engagement',
        filters: [
          {
            user_code: 'user123',
          },
        ],
        user_region: 'user123',
        limit: 3,
      });
    });

    it('should create a get request for referral_card', () => {
      const tabs: TabConfig[] = [
        {
          code: 'related_records',
          name: 'Related Records',
          cards: [
            {
              code: 'stage',
              name: 'Lead360',
              card_type: 'referral_card',
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('get');
      expect(result[0].api).toBe(
        '/v2/bulk/leads?referred_by=user123&start_state=',
      );
      expect(result[0].body).toEqual({
        module: 'user',
        limit: 1,
        card_code: 'stage',
        tab_code: 'related_records',
        user_code: 'user123',
      });
    });

    it('should create a get request for audit_history', () => {
      const tabs: TabConfig[] = [
        {
          code: 'history',
          name: 'History',
          cards: [
            {
              code: 'audit_history',
              name: 'Audit History',
              card_type: 'audit_history',
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('get');
      expect(result[0].api).toBe(
        `/v1/vymo/audit/user?entity_id=user123&from_web2=true`,
      );
      expect(result[0].body).toEqual({
        module: 'user',
        limit: 1,
        card_code: 'audit_history',
        tab_code: 'history',
        user_code: 'user123',
      });
    });

    it('should create a post request for profile details card', () => {
      const tabs: TabConfig[] = [
        {
          code: 'details',
          name: 'Details',
          order: 2,
          scopeMappings: [],
          cards: [
            {
              code: 'profile_details',
              name: 'Profile Details',
              card_type: 'profile',
              order: 1,
              sections: [
                {
                  code: 'personal_details',
                  name: 'Personal Details',
                  attributes: [
                    {
                      code: 'name',
                      name: 'Name',
                    },
                    {
                      code: 'phone',
                      name: 'Phone Test',
                    },
                    {
                      code: 'email',
                      name: 'Login Id Testing',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(0);
    });

    it('should return an empty array if no cards are present', () => {
      const tabs: TabConfig[] = [
        {
          code: 'empty_tab',
          name: 'Empty Tab',
          cards: [],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(0);
    });

    it('should handle unknown card types gracefully', () => {
      const tabs: TabConfig[] = [
        {
          code: 'unknown_tab',
          name: 'Unknown Tab',
          cards: [
            {
              code: 'unknown_card',
              name: 'Unknown Card',
              card_type: 'unknown_card_type',
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(0);
    });

    it('should handle multiple tabs with different cards', () => {
      const tabs: TabConfig[] = [
        {
          code: 'highlights',
          name: 'Highlights',
          cards: [
            {
              code: 'summary',
              name: 'Summary',
              card_type: 'summary_card',
            },
          ],
        },
        {
          code: 'engagement',
          name: 'Engagement',
          cards: [
            {
              code: 'pending_activities',
              name: 'Pending Activities',
              card_type: 'pending_activities',
            },
          ],
        },
      ];
      const user = 'user123';
      const result = processCardsRequest(tabs, user);
      expect(result).toHaveLength(2);
    });
  });

  describe('getConvertedValues', () => {
    it('should return an empty object when the input is an empty array', () => {
      const result = getConvertedValues([]);
      expect(result).toEqual({});
    });

    it('should return an object with one key-value pair when the input has one element', () => {
      const inputs = [{ code: 'input1', value: 'value1' }];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 'value1', code: 'input1' },
      });
    });

    it('should return an object with multiple key-value pairs when the input has multiple elements', () => {
      const inputs = [
        { code: 'input1', value: 'value1' },
        { code: 'input2', value: 'value2' },
        { code: 'input3', value: 'value3' },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 'value1', code: 'input1' },
        input2: { value: 'value2', code: 'input2' },
        input3: { value: 'value3', code: 'input3' },
      });
    });

    it('should handle inputs with the same code but different values (overwrite behavior)', () => {
      const inputs = [
        { code: 'input1', value: 'value1' },
        { code: 'input1', value: 'value2' },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 'value2', code: 'input1' },
      });
    });

    it('should handle inputs with undefined or null values', () => {
      const inputs = [
        { code: 'input1', value: undefined },
        { code: 'input2', value: null },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: undefined, code: 'input1' },
        input2: { value: null, code: 'input2' },
      });
    });

    it('should handle inputs with numeric values', () => {
      const inputs = [
        { code: 'input1', value: 123 },
        { code: 'input2', value: 456 },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 123, code: 'input1' },
        input2: { value: 456, code: 'input2' },
      });
    });

    it('should handle inputs with boolean values', () => {
      const inputs = [
        { code: 'input1', value: true },
        { code: 'input2', value: false },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: true, code: 'input1' },
        input2: { value: false, code: 'input2' },
      });
    });

    it('should return an object with proper keys even when there are spaces or special characters in the "code" field', () => {
      const inputs = [
        { code: 'input 1', value: 'value1' },
        { code: 'input@2', value: 'value2' },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        'input 1': { value: 'value1', code: 'input 1' },
        'input@2': { value: 'value2', code: 'input@2' },
      });
    });

    it('should handle inputs with empty string values', () => {
      const inputs = [
        { code: 'input1', value: '' },
        { code: 'input2', value: 'non-empty' },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: '', code: 'input1' },
        input2: { value: 'non-empty', code: 'input2' },
      });
    });

    it('should handle mixed types of inputs (numbers, strings, booleans, etc.)', () => {
      const inputs = [
        { code: 'input1', value: 'value1' },
        { code: 'input2', value: 123 },
        { code: 'input3', value: true },
        { code: 'input4', value: null },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 'value1', code: 'input1' },
        input2: { value: 123, code: 'input2' },
        input3: { value: true, code: 'input3' },
        input4: { value: null, code: 'input4' },
      });
    });

    it('should handle very large arrays efficiently', () => {
      const inputs = Array(10000).fill({ code: 'input1', value: 'value1' });
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: 'value1', code: 'input1' },
      });
    });

    it('should correctly handle inputs where the value is an array or object', () => {
      const inputs = [
        { code: 'input1', value: [1, 2, 3] },
        { code: 'input2', value: { key: 'value' } },
      ];
      const result = getConvertedValues(inputs);
      expect(result).toEqual({
        input1: { value: [1, 2, 3], code: 'input1' },
        input2: { value: { key: 'value' }, code: 'input2' },
      });
    });
  });

  describe('processDetailInputs', () => {
    it('should return empty groups and inputs when no sections or data are provided', () => {
      const result = processDetailInputs([], {
        user_360_inputs: [],
        inputs: [],
      });
      expect(result.groups).toEqual([]);
      expect(result.inputs).toEqual([]);
    });

    it('should process sections and data, ensuring no duplicates based on field codes', () => {
      const sections = [
        {
          code: 'section1',
          name: 'Section 1',
          attributes: [{ code: 'field1' }, { code: 'field2' }],
        },
        {
          code: 'section2',
          name: 'Section 2',
          attributes: [{ code: 'field3' }, { code: 'field4' }],
        },
      ];

      const data = {
        user_360_inputs: [
          { code: 'field1', value: 'value1' },
          { code: 'field3', value: 'value3' },
        ],
        inputs: [
          { code: 'field2', value: 'value2' },
          { code: 'field4', value: 'value4' },
          { code: 'field1', value: 'duplicate_value1' },
        ],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: ['field1', 'field2'] },
        { code: 'section2', name: 'Section 2', fields: ['field3', 'field4'] },
      ]);
      expect(result.inputs).toEqual([
        {
          inputs: [
            { code: 'field1', value: 'value1' },
            { code: 'field2', value: 'value2' },
          ],
          code: 'section1',
          name: 'Section 1',
        },
        {
          inputs: [
            { code: 'field3', value: 'value3' },
            { code: 'field4', value: 'value4' },
          ],
          code: 'section2',
          name: 'Section 2',
        },
      ]);
    });

    it('should handle sections with no matching inputs (both user_360_inputs and inputs)', () => {
      const sections = [
        {
          code: 'section1',
          name: 'Section 1',
          attributes: [{ code: 'field1' }],
        },
      ];

      const data = { user_360_inputs: [], inputs: [] };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: ['field1'] },
      ]);
      expect(result.inputs).toEqual([
        { inputs: [], code: 'section1', name: 'Section 1' },
      ]);
    });

    it('should handle sections with no attributes', () => {
      const sections = [
        { code: 'section1', name: 'Section 1', attributes: [] },
      ];

      const data = {
        user_360_inputs: [{ code: 'field1', value: 'value1' }],
        inputs: [{ code: 'field2', value: 'value2' }],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: [] },
      ]);
      expect(result.inputs).toEqual([
        { inputs: [], code: 'section1', name: 'Section 1' },
      ]);
    });

    it('should process sections with fields but no matching inputs and return empty inputs for those sections', () => {
      const sections = [
        {
          code: 'section1',
          name: 'Section 1',
          attributes: [{ code: 'field1' }],
        },
      ];

      const data = {
        user_360_inputs: [],
        inputs: [{ code: 'field2', value: 'value2' }],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: ['field1'] },
      ]);
      expect(result.inputs).toEqual([
        { inputs: [], code: 'section1', name: 'Section 1' },
      ]);
    });

    it('should correctly handle undefined or null attributes', () => {
      const sections = [
        { code: 'section1', name: 'Section 1', attributes: undefined },
        { code: 'section2', name: 'Section 2', attributes: null },
      ];

      const data = {
        user_360_inputs: [{ code: 'field1', value: 'value1' }],
        inputs: [{ code: 'field2', value: 'value2' }],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: [] },
        { code: 'section2', name: 'Section 2', fields: [] },
      ]);
      expect(result.inputs).toEqual([
        { inputs: [], code: 'section1', name: 'Section 1' },
        { inputs: [], code: 'section2', name: 'Section 2' },
      ]);
    });

    it('should process sections with matching inputs only in user_360_inputs or inputs', () => {
      const sections = [
        {
          code: 'section1',
          name: 'Section 1',
          attributes: [{ code: 'field1' }],
        },
        {
          code: 'section2',
          name: 'Section 2',
          attributes: [{ code: 'field2' }],
        },
      ];

      const data = {
        user_360_inputs: [{ code: 'field1', value: 'value1' }],
        inputs: [{ code: 'field2', value: 'value2' }],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: ['field1'] },
        { code: 'section2', name: 'Section 2', fields: ['field2'] },
      ]);
      expect(result.inputs).toEqual([
        {
          inputs: [{ code: 'field1', value: 'value1' }],
          code: 'section1',
          name: 'Section 1',
        },
        {
          inputs: [{ code: 'field2', value: 'value2' }],
          code: 'section2',
          name: 'Section 2',
        },
      ]);
    });

    it('should handle cases where some sections have no attributes and no matching inputs', () => {
      const sections = [
        { code: 'section1', name: 'Section 1', attributes: [] },
        {
          code: 'section2',
          name: 'Section 2',
          attributes: [{ code: 'field1' }],
        },
      ];

      const data = { user_360_inputs: [], inputs: [] };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: [] },
        { code: 'section2', name: 'Section 2', fields: ['field1'] },
      ]);
      expect(result.inputs).toEqual([
        { inputs: [], code: 'section1', name: 'Section 1' },
        { inputs: [], code: 'section2', name: 'Section 2' },
      ]);
    });

    it('should handle empty fields in sections', () => {
      const sections = [
        {
          code: 'section1',
          name: 'Section 1',
          attributes: [{ code: 'field1' }],
        },
        { code: 'section2', name: 'Section 2', attributes: [] },
      ];

      const data = {
        user_360_inputs: [{ code: 'field1', value: 'value1' }],
        inputs: [{ code: 'field2', value: 'value2' }],
      };

      const result = processDetailInputs(sections, data);

      expect(result.groups).toEqual([
        { code: 'section1', name: 'Section 1', fields: ['field1'] },
        { code: 'section2', name: 'Section 2', fields: [] },
      ]);
      expect(result.inputs).toEqual([
        {
          inputs: [{ code: 'field1', value: 'value1' }],
          code: 'section1',
          name: 'Section 1',
        },
        { inputs: [], code: 'section2', name: 'Section 2' },
      ]);
    });
  });

  describe('getTagValue', () => {
    it('should return an empty string when the tag is an empty string or falsy value', () => {
      expect(getTagValue('')).toBe('');
      expect(getTagValue(null)).toBe('');
      expect(getTagValue(undefined)).toBe('');
    });

    it('should return the tag as is when its length is 10 or less', () => {
      const shortTags = ['shortTag', 'abcdefghij', '1234567890'];
      shortTags.forEach((tag) => expect(getTagValue(tag)).toBe(tag));
    });

    it('should return the first 10 characters followed by "..." when the tag length is greater than 10', () => {
      const longTag = 'longTagThatShouldBeTruncated';
      expect(getTagValue(longTag)).toBe('longTagTha...');
    });
  });
});
