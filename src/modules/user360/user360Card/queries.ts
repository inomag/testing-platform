/* eslint-disable no-dupe-else-if */

/* eslint-disable max-lines-per-function */

/* eslint-disable complexity */
import _ from 'lodash';
import moment from 'moment';
import { format as formatDate } from 'date-fns';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getClientConfigData } from 'src/workspace/utils';

const isCall = (taskType) =>
  taskType === 'inbound_call' || taskType === 'outbound_call';

const getDurationTitle = (time, onlyTitle = false) => {
  const duration = moment.duration(time);
  let title = '';
  if (duration.hours() > 0) {
    title += ` ${duration.hours()} hr`;
  }
  if (duration.minutes() > 0) {
    title += ` ${duration.minutes()} min`;
  }
  if (duration.hours() <= 0 && duration.seconds() > 0) {
    title += ` ${duration.seconds()} sec`;
  }
  title = title.slice(1);
  if (title !== '' && !onlyTitle) {
    title = `ᐧ ${title}`;
  }
  return title;
};

export const getSummaryTitle = (lastEngagement) => {
  if (_.isEmpty(lastEngagement) || _.isEmpty(lastEngagement.schedule?.date)) {
    return '';
  }
  const { schedule, name } = lastEngagement;
  const meetUpDate = formatDate(new Date(schedule?.date), 'dd MMM yyyy');
  let title = name;

  if (isCall(_.get(lastEngagement, 'data.task.type'))) {
    title = `${_.get(lastEngagement, 'name', '')}`;
  } else if (_.get(lastEngagement, 'data.task.type') === 'email') {
    if (
      _.get(lastEngagement, 'data.task.attributes.email_direction') ===
      'outgoing'
    ) {
      title = locale(Keys.OUTGOING_EMAIL);
    } else {
      title = locale(Keys.INCOMING_EMAIL);
    }
    title = `${title}`;
  } else if (_.get(lastEngagement, 'data.task.type') === 'zoom') {
    title = locale(Keys.ZOOM_MEETING);
  } else if (_.get(lastEngagement, 'data.task.type') === 'o365_calendar') {
    title = locale(Keys.OUTLOOK_CALENDAR);
  } else if (
    _.get(lastEngagement, 'data.task.content_share.medium') === 'vymo'
  ) {
    title = locale(Keys.SHARE_VIA_VYMO);
  } else if (
    _.get(lastEngagement, 'data.task.content_share.medium') === 'gmail' ||
    _.get(lastEngagement, 'data.task.code') === 'cs_email'
  ) {
    title = locale(Keys.SHARE_VIA_GMAIL);
  } else if (
    _.get(lastEngagement, 'data.task.content_share.medium') === 'outlook'
  ) {
    title = locale(Keys.SHARE_VIA_OUTLOOK);
  } else if (
    _.get(lastEngagement, 'data.task.code') === 'cs_whatsapp_device' ||
    _.get(lastEngagement, 'data.task.code', false) === 'cs_whatsapp'
  ) {
    title = locale(Keys.SHARE_VIA_WHATSAPP);
  } else if (
    _.get(lastEngagement, 'data.task.code') === 'cs_lw_broadcast' ||
    _.get(lastEngagement, 'data.task.type') === 'lw_chat'
  ) {
    title = locale(Keys.SHARE_VIA_LINEWORKS);
  } else if (
    _.get(lastEngagement, 'data.task.code', false) === 'cs_sms_device' ||
    _.get(lastEngagement, 'data.task.code', false) === 'cs_sms'
  ) {
    title = locale(Keys.SHARE_VIA_SMS);
  } else if (_.get(lastEngagement, 'data.task.type') === 'webex') {
    title = locale(Keys.SHARE_VIA_WEBEX_MEETING);
  }

  if (schedule?.duration) {
    return `${title} on ${String(meetUpDate)} for ${getDurationTitle(
      schedule?.duration,
      true,
    )}`;
  }
  return `${title} on ${String(meetUpDate)}`;
};

// const BODY_ICON_TO_CODE_MAP = {
//     'calendar': ,
//     'follow_up': images.nudges.nudges_followup,
//     'alert': images.nudges.nudges_alert,
//     'nba': images.nudges.nudges_nba,
//     'reminder': images.nudges.nudges_reminder,
//     'goal': images.nudges.nudges_goals,
//     'approval': images.nudges.nudges_alert,
//     'broadcast': images.nudges.announcements_indicator,
//     'notification': images.nudges.notifications_indicator,
//     'offers': images.nudges.offers,
//     'recommendation': images.nudges.products,
// }

