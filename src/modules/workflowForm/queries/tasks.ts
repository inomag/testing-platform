/* eslint-disable max-lines-per-function */

/* eslint-disable complexity */
import _ from 'lodash';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getCurrentUser } from 'src/models/lmsConfig/queries';
import { getUsersList } from 'src/workspace/utils';

const getActivityOptions = (type, module, vo) => {
  const tasks = _.get(module, 'tasks', []);
  const currentModuleTasks = _.get(module, `${type}_tasks`, []);
  const taskOptions: any = [];

  if (
    _.get(module, 'tasks_enabled', false) &&
    tasks.length > 0 &&
    currentModuleTasks.length > 0
  ) {
    taskOptions.push({ code: 'select', name: 'Select' });
    _.forEach(currentModuleTasks, (task) => {
      const voTask = _.find(tasks, { code: task });
      if (!voTask || !_.includes(currentModuleTasks, voTask?.code)) return;

      if (
        !_.isEmpty(voTask) &&
        !_.isEmpty(vo) &&
        !_.isEmpty(voTask.attributes)
      ) {
        let isTaskEnableForCurrentVO = true;
        _.each(voTask.attributes, (attr) => {
          const inputsMap = _.get(vo, 'inputs_map', {});
          _.forEach(attr.value, (obj) => {
            isTaskEnableForCurrentVO =
              isTaskEnableForCurrentVO &&
              _.toLower(obj) === _.toLower(inputsMap[attr.code]);
          });
        });
        if (isTaskEnableForCurrentVO) {
          if (
            (type === 'log' && _.get(voTask, 'can_log', true)) ||
            (type === 'schedule' && _.get(voTask, 'can_schedule', true))
          ) {
            taskOptions.push({
              code: voTask.code,
              name: voTask.quick_name || voTask.name,
              current_module: module,
              task_group: true,
            });
          }
        }
      } else if (
        (type === 'log' && _.get(voTask, 'can_log', true)) ||
        (type === 'schedule' &&
          _.get(voTask, 'can_schedule', true) &&
          !_.isEmpty(voTask))
      ) {
        taskOptions.push({
          code: voTask.code,
          name: voTask.quick_name || voTask.name,
          current_module: module,
          task_group: true,
        });
      }
    });
  }
  return taskOptions;
};

const getAssigneesInput = (customField, currentTask, user, userData) => {
  const assigneeScope = _.get(currentTask, 'assignees.scope', []);
  let assigneeOption = _.flatMap(assigneeScope, (scope) => {
    const customValues = customField[scope]
      ? _.castArray(
          scope !== 'super_managers' &&
            (scope === 'self' ||
              !_.isEmpty(_.get(userData[scope], 'results', [])))
            ? customField[scope]
            : [],
        )
      : [];

    const userResults = _.get(userData[scope], 'results', []);

    return [...customValues, ...userResults];
  });

  assigneeOption = _.concat(
    assigneeOption,
    ..._.map(assigneeScope, (scope) => userData[scope] || []),
  );

  const assigneeFilters = _.get(currentTask, 'assignees.filters', {});
  const assigneeOptionAfterFilter = _.filter(assigneeOption, (assignee) =>
    _.every(
      assigneeFilters,
      (f, k) =>
        assigneeScope.includes(assignee.code) ||
        assignee.code === user.code ||
        _.includes(f, _.get(assignee, `attributes.${k}`)),
    ),
  );

  const userCode = user.code;
  const userFromAssignees = [
    _.find(assigneeOptionAfterFilter, { code: userCode }),
  ];
  const uniqueAssignees = _.keyBy(assigneeOptionAfterFilter, 'code');

  return {
    code: 'assignees',
    type: 'multi_select_check_box_user',
    singleSelect:
      _.get(currentTask, 'assignees.max_required', Number.MAX_SAFE_INTEGER) ===
      1,
    hint: locale(Keys.SELECT_ASSIGNEES),
    listTitle: locale(Keys.ASSIGNEES),
    options: Object.keys(uniqueAssignees).map((o) => ({
      code: o,
      name: _.get(uniqueAssignees, [o, 'name']),
    })),
    max_required: _.get(
      currentTask,
      'assignees.max_required',
      Number.MAX_SAFE_INTEGER,
    ),
    min_required: _.get(currentTask, 'assignees.min_required', 0),
    required: _.get(currentTask, 'assignees.min_required', 0) > 0,
    value: userFromAssignees,
  };
};

