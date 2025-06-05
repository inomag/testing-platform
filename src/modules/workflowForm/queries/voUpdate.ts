/* eslint-disable no-underscore-dangle */

/* eslint-disable complexity */

/* eslint-disable max-lines-per-function */
import _ from 'lodash';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  getCurrentModule,
  getCurrentModuleFromStartState,
  getCurrentUser,
  getFeaturesConfig,
  getLeadsAuthorizations,
  getModuleRolePermissions,
} from 'src/models/lmsConfig/queries';
import { getClientConfigData, getUsersList } from 'src/workspace/utils';

const APPROVER_CONIF_TO_USER_MAPPER = {
  scheduled: 'schedule_activity',
  logged: 'log_activity',
  reschedule: 'reschedule',
  complete: 'complete',
  edit: 'edit',
  cancel: 'cancel',
  reassign: 'reassign',
};

export const getVoUpdateAction = (state) => {
  switch (state) {
    case 'complete_inputs':
      return 'COMPLETE';
    case 'reschedule_inputs':
      return 'RESCHEDULE';
    case 'reassign_inputs':
      return 'REASSIGN';
    case 'edit_inputs':
      return 'EDIT';
    case 'cancel_inputs':
      return 'CANCEL';
    default:
      return '';
  }
};

const getFollowUpSifg = (followUpInput) => {
  const option = [
    { code: 'select', name: locale(Keys.SELECT) },
    { code: 'yes', name: locale(Keys.YES) },
    { code: 'no', name: locale(Keys.NO) },
  ];
  const inputs = {
    yes: followUpInput,
  };
  return {
    code: 'followUp',
    hint: locale(Keys.SCHEDULE_FOLLOWUP),
    required: true,
    type: 'sifg',
    sifg_options: {
      selection: {
        code: 'follow_up',
        hint: locale(Keys.SCHEDULE_FOLLOWUP),
        type: 'code_name_spinner',
        code_name_spinner_options: option,
        value: '',
        json: false,
        required: true,
        returnCode: false,
        follow_up_validate: true,
      },
      inputs,
    },
  };
};

const getUsersSpinner = (reassign_scopes = ['subordinates']) => {
  const userData = (reassign_scopes || ['subordinates'])
    .map((item) => getUsersList(item))
    .flat(); // _.get(store.getState(), 'root.app.users.subordinates', []);
  let spinnerOptions = [{ code: '', name: 'Select' }];
  spinnerOptions = _.concat(spinnerOptions, userData);
  return {
    type: 'code_name_spinner',
    code: 'reassign',
    hint: locale(Keys.SELECT_USER),
    code_name_spinner_options: spinnerOptions,
    required: true,
    json: true,
  };
};

export const getCustomOption = (user) => ({
  self: { code: user.code, name: user.name },
  managers: { code: 'managers', name: locale(Keys.MY_MANAGER) },
  direct_reports: {
    code: 'direct_reports',
    name: locale(Keys.MY_DIRECT_REPORTS),
  },
  peers: { code: 'peers', name: locale(Keys.MY_PEERS) },
  subordinates: {
    code: 'subordinates',
    name: locale(Keys.ALL_SUBORDINATES),
  },
  // Removing this custom Option as this alias not required for across all the clients. as per new NFR-2171
  // super_managers: { code: 'super_managers', name: StringUtils.getLabel(keys.ALL_SUPER_MANAGERS) },
});
// Get Participant field
const getParticipantField = (findCurrentTask, activity) => {
  const user = getCurrentUser();
  const customField = getCustomOption(user);

  const userData = getUsersList();

  const isParticipantsEnabled = _.get(
    findCurrentTask,
    'participants.enabled',
    false,
  );
  if (isParticipantsEnabled) {
    const participantsScope = _.get(findCurrentTask, 'participants.scope');
    let participantsOption: any = [];
    // Show custom tags on the top of the list
    participantsScope.forEach((scope) => {
      if (customField[scope]) {
        participantsOption.push(customField[scope]);
      }
    });
    participantsScope.forEach((scope) => {
      participantsOption = _.concat(
        participantsOption,
        customField[scope],
        userData[scope] || [],
      );
    });

    const participantsFilters = _.get(
      findCurrentTask,
      'participants.filters',
      {},
    );
    let participantsOptionAfterFilter = participantsOption.filter(
      (participants) => {
        let participantsFlag = true;
        _.forEach(participantsFilters, (f, k) => {
          if (
            participantsScope.indexOf(participants.code) > -1 ||
            participants.code === user.code
          ) {
            participantsFlag = participantsFlag && true;
          } else if (
            participantsFilters[k].indexOf(
              _.get(participants, 'attributes')[k],
            ) > -1
          ) {
            participantsFlag = participantsFlag && true;
          } else {
            participantsFlag = participantsFlag && false;
          }
        });
        return participantsFlag;
      },
    );
    const assignee = _.get(activity, 'data.user.code');
    participantsOptionAfterFilter = participantsOptionAfterFilter
      .filter((item) => item)
      .map((participant) => ({
        ...participant,
        label: participant.name,
        value: participant.code,
      }));
    const value = _.get(activity, 'data.participants', []);
    const multiSelectFieldValue = value
      .map((participant) => ({
        ...participant,
        label: participant.name,
        value: participant.code,
      }))
      .filter((participant) => participant.code !== assignee);
    return {
      code: 'participants',
      type: 'multi_select_check_box_user',
      singleSelect: false,
      hint: locale(Keys.SELECT_PARTICIPANTS),
      listTitle: locale(Keys.PARTICIPANTS),
      code_name_spinner_options: participantsOptionAfterFilter,
      max_required: _.get(
        findCurrentTask,
        'participants.max_required',
        Number.MAX_SAFE_INTEGER,
      ),
      min_required: _.get(findCurrentTask, 'participants.min_required', 0),
      required: _.get(findCurrentTask, 'participants.min_required', 0) > 0,
      selected: multiSelectFieldValue,
    };
  }
  return null;
};

