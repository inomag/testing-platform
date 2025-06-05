/* eslint-disable @typescript-eslint/no-shadow */

/* eslint-disable complexity */

/* eslint-disable max-lines-per-function */

/* eslint-disable no-case-declarations */

/* eslint-disable vymo-ui/restrict-import */
import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import {
  getIsIsacButtonEnabled, // getUserOptionsConfig,
  isUserManagementApprovalEnabled,
} from 'src/models/lmsConfig/queries';
import {
  setWorkflowActionMessage,
  setWorkflowActionState,
} from 'src/models/lmsConfig/slice';
import { WORKFLOW_FORM } from 'src/modules/constants';
import axios from 'src/workspace/axios';
import { removeDialog } from 'src/workspace/slice';
import { navigate } from 'src/workspace/utils';
import { getVoUpdateAction } from './queries/voUpdate';
import {
  setAllInputs,
  setConditionalApproverFields,
  setFormError,
  setFormInputs,
  setFormInputsMap,
  setFormLoading,
  setFormVo,
} from './slice';

// TODO :: thunk will handle storing inputs in consistent format

const disableUser = async (userId, isApprovalEnabled, isacButtonEnabled) => {
  const data: any = {
    user: [userId],
    isacButtonEnabled,
  };
  let response = null;
  if (isApprovalEnabled) {
    response = await axios.post('/delete-user', {
      ...data,
    });
  } else {
    const queryParams = new URLSearchParams(data).toString();
    response = await axios.get(`/delete-user?${queryParams}`);
  }
  return response;
};

const enableUser = async (userId, isApprovalEnabled, isacButtonEnabled) => {
  const data: any = {
    user: userId,
    action: 'enable',
    isacButtonEnabled,
  };
  let response = null;
  if (isApprovalEnabled) {
    response = await axios.post('/enable-user', {
      ...data,
    });
  } else {
    const queryParams = new URLSearchParams(data).toString();
    response = await axios.get(`/enable-user?${queryParams}`);
  }
  return response;
};

const unlockUser = async (userId, isApprovalEnabled, isacButtonEnabled) => {
  const data: any = {
    user: userId,
    action: 'unlock',
    isacButtonEnabled,
  };
  let response = null;
  if (isApprovalEnabled) {
    response = await axios.post('/enable-user', {
      ...data,
    });
  } else {
    const queryParams = new URLSearchParams(data).toString();
    response = await axios.get(`/enable-user?${queryParams}`);
  }
  return response;
};