const getParticipantsInput = (customField, currentTask, user, userData, vo) => {
  const participantsScope = _.get(currentTask, 'participants.scope', []);
  const participantsOption = _.flatMap(participantsScope, (scope) => {
    const customValues = customField[scope]
      ? _.castArray(customField[scope])
      : [];
    const userValues = _.get(userData, scope, []);

    return [...customValues, ...userValues];
  });

  const participantsFilters = _.get(currentTask, 'participants.filters', {});
  const participantsOptionAfterFilter = _.filter(
    participantsOption,
    (participant) =>
      _.every(
        participantsFilters,
        (f, k) =>
          participantsScope.includes(participant.code) ||
          participant.code === user.code ||
          _.includes(f, _.get(participant, `attributes.${k}`)),
      ),
  );

  const uniqueParticipants = _.keyBy(participantsOptionAfterFilter, 'code');
  const maxRequired = _.get(
    currentTask,
    'participants.max_required',
    Number.MAX_SAFE_INTEGER,
  );
  const minRequired = _.get(currentTask, 'participants.min_required', 0);

  return {
    code: 'participants',
    type: 'multi_select_check_box_user',
    singleSelect: maxRequired === 1,
    hint: locale(Keys.SELECT_PARTICIPANTS),
    listTitle: locale(Keys.PARTICIPANTS),
    options: _.map(uniqueParticipants, (p, value) => ({
      code: value,
      name: p.name,
    })),
    max_required: maxRequired,
    min_required: minRequired,
    required: minRequired > 0,
    value: _.map(_.get(vo, 'data.participants', []), (p) => ({
      value: p.code,
      label: p.name,
    })),
  };
};

const getCurrentModuleUserInputs = (type, activity, module, vo, moduleCode) => {
  const inputs: any = [];
  const currentTask = _.find(module.tasks, { code: activity });
  const user = getCurrentUser();
  const customField = {
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
  };
  const userData = getUsersList();
  const assigneesEnabled = _.get(currentTask, 'assignees.enabled', false);
  const participantsEnabled = _.get(currentTask, 'participants.enabled', false);
  const multiVosEnabled = _.get(currentTask, 'vos.multi_vo', false);

  if (assigneesEnabled) {
    inputs.push(getAssigneesInput(customField, currentTask, user, userData));
  }

  if (participantsEnabled) {
    inputs.push(
      getParticipantsInput(customField, currentTask, user, userData, vo),
    );
  }

  if (multiVosEnabled && moduleCode !== 'user') {
    const multiVos: any = {
      code: 'multi_vos',
      type: 'multi_select_check_box_user',
      subtype: 'vos',
      singleSelect: false,
      hint: `${locale(Keys.SELECT)} ${_.get(
        module,
        'name',
        locale(Keys.REFERRAL_SOURCE),
      )}`,
      listTitle: `${_.get(module, 'name', locale(Keys.REFERRAL_SOURCE))}`,
      code_name_spinner_options: [],
      source: _.get(module, 'start_state', ''),
      max_required: _.get(
        currentTask,
        'vos.max_required',
        Number.MAX_SAFE_INTEGER,
      ),
      min_required: _.get(currentTask, 'vos.min_required', 0),
      required: _.get(currentTask, 'vos.min_required', 0) > 0,
      context_filters: _.get(currentTask, 'vos.context_filters', []),
    };

    if (!_.isEmpty(vo)) {
      multiVos.value = [
        { code: _.get(vo, 'code', ''), name: _.get(vo, 'name', '') },
      ];
      multiVos.selected = [
        { value: _.get(vo, 'code', ''), label: _.get(vo, 'name', '') },
      ];
    }

    if (!_.isEmpty(vo)) {
      const vos = _.get(vo, 'data.vos', []);
      const selectedVOS = _.map(vos, (v) => ({
        label: v.name,
        value: v.code,
      }));
      multiVos.selected = selectedVOS;
    }
    inputs.push(multiVos);
  } else if (
    (_.isEmpty(vo) || !_.isEmpty(_.get(currentTask, 'vos.oif_options'))) &&
    moduleCode !== 'user'
  ) {
    const vos: any = {
      code: module.code,
      subtype: 'vos',
      hint: _.get(module, 'name', locale(Keys.REFERRAL_SOURCE)),
      listTitle: `${_.get(module, 'name', locale(Keys.REFERRAL_SOURCE))}`,
      required: true,
      type: 'referral',
      json: true,
      source: _.get(module, 'start_state', ''),
      oif_options: _.get(currentTask, 'vos.oif_options'),
      value: _.isEmpty(vo)
        ? undefined
        : { code: _.get(vo, 'code'), name: _.get(vo, 'name') },
      visible: _.isEmpty(vo)
        ? true
        : !_.isEmpty(_.get(currentTask, 'vos.oif_options')),
      context_filters: _.get(currentTask, 'vos.context_filters', []),
    };
    inputs.push(vos);
  }
  return inputs;
};