export const getTaskNextStates = (activity: any = {}) => {
  if (_.isEmpty(activity)) {
    return [];
  }

  let startState = _.get(activity, 'data.vo.start_state');

  if (
    !startState &&
    _.get(activity, 'data.task.type', '') === 'google_calendar'
  ) {
    startState = _.get(
      getFeaturesConfig(),
      'google_integration.module_first_update_types',
      '',
    );
  }

  let module = getCurrentModuleFromStartState(startState || '');

  const tasks = _.get(module, 'tasks', []);
  let task = _.find(tasks, { code: _.get(activity, 'data.task.code') });

  if (
    activity.category === 'USER_CALENDAR_ITEM' ||
    (module && module.code === 'user_tasks')
  ) {
    module = getCurrentModule('user') || {};
    task = _.find(module.tasks, { code: _.get(activity, 'data.task.code') });
  }

  if (_.isEmpty(module) || _.isEmpty(task)) {
    return [];
  }

  const nextStates: any = [];
  let canUpdateTask =
    activity.state !== 'CANCELLED' && activity.state !== 'COMPLETED';
  const isActivityCompleted = activity.state === 'COMPLETED';

  if ((task.actions_enabled || []).includes('edit_on_completion')) {
    canUpdateTask = true;
  }

  if (_.isEmpty(task.actions_enabled) || !canUpdateTask) {
    return nextStates;
  }

  if (!isActivityCompleted && task.actions_enabled.indexOf('complete') > -1) {
    nextStates.push({
      code: 'complete_inputs',
      name: 'Complete',
      type: 'COMPLETE',
    });
  }

  if (!isActivityCompleted && task.actions_enabled.indexOf('reschedule') > -1) {
    nextStates.push({
      code: 'reschedule_inputs',
      name: 'Reschedule',
      type: 'RESCHEDULE',
    });
  }

  let isAllowedReassign;
  if (
    typeof _.get(getModuleRolePermissions(module.code), 'reassign', null) ===
    'boolean'
  ) {
    isAllowedReassign = _.get(
      getModuleRolePermissions(module.code),
      'reassign',
    );
  } else {
    isAllowedReassign = _.get(getLeadsAuthorizations(), 'reassign', false);
  }

  if (
    isAllowedReassign &&
    task &&
    task.actions_enabled &&
    task.actions_enabled.indexOf('reassign') !== -1
  ) {
    nextStates.push({
      code: 'reassign_inputs',
      name: 'Reassign',
      type: 'REASSIGN',
    });
  }

  if (!isActivityCompleted && task.actions_enabled.indexOf('edit') > -1) {
    nextStates.push({
      code: 'edit_inputs',
      name: 'Edit',
      type: 'EDIT',
    });
  }

  if (
    isActivityCompleted &&
    task.actions_enabled.indexOf('edit_on_completion') > -1
  ) {
    nextStates.push({
      code: 'edit_inputs',
      name: 'Edit',
      type: 'EDIT',
    });
  }

  if (!isActivityCompleted && task.actions_enabled.indexOf('cancel') > -1) {
    nextStates.push({
      code: 'cancel_inputs',
      name: 'Cancel',
      type: 'CANCEL',
    });
  }

  return nextStates;
};