export const formSubmit = createAsyncThunk(
  'workflowFormSubmit',
  async (
    {
      action,
      result,
      voId,
      moduleCode,
      inputsMap,
    }: {
      action: string;
      result: any;
      voId: string;
      moduleCode?: string;
      inputsMap?: any;
    },
    { dispatch },
  ) => {
    try {
      let payload: any = null;
      dispatch(setFormLoading());
      const isacButtonEnabled = getIsIsacButtonEnabled();
      // const userOptionsConfig = getUserOptionsConfig();
      const userManagementApprovalEnabled = isUserManagementApprovalEnabled();

      let response: any = null;
      let responseMessage: string = '';
      dispatch(setWorkflowActionState('loading'));
      switch (action) {
        case 'edit_user':
          payload = {
            code: voId,
            inputs: result.data,
            from_web2: true,
          };
          response = await axios.post(
            `/update-user-region?tz=${moment().format('Z').replace(':', '')}`,
            payload,
          );
          responseMessage = locale(Keys.USER_UPDATE_SUCCESS);
          break;
        case 'add_user':
          break;
        case 'create_task':
          const type = result.data.find((d: any) => d.code === 'type')?.value;
          const activity = result.data.find(
            (d: any) => d.code === 'activity',
          )?.value;

          const participantsInput = result?.data?.find(
            (input) => input.code === 'participants',
          );
          payload = {
            inputs: (result.data || []).filter(
              (d: any) =>
                d.code !== 'type' &&
                d.code !== 'activity' &&
                d.code !== 'participants',
            ),
            source: 'web',
            task_code: activity,
            task_hierarchy: [activity],
          };

          if (!_.isEmpty(participantsInput)) {
            payload.participants = JSON.parse(
              participantsInput.value || '[]',
            ).map((user) => user.code);
          }

          response = await axios.post(
            `/cs/${
              moduleCode === 'user' ? 'user' : 'vos'
            }/calendar-items?logged=${type === 'log'}`,
            payload,
          );
          responseMessage = locale(Keys.ACTIVITY_CREATE_SUCCESS);
          dispatch(removeDialog({ id: WORKFLOW_FORM }));
          navigate(
            'taskDetails',
            // eslint-disable-next-line no-underscore-dangle
            { leadId: response?.data?.calendar_item?.code },
            {},
          );
          return;
        case 'disableUser':
          response = disableUser(
            voId,
            userManagementApprovalEnabled,
            isacButtonEnabled,
          );
          responseMessage = locale(Keys.USER_DISABLE_SUCCESS);
          break;
        case 'enableUser':
          response = enableUser(
            voId,
            userManagementApprovalEnabled,
            isacButtonEnabled,
          );
          responseMessage = locale(Keys.USER_ENABLE_SUCCESS);
          break;
        case 'unlockUser':
          response = unlockUser(
            voId,
            userManagementApprovalEnabled,
            isacButtonEnabled,
          );
          responseMessage = locale(Keys.USER_UNLOCK_SUCCESS);
          break;
        case 'changeManager':
          payload = {
            code: voId,
            inputs: (result.data || []).slice(1),
            parent: result.data?.[0]?.value,
            action: 'changeManager',
            isacButtonEnabled,
          };
          if (userManagementApprovalEnabled) {
            payload = {
              ...payload,
              regions: [voId],
            };
            response = await axios.post('/change-parent', {
              ...payload,
            });
          } else {
            payload = {
              ...payload,
              region: voId,
            };
            response = await axios.get('/change_parent', {
              ...payload,
              from_web2: true,
            });
          }
          responseMessage = locale(Keys.MANAGER_CHANGE_SUCCESS);
          break;
        case 'update_task':
          const formInputs = result.data;
          const participantsInp = formInputs.find(
            (input) => input.code === 'participants',
          );
          const reassignedInp = formInputs.find(
            (inp) => inp.code === 'reassign',
          );

          const selectedState =
            formInputs.find((inp) => inp.code === 'selectStateInput')?.value ||
            '';

          const updateAction = getVoUpdateAction(selectedState);
          const body: any = {
            inputs: formInputs.filter(
              (input) =>
                input.code !== 'participants' &&
                input.code !== 'reassign' &&
                input.code !== 'selectStateInput',
            ),
            follow_up_inputs: formInputs.filter(
              (input) => input.follow_up_validate,
            ),
            task_hierarchy: _.get(inputsMap, 'data.task.hierarchy', []),
            task_code: _.get(inputsMap, 'data.task.code', ''),
          };

          if (!_.isEmpty(participantsInp)) {
            body.participants = JSON.parse(participantsInp.value || '[]').map(
              (user) => user.code,
            );
          }

          if (!_.isEmpty(reassignedInp)) {
            body.assigned = reassignedInp?.data?.code || reassignedInp?.value;
          }
          response = await axios.post(
            `/cs/calendar-items/${voId}/${updateAction}`,
            body,
          );
          dispatch(removeDialog({ id: WORKFLOW_FORM }));
          navigate(
            'taskDetails',
            // eslint-disable-next-line no-underscore-dangle
            { leadId: voId },
            {},
          );
          return;

        default:
          break;
      }
      if (response?.data?.error) {
        dispatch(
          setWorkflowActionMessage(
            typeof response?.data?.error === 'string'
              ? response?.data.error
              : JSON.stringify(response?.data?.error),
          ),
        );
        dispatch(setFormError({ error: response.error }));
        dispatch(setWorkflowActionState('error'));
      } else {
        dispatch(setWorkflowActionMessage(responseMessage));
        dispatch(setWorkflowActionState('success'));
      }
      dispatch(removeDialog({ id: WORKFLOW_FORM }));
    } catch (e) {
      dispatch(setFormError({ error: e }));
      dispatch(setWorkflowActionState('error'));
    }
  },
);

export const fetchTaskInputs = createAsyncThunk(
  'fetchTaskInputs',
  async (
    {
      voId,
      moduleCode,
      update,
    }: { voId: string; moduleCode: string; update: boolean },
    { dispatch },
  ) => {
    try {
      dispatch(setFormLoading());

      const response = await axios.get('/tasks/fields');

      if (moduleCode === 'user') {
        dispatch(
          setAllInputs({
            response: Object.entries(response.data.user_config).map(
              ([key, value]: [string, any] = ['', {}]) => ({
                ...value,
                ssKey: key,
              }),
            ),
          }),
        );
      } else {
        dispatch(
          setAllInputs({
            response: Object.entries(response.data.vo_config[moduleCode]).map(
              ([key, value]: [string, any] = ['', {}]) => ({
                ...value,
                ssKey: key,
              }),
            ),
          }),
        );
      }
      if (update) {
        const activityDetails = await axios.get(`/cs/calendar-items/${voId}`);
        dispatch(setFormInputsMap({ response: activityDetails.data }));
      }

      if (voId !== 'global') {
        if (moduleCode === 'user') {
          const userDetails = await axios.get(`/users/${voId}`);
          dispatch(setFormVo({ response: userDetails.data }));
        }
      }
    } catch (error) {
      dispatch(setFormError({ error }));
    }
  },
);