export const processSuggestions = (data) =>
  data.map((suggestion) => ({
    ctas: suggestion.ctas,
    title: suggestion.body.title,
    message: suggestion.body.message,
    dateText: suggestion.date
      ? formatDate(new Date(suggestion.date), 'EEE, dd MMM  h:mm a')
      : '',
    tagText: suggestion.body.tag,
    tagColor: suggestion.body.tag === 'urgent' ? '#D3757D' : '#616CBF',
    iconResource: suggestion.body.displayIcon || 'notification',
  }));

const getDuration = (duration) => {
  duration.add(1, 'seconds');
  let durationString = '';
  if (duration.asMinutes() < 60) {
    const actualMinutes = duration.asMinutes();
    durationString = `${
      actualMinutes < 1 ? Math.ceil(actualMinutes) : Math.round(actualMinutes)
    } min`;
  } else if (Math.round(duration.asHours()) === 24) {
    durationString = locale(Keys.ALL_DAY);
  } else if (Math.round(duration.asHours()) > 24) {
    if (Math.floor(duration.days()) > 1) {
      durationString = `${Math.floor(duration.asDays())} days ${Math.floor(
        duration.hours(),
      )} hr ${Math.round(duration.minutes())} min`;
    } else {
      durationString = `${Math.floor(duration.asDays())} day ${Math.floor(
        duration.hours(),
      )} hr ${Math.round(duration.minutes())} min`;
    }
  } else if (duration.minutes() > 0) {
    durationString = `${Math.floor(duration.asHours())} hr ${Math.round(
      duration.minutes(),
    )} min`;
  } else {
    durationString = `${Math.round(duration.asHours())} hr`;
  }
  return durationString;
};

export const checkForCollectionTask = (data) => {
  const isCollectionTask = _.get(
    data,
    'calendar_item.data.task.attributes.activity_type',
    _.get(data, 'data.task.attributes.activity_type'),
  );
  if (isCollectionTask === 'DATE_TASK') {
    return true;
  }
  return false;
};

// const getTaskAction = ({ type, location, lead, user }) => {
//   switch (type) {
//     case 'meeting':
//       return _openMaps.bind(this, { lead, location, user });
//     case 'call':
//       return null;
//     default:
//       return '';
//   }
// };

// const getIconName = (type) => {
//   switch (type) {
//     case 'meeting':
//       return 'location';
//     case 'call':
//       return 'phone';
//     default:
//       return '';
//   }
// };