export const getApprovalAcceptRejectInputFields = (
  activity,
  selectedState,
  allInputs,
) => {
  const module = _.get(
    activity,
    'data.task.approval_info.action_data.module',
    'user',
  );
  const config = getClientConfigData();
  const type = _.get(activity, 'data.task.approval_info.type');
  let taskCode = '';
  let task = [];
  let approvalConfigCode = '';
  const toState = _.get(activity, 'data.task.approval_info.action_data.state');
  const fromState = _.get(
    activity,
    'data.task.approval_info.action_data.from_state',
  );
  if (type === 'task') {
    taskCode = _.get(activity, 'data.task.approval_info.action_data.task_code');
    let action = _.get(activity, 'data.task.approval_info.action');
    action = action.toLowerCase();
    if (action === 'create') {
      action = _.get(
        activity,
        'data.task.approval_info.action_data.mode',
        'user',
      ).toLowerCase();
    }
    action = APPROVER_CONIF_TO_USER_MAPPER[action];
    if (module === 'user') {
      task = _.find(
        _.get(getCurrentModule('user'), 'approval_config_mapping'),
        {
          taskCode,
          action,
        },
      );
    } else {
      const leadModule = getCurrentModule(module);
      task = _.find(leadModule.approval_config_mapping, { taskCode, action });
    }
  } else if (type === 'vo') {
    const leadModule = getCurrentModule(module);
    task = _.find(leadModule.approval_config_mapping, {
      from: fromState,
      to: toState,
    });
  } else if (type === 'user') {
    const approvalConfigMapping = _.get(config, [
      `user_management_config`,
      `approval_config`,
      `approval_config_mappings`,
    ]);
    let actionCode = _.get(activity, [
      `data`,
      `task`,
      `approval_info`,
      `action`,
    ]);
    if (
      [`enable`, `disable`, `unlock`, `lock`, `revoke`, `delete`].includes(
        actionCode,
      )
    ) {
      actionCode = 'visibility_change';
    }
    task = _.get(
      approvalConfigMapping.filter((conf) => conf.action === actionCode),
      0,
    );
  }
  const approvalSetting = _.get(config, 'approval_setting');
  if (type !== 'bo') {
    approvalConfigCode = _.get(task, 'approval_config_code', '');
  }
  const actionTypeCode =
    selectedState === 'approval_item_approve'
      ? 'approve_inputs'
      : 'reject_inputs';
  const inputsMapper =
    approvalSetting?.[approvalConfigCode]?.[actionTypeCode]?.__default || [];

  const inputs = _.compact(
    // eslint-disable-next-line consistent-return
    _.map(inputsMapper, (ip) => {
      const inp = allInputs.find((input) => input.ssKey === ip);
      if (inp) {
        return inp;
      }
    }),
  );

  return inputs;
};