export const fetchChangeManagerInputs = createAsyncThunk(
  'fetchChangeManagerInputs',
  async ({ voId }: { voId: string }, { dispatch }) => {
    try {
      dispatch(setFormLoading());
      const response = await axios.get('/users-for-change-manager');
      const activeBranchUsers = _.map(
        _.filter(
          response.data,
          (user: any) =>
            user.region_type !== 'territory' &&
            !user.disabled &&
            user.code !== voId &&
            (user.code === user.region || user.code === 'SU'),
        ),
        (user) => ({
          code: user.code,
          name: `${user.name} (${user.code})`,
        }),
      );

      dispatch(
        setFormInputs({
          response: [
            {
              code: 'manager',
              hint: locale(Keys.MANAGERS),
              type: 'code_name_spinner',
              code_name_spinner_options: activeBranchUsers,
              filterType: 'contains',
              returnCode: true,
            },
            {
              code: 'note',
              hint: locale(Keys.MANAGER_DATA_VISIBILITY_DELAY_NOTE),
              type: 'label',
              value: '',
            },
          ],
        }),
      );
    } catch (error) {
      dispatch(setFormError({ error }));
    }
  },
);

export const fetchUserInputs = createAsyncThunk(
  'fetchUserInputs',
  async (
    { userCode, isEdit }: { userCode: string; isEdit: boolean },
    { dispatch },
  ) => {
    try {
      dispatch(setFormLoading());

      const response = await axios.get('/importer/config');
      dispatch(
        setFormInputs({ response: response.data?.users?.columns || [] }),
      );
      if (isEdit) {
        const userDetails = await axios.get(`/users/${userCode}`);
        dispatch(setFormInputsMap({ response: userDetails.data }));
      }
    } catch (error) {
      dispatch(setFormError({ error }));
    }
  },
);

export const checkForApprovals = createAsyncThunk(
  'checkForApprovals',
  async (
    {
      moduleCode,
      action,
      voId,
      result,
    }: { moduleCode: string; action: string; voId: string; result: any },
    { dispatch },
  ) => {
    try {
      dispatch(setFormLoading());

      const params: any = {};
      const data: any = {};

      if (action === 'edit_user') {
        params.vymo_id = voId;
        params.type = moduleCode;
        params.action = action;

        data.code = voId;
        data.inputs = result.inputs;
      }
      const response: { approval_request?: string; approvers?: any } =
        await axios.post('/approvals/check', {
          ...params,
          data,
        });
      if (response && response.approval_request) {
        const conditionalApprovers = response.approvers;
        if (!_.isEmpty(conditionalApprovers)) {
          _.each(conditionalApprovers, (field) => {
            field.isApprover = true;
          });
        }
        dispatch(setConditionalApproverFields(conditionalApprovers));
      }
    } catch (error) {
      dispatch(setFormError({ error }));
    }
  },
);

export const fetchCustomUserActionInputs = createAsyncThunk(
  'fetchCustomUserActionInputs',
  (_, { dispatch }) => {
    dispatch(
      setFormInputs({
        response: [
          {
            code: 'verifyLabel',
            hint: locale(Keys.CONFIRM_ACTION_PROMPT),
            type: 'label',
          },
        ],
      }),
    );
  },
);

/**
 * moduleCode: string
 * voId: string
 * action: string
 *
 * moduleCode: Lead module codes or 'user' incase of user related forms
 * voId: userCode or leadCode
 * action: add, edit, update or any custom user actions
 */
const onActivate = ({ dispatch, props }) => {
  switch (props.action) {
    case 'changeManager':
      dispatch(fetchChangeManagerInputs({ voId: props.voId }));
      break;
    case 'create_task':
      dispatch(
        fetchTaskInputs({
          voId: props.voId,
          moduleCode: props.moduleCode,
          update: false,
        }),
      );
      break;
    case 'update_task':
      dispatch(
        fetchTaskInputs({
          voId: props.voId,
          moduleCode: props.moduleCode,
          update: true,
        }),
      );
      break;
    case 'edit_task':
      break;
    case 'edit_user':
      dispatch(fetchUserInputs({ userCode: props.voId, isEdit: true }));
      break;
    case 'add_user':
      dispatch(fetchUserInputs({ userCode: props.voId, isEdit: false }));
      break;
    case 'unlockUser':
    case 'enableUser':
    case 'disableUser':
      dispatch(fetchCustomUserActionInputs());
      break;
    default:
      break;
  }
};

const onDeactivate = () => {};

export default { onActivate, onDeactivate };