export const getActivityProps = (activity) => {
  const { schedule } = activity;
  let title; // used for time only
  const meetUp = new Date(schedule?.date);
  const nextMeeting = moment(meetUp);
  const date = nextMeeting.format('DD');
  const month = nextMeeting.format('MMM');
  const time = nextMeeting.format('DD MMM YYYY h:mm a');
  const duration = {
    hours: moment.duration(schedule.duration).asHours(),
    mins: moment.duration(schedule.duration).asMinutes(),
  };
  const endTime = nextMeeting
    .add(duration.mins, 'm')
    .format('DD MMM YYYY h:mm a');
  if (duration.mins === 0) {
    title = String(time);
  } else {
    title = `${String(time)} - ${String(endTime)}  ᐧ  ${getDuration(
      moment.duration(schedule.duration),
    )}`;
  }

  const { name } = activity;
  let iconName = '';
  const infoList: any = [];
  if (activity.data.task.type === 'meeting') {
    iconName = 'calendar';
  } else if (isCall(activity.data.task.type)) {
    iconName = 'call';
    title = `${String(time)} ${getDurationTitle(schedule.duration)}`;
  } else if (activity.data.task.type === 'email') {
    iconName = 'mail';
    const iconPath =
      _.get(activity, 'data.task.attributes.external_source') ||
      _.get(activity, 'meta_data.external_calendar_type', 'outlook');
    if (
      _.get(activity, 'data.task.attributes.email_direction') === 'outgoing'
    ) {
      infoList.push({
        title: locale(Keys.OUTGOING_EMAIL),
        iconPath: `email.outgoing.${iconPath}`,
      });
    } else {
      infoList.push({
        title: locale(Keys.INCOMING_EMAIL),
        iconPath: `email.incoming.${iconPath}`,
      });
    }
    title = `${String(time)}`;
  } else if (activity.data.task.type === 'zoom') {
    iconName = 'zoom';
    infoList.push({ title: locale(Keys.ZOOM_MEETING), iconPath: 'zoom' });
    title = `${String(time)} - ${String(endTime)} ${getDurationTitle(
      moment.duration(schedule.duration),
    )}`;
  } else if (activity.data.task.type === 'lw_chat') {
    infoList.push({
      title: locale(Keys.LINEWORKS),
      iconPath: 'integrations.lineworks',
    });
    title = `${String(time)}`;
  } else if (activity.data.task.type === 'o365_calendar') {
    infoList.push({
      title: locale(Keys.OUTLOOK_CALENDAR),
      iconPath: 'calendar.outlook',
    });
    title = `${String(time)}`;
  } else if (_.get(activity, 'data.task.type') === 'content_share') {
    if (_.get(activity, 'data.task.code') === 'cs_email') {
      if (_.get(activity, 'data.task.content_share.medium') === 'vymo') {
        infoList.push({
          title: locale(Keys.VIA_VYMO),
          iconPath: 'docs.vymo',
          color: '#2B87F4',
        });
      } else if (
        _.get(activity, 'data.task.content_share.medium') === 'gmail'
      ) {
        infoList.push({
          title: locale(Keys.VIA_GMAIL),
          iconPath: 'docs.gmail',
          color: '#2B87F4',
        });
      } else {
        infoList.push({
          title: locale(Keys.VIA_OUTLOOK),
          iconPath: 'docs.outlook',
          color: '#2B87F4',
        });
      }
    } else if (
      _.get(activity, 'data.task.code') === 'cs_whatsapp_device' ||
      _.get(activity, 'data.task.code', false) === 'cs_whatsapp'
    ) {
      infoList.push({
        title: locale(Keys.VIA_WHATSAPP),
        iconPath: 'docs.whatsapp',
        color: '#2B87F4',
      });
    } else if (activity.data.task.code === 'cs_lw_broadcast') {
      infoList.push({
        title: locale(Keys.VIA_LINEWORKS),
        iconPath: 'integrations.lineworks',
        color: '#2B87F4',
      });
    } else {
      infoList.push({
        title: locale(Keys.VIA_SMS),
        iconName: 'message',
        color: '#2B87F4',
      });
    }
  } else if (activity.data.task.type === 'webex') {
    iconName = 'webex';
    infoList.push({
      title: locale(Keys.WEBEX_MEETING),
      iconPath: 'webex',
    });
    title = `${String(time)} - ${String(endTime)} ${getDurationTitle(
      moment.duration(schedule.duration),
    )}`;
  } else if (_.get(activity, 'data.task.type') === 'content_share') {
    if (_.get(activity, 'data.task.type') === 'cs_email') {
      infoList.push({
        title: locale(Keys.VIA_GMAIL),
        iconPath: 'docs.gmail',
        color: '#2B87F4',
      });
    } else if (activity.data.task.code === 'cs_whatsapp_device') {
      infoList.push({
        title: locale(Keys.VIA_WHATSAPP),
        iconPath: 'docs.whatsapp',
        color: '#2B87F4',
      });
    } else {
      infoList.push({
        title: locale(Keys.VIA_SMS),
        iconName: 'message',
        color: '#2B87F4',
      });
    }
  }
  if (_.get(activity, 'data.user.name', '')) {
    infoList.push({
      title: _.get(activity, 'data.user.name', ''),
      iconName: 'leads',
    });
  }
  if (!checkForCollectionTask(activity)) {
    infoList.push({ title, iconName: 'calendar' });
  }

  const config = getClientConfigData();
  const { user } = config;
  const userRegion = _.get(user, 'region', false);
  const activityRegionHierarchy = _.get(
    activity,
    'data.user.region_hierarchy',
    [],
  );
  let showEditIcon = false;
  if (
    activityRegionHierarchy.includes(userRegion) &&
    _.get(activity, 'data.task.type') !== 'email' &&
    _.get(activity, 'data.task.type') !== 'zoom'
  ) {
    showEditIcon = true;
  }
  // const stateName = getStateName(_.capitalize(activity.state));
  // const stateInfo = {
  //   state: stateName,
  //   date: meetUp,
  //   activity,
  //   vymo_verification: _.get(activity, 'vymo_verification'),
  // };

  return { name, date, month, infoList, showEditIcon, userRegion, iconName };
};