export const getTaskNextStateInputs = (
  lead,
  activity,
  selectedState,
  allInputs,
) => {
  let startState =
    lead.first_update_type || _.get(activity, 'data.vo.start_state');

  if (
    !startState &&
    _.get(activity, 'data.task.type', '') === 'google_calendar'
  ) {
    startState = _.get(
      getFeaturesConfig(),
      'google_integration.module_first_update_types',
      '',
    );
  }

  const isActivityCompleted = activity.state === 'COMPLETED';
  let module = getCurrentModuleFromStartState(startState);

  if (activity.category === 'APPROVAL_CALENDAR_ITEM') {
    return getApprovalAcceptRejectInputFields(
      activity,
      selectedState,
      allInputs,
    );
  }

  const tasks = _.get(module, 'tasks', []);
  let task = _.find(tasks, { code: _.get(activity, 'data.task.code') });

  if (
    activity.category === 'USER_CALENDAR_ITEM' ||
    (module && module === 'user_tasks')
  ) {
    module = getCurrentModule('user') || {};
    task = _.find(module.tasks, { code: _.get(activity, 'data.task.code') });
  }
  const allowParticipantUpdateOnEdit = _.get(
    task,
    'allow_participant_update_on_edit',
    false,
  );
  if (_.isEmpty(task) && _.isEmpty(module)) {
    return [];
  }

  const updateTaskInputs: any = [];
  let followUpInputs: any = [];

  // Pre-Populate Participants if user is in complete state

  let canShowParticipant =
    _.get(task, 'participation_check', false) &&
    _.get(task, 'participants.enabled', false) &&
    selectedState === 'complete_inputs';
  // NFR-2172: Allowing user to change the participants while edit the activity.

  if (
    selectedState === 'edit_inputs' &&
    allowParticipantUpdateOnEdit &&
    !isActivityCompleted
  ) {
    canShowParticipant = true;
  }
  if (canShowParticipant) {
    // Pushing Participant field with pre-populate values
    const participantField: any = getParticipantField(task, activity);
    if (participantField) {
      updateTaskInputs.push(participantField);
    }
  }

  const currentTaskInputs =
    task[selectedState][lead.last_update_type] || task[selectedState].__default;
  // Follow up input code
  if (task.can_follow_up && selectedState === 'complete_inputs') {
    followUpInputs =
      _.get(task, 'follow_up_inputs')[lead.last_update_type] ||
      _.get(task, 'follow_up_inputs').__default;
  }

  // For user update input fields
  if (!_.isEmpty(allInputs)) {
    if (selectedState === 'reassign_inputs') {
      const reassignScopes = _.get(task, 'reassign_scopes', ['subordinates']);
      updateTaskInputs.push(getUsersSpinner(reassignScopes));
    }

    _.forEach(currentTaskInputs, (ip) => {
      const inp = {
        ...(allInputs.find((input) => input.ssKey === ip) || {}),
      };
      if (!_.isEmpty(inp)) {
        if (inp.type !== 'label') {
          inp.value = '';
          if (
            selectedState === 'edit_inputs' ||
            selectedState === 'complete_inputs'
          ) {
            const editInputValue = _.get(activity, 'data.task.attributes', {});
            if (!_.isEmpty(editInputValue)) {
              if (inp.type === 'meeting') {
                inp.data = editInputValue[inp.code];
              } else if (inp.type === 'sifg') {
                _.set(inp, 'value', editInputValue[inp.code.slice(5)]);
                inp.inputsMap = editInputValue;
              } else {
                inp.value = editInputValue[inp.code];
              }
            }
          }
        } // resetting value provided from backend
        updateTaskInputs.push(inp);
      }
    });

    // followup inputs
    followUpInputs = _.compact(
      // eslint-disable-next-line consistent-return
      _.forEach(followUpInputs, (ip) => {
        const inp = {
          ...(allInputs.find((input) => input.ssKey === ip) || {}),
        };
        if (inp) {
          inp.value = ''; // resetting value provided from backend
          inp.follow_up_validate = true;
          return inp;
        }
      }),
    );

    if (!_.isEmpty(followUpInputs)) {
      const followUpSifg = getFollowUpSifg(followUpInputs);
      updateTaskInputs.push(followUpSifg);
    }
  }

  return updateTaskInputs;
};

const getUpdateInputsByState = (allInputs, selectedState, activity, lead) => {
  const { approvalActionType } = activity;
  const isApprovalConfig = activity.category === 'APPROVAL_CALENDAR_ITEM';
  const nextStates = getTaskNextStates(activity);
  if (isApprovalConfig) {
    nextStates.unshift({
      code:
        approvalActionType === 'APPROVE'
          ? 'approval_item_approve'
          : 'approval_item_reject',
      name: 'Approval',
    });
  }
  return getTaskNextStateInputs(lead, activity, selectedState, allInputs);
};

export const getTaskUpdateInputs = (
  values,
  allInputs,
  module,
  vo,
  moduleCode,
  activity,
  lead,
) => {
  const nextStates = getTaskNextStates(activity);
  const inputs: any = [];
  if (!_.isEmpty(nextStates)) {
    inputs.push({
      code: 'selectStateInput',
      hint: 'Select State',
      type: 'code_name_spinner',
      code_name_spinner_options: nextStates,
      required: true,
      returnCode: true,
    });

    if (values?.selectStateInput?.value) {
      const nextStateInputs =
        getUpdateInputsByState(
          allInputs,
          values.selectStateInput.value,
          activity,
          lead,
        ) || [];
      inputs.push(...nextStateInputs);
    }
  }

  return inputs;
};
