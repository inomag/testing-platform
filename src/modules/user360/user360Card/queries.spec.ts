import i18next from 'i18next';
import { format as formatDate } from 'date-fns';
import en from 'src/i18n/translations/en';
import {
  checkForCollectionTask,
  getActivityProps,
  getSummaryTitle,
  processSuggestions,
} from './queries';

describe('src/modules/user360/user360Card/queries.spec.ts', () => {
  beforeAll(async () => {
    await i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
      },
    });
  });

  describe('getSummaryTitle', () => {
    it('should return an empty string when lastEngagement is empty', () => {
      const result = getSummaryTitle({});
      expect(result).toBe('');
    });

    it('should return an empty string when lastEngagement.schedule.date is missing', () => {
      const result = getSummaryTitle({ schedule: {} });
      expect(result).toBe('');
    });

    it('should return formatted summary for inbound call', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { type: 'inbound_call' } },
        name: 'Test Call',
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule?.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Test Call on ${formattedDate}`);
    });

    it('should return formatted summary for outgoing email', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: {
          task: { type: 'email', attributes: { email_direction: 'outgoing' } },
        },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Outgoing Email on ${formattedDate}`);
    });

    it('should return formatted summary for Zoom meeting', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { type: 'zoom' } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Zoom Meeting on ${formattedDate}`);
    });

    it('should return formatted summary for Outlook Calendar', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { type: 'o365_calendar' } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Outlook Calendar on ${formattedDate}`);
    });

    it('should include duration if present', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z', duration: 3600000 },
        data: { task: { type: 'zoom' } },
      };
      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );
      const result = getSummaryTitle(engagement);

      expect(result).toBe(`Zoom Meeting on ${formattedDate} for 1 hr`);
    });

    it('should return a specific title for Share via Vymo', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { content_share: { medium: 'vymo' } } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Share Via Vymo on ${formattedDate}`);
    });

    it('should return a specific title for Share via Gmail', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { content_share: { medium: 'gmail' } } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Share Via Gmail on ${formattedDate}`);
    });

    it('should return a specific title for Share via WhatsApp', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { code: 'cs_whatsapp' } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Share Via WhatsApp on ${formattedDate}`);
    });

    it('should return a specific title for Share via LINEWORKS', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { code: 'cs_lw_broadcast' } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Share Via LINEWORKS on ${formattedDate}`);
    });

    it('should return a specific title for Webex meeting', () => {
      const engagement = {
        schedule: { date: '2025-03-05T10:00:00Z' },
        data: { task: { type: 'webex' } },
      };

      const formattedDate = formatDate(
        new Date(engagement.schedule.date),
        'dd MMM yyyy',
      );

      const result = getSummaryTitle(engagement);
      expect(result).toBe(`Share Via Webex Meeting on ${formattedDate}`);
    });
  });

  describe('processSuggestions', () => {
    it('should correctly process an array of suggestions', () => {
      const mockData = [
        {
          ctas: [{ label: 'View', action: 'view' }],
          body: {
            title: 'Meeting Reminder',
            message: 'You have a meeting in 30 minutes',
            tag: 'urgent',
            displayIcon: 'calendar',
          },
          date: '2025-03-06T14:30:00Z',
        },
        {
          ctas: [{ label: 'Complete', action: 'complete' }],
          body: {
            title: 'Task Due',
            message: 'Complete your weekly report',
            tag: 'normal',
            displayIcon: 'task',
          },
          date: '2025-03-07T10:00:00Z',
        },
      ];

      const result = processSuggestions(mockData);

      expect(result).toHaveLength(2);

      expect(result[0].ctas).toHaveLength(1);
      expect(result[0].ctas[0].label).toBe('View');
      expect(result[0].ctas[0].action).toBe('view');

      expect(result[0].title).toBe('Meeting Reminder');
      expect(result[0].message).toBe('You have a meeting in 30 minutes');
      expect(result[0].tagText).toBe('urgent');
      expect(result[0].tagColor).toBe('#D3757D');
      expect(result[0].iconResource).toBe('calendar');

      expect(result[1].ctas).toHaveLength(1);
      expect(result[1].ctas[0].label).toBe('Complete');
      expect(result[1].ctas[0].action).toBe('complete');

      expect(result[1].title).toBe('Task Due');
      expect(result[1].message).toBe('Complete your weekly report');
      expect(result[1].tagText).toBe('normal');
      expect(result[1].tagColor).toBe('#616CBF');
      expect(result[1].iconResource).toBe('task');
    });

    it('should handle missing date correctly', () => {
      const mockData = [
        {
          ctas: [{ label: 'Dismiss', action: 'dismiss' }],
          body: {
            title: 'System Update',
            message: 'System will be updated soon',
            tag: 'normal',
            displayIcon: 'system',
          },
        },
      ];

      const result = processSuggestions(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].dateText).toBe('');

      expect(result[0].ctas).toHaveLength(1);
      expect(result[0].ctas[0].label).toBe('Dismiss');
      expect(result[0].ctas[0].action).toBe('dismiss');

      expect(result[0].title).toBe('System Update');
      expect(result[0].message).toBe('System will be updated soon');
      expect(result[0].tagText).toBe('normal');
      expect(result[0].tagColor).toBe('#616CBF');
      expect(result[0].iconResource).toBe('system');
    });

    it('should use default icon when displayIcon is not provided', () => {
      const mockData = [
        {
          ctas: [],
          body: {
            title: 'General Notification',
            message: 'This is a general notification',
            tag: 'normal',
          },
          date: '2025-03-08T09:00:00Z',
        },
      ];

      const result = processSuggestions(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].iconResource).toBe('notification');

      expect(result[0].ctas).toHaveLength(0);
      expect(result[0].title).toBe('General Notification');
      expect(result[0].message).toBe('This is a general notification');
      expect(result[0].tagText).toBe('normal');
      expect(result[0].tagColor).toBe('#616CBF');
    });

    it('should correctly apply tag colors based on tag value', () => {
      const mockData = [
        {
          ctas: [],
          body: {
            title: 'Urgent Task',
            message: 'This needs immediate attention',
            tag: 'urgent',
            displayIcon: 'alert',
          },
          date: '2025-03-09T11:30:00Z',
        },
        {
          ctas: [],
          body: {
            title: 'Information',
            message: 'For your information',
            tag: 'info',
            displayIcon: 'info',
          },
          date: '2025-03-09T12:00:00Z',
        },
        {
          ctas: [],
          body: {
            title: 'Custom Tag',
            message: 'With custom tag',
            tag: 'custom',
            displayIcon: 'star',
          },
          date: '2025-03-09T13:00:00Z',
        },
      ];

      const result = processSuggestions(mockData);

      expect(result).toHaveLength(3);

      expect(result[0].tagText).toBe('urgent');
      expect(result[0].tagColor).toBe('#D3757D');
      expect(result[0].iconResource).toBe('alert');

      expect(result[1].tagText).toBe('info');
      expect(result[1].tagColor).toBe('#616CBF');
      expect(result[1].iconResource).toBe('info');

      expect(result[2].tagText).toBe('custom');
      expect(result[2].tagColor).toBe('#616CBF');
      expect(result[2].iconResource).toBe('star');
    });

    it('should handle empty array input', () => {
      const result = processSuggestions([]);
      expect(result).toEqual([]);
    });

    it('should preserve all original ctas', () => {
      const mockData = [
        {
          ctas: [
            { label: 'Accept', action: 'accept' },
            { label: 'Decline', action: 'decline' },
            { label: 'Maybe', action: 'maybe' },
          ],
          body: {
            title: 'Invitation',
            message: 'You are invited to an event',
            tag: 'normal',
            displayIcon: 'invite',
          },
          date: '2025-03-10T15:00:00Z',
        },
      ];

      const result = processSuggestions(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].ctas).toHaveLength(3);
      expect(result[0].ctas[0].label).toBe('Accept');
      expect(result[0].ctas[0].action).toBe('accept');
      expect(result[0].ctas[1].label).toBe('Decline');
      expect(result[0].ctas[1].action).toBe('decline');
      expect(result[0].ctas[2].label).toBe('Maybe');
      expect(result[0].ctas[2].action).toBe('maybe');

      expect(result[0].title).toBe('Invitation');
      expect(result[0].message).toBe('You are invited to an event');
      expect(result[0].tagText).toBe('normal');
      expect(result[0].tagColor).toBe('#616CBF');
      expect(result[0].iconResource).toBe('invite');
    });
  });

  describe('checkForCollectionTask', () => {
    it('should return true when activity_type is "DATE_TASK" under calendar_item', () => {
      const data = {
        calendar_item: {
          data: {
            task: {
              attributes: {
                activity_type: 'DATE_TASK',
              },
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(true);
    });

    it('should return true when activity_type is "DATE_TASK" under data', () => {
      const data = {
        data: {
          task: {
            attributes: {
              activity_type: 'DATE_TASK',
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(true);
    });

    it('should return false when activity_type is not "DATE_TASK" under calendar_item', () => {
      const data = {
        calendar_item: {
          data: {
            task: {
              attributes: {
                activity_type: 'OTHER_TASK',
              },
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });

    it('should return false when activity_type is not "DATE_TASK" under data', () => {
      const data = {
        data: {
          task: {
            attributes: {
              activity_type: 'OTHER_TASK',
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });

    it('should return false when activity_type is missing in both calendar_item and data', () => {
      const data = {
        calendar_item: {
          data: {
            task: {
              attributes: {},
            },
          },
        },
        data: {
          task: {
            attributes: {},
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });

    it('should return false when calendar_item is missing', () => {
      const data = {
        data: {
          task: {
            attributes: {
              activity_type: 'OTHER_TASK',
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });

    it('should return false when both calendar_item and data are missing', () => {
      const data = {};

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });

    it('should return false when activity_type is undefined', () => {
      const data = {
        calendar_item: {
          data: {
            task: {
              attributes: {},
            },
          },
        },
      };

      const result = checkForCollectionTask(data);

      expect(result).toBe(false);
    });
  });

  describe('getActivityProps', () => {
    const baseActivity = {
      name: 'Test Activity',
      schedule: {
        date: '2025-03-05T10:00:00Z',
        duration: 5400000,
      },
      data: {
        task: {
          type: 'meeting',
        },
      },
    };

    it('should return correct activity properties for a meeting', () => {
      const activity = { ...baseActivity, data: { task: { type: 'meeting' } } };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('calendar');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });

    it('should return correct activity properties for a call', () => {
      const activity = {
        ...baseActivity,
        data: { task: { type: 'inbound_call' } },
      };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('call');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });

    it('should return correct activity properties for an email', () => {
      const activity = {
        ...baseActivity,
        data: {
          task: { type: 'email', attributes: { email_direction: 'outgoing' } },
        },
      };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('mail');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });

    it('should return correct activity properties for a zoom meeting', () => {
      const activity = { ...baseActivity, data: { task: { type: 'zoom' } } };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('zoom');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });

    it('should return correct activity properties for content share via Vymo', () => {
      const activity = {
        ...baseActivity,
        data: {
          task: {
            type: 'content_share',
            code: 'cs_email',
            content_share: { medium: 'vymo' },
          },
        },
      };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });

    it('should return correct activity properties for content share via WhatsApp', () => {
      const activity = {
        ...baseActivity,
        data: {
          task: {
            type: 'content_share',
            code: 'cs_whatsapp_device',
          },
        },
      };
      const result = getActivityProps(activity);

      expect(result.name).toBe('Test Activity');
      expect(result.date).toBe('05');
      expect(result.month).toBe('Mar');
      expect(result.iconName).toBe('');
      expect(result.showEditIcon).toBe(false);
      expect(result.userRegion).toBe(false);
    });
  });
});