const getCurrentModuleInputs = (type, activity, module, configInputs = []) => {
  const currentTask = _.find(_.get(module, 'tasks', []), {
    code: activity,
  });

  let inputCodes = [];
  if (type === 'log') {
    inputCodes = _.get(currentTask, 'can_log', true)
      ? _.get(currentTask, 'log_inputs.__default', [])
      : [];
  } else {
    inputCodes = _.get(currentTask, 'can_schedule', true)
      ? _.get(currentTask, 'create_inputs.__default', [])
      : [];
  }

  let inputList: any = [];
  inputList = _.compact(
    _.map(inputCodes, (ip) => {
      const inp: any = configInputs.find((i: any) => i.ssKey === ip);
      if (inp.type === 'referral') {
        inp.json = true;
      }
      return inp;
    }),
  );

  return inputList;
};

export const getTaskCreationInputs = (
  values,
  configInputs,
  module,
  vo,
  moduleCode,
) => {
  const inputs: any = [];
  inputs.push({
    code: 'type',
    hint: locale(Keys.SELECT_TYPE),
    type: 'code_name_spinner',
    code_name_spinner_options: [
      { code: 'schedule', name: locale(Keys.SCHEDULE_ACTIVITY) },
      { code: 'log', name: locale(Keys.LOG_ACTIVITY) },
    ],
    required: true,
    returnCode: true,
  });

  // select activity input
  if (values?.type?.value) {
    const activityOptions = getActivityOptions(values.type.value, module, vo);
    if (activityOptions.length > 0) {
      inputs.push({
        code: 'activity',
        hint: locale(Keys.SELECT_ACTIVITY),
        type: 'code_name_spinner',
        code_name_spinner_options: activityOptions,
        required: true,
        returnCode: true,
      });
    }

    // activity specific inputs
    if (values?.activity?.value) {
      const userInputs = getCurrentModuleUserInputs(
        values?.type?.value,
        values?.activity?.value,
        module,
        vo,
        moduleCode,
      );
      const moduleInputs = getCurrentModuleInputs(
        values?.type?.value,
        values?.activity?.value,
        module,
        configInputs,
      );
      inputs.push(...userInputs, ...moduleInputs);
    }
  }

  return inputs;
};
