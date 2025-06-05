import _ from 'lodash';
import { getCurrentModule } from 'src/models/lmsConfig/queries';
import { getUsersList } from 'src/workspace/utils';
import { getUserManagementApprovalsEssentials } from './users';

export const getApprovalConfigData = (moduleCode, action, config) => {
  if (moduleCode === 'user') {
    switch (action) {
      case 'edit_user': {
        const [isApprovalEnabled, isConditionalApprovalEnabled] =
          getUserManagementApprovalsEssentials('edit_profile', config);
        return {
          isApprovalEnabled,
          isConditionalApprovalEnabled,
        };
      }
      case 'change_manager': {
        const [isApprovalEnabled, isConditionalApprovalEnabled] =
          getUserManagementApprovalsEssentials('change_manager', config);
        return {
          isApprovalEnabled,
          isConditionalApprovalEnabled,
        };
      }
      case 'create_task':
        // pending
        return {};
      default:
        return {};
    }
  } else if (moduleCode === 'template') {
    const currentModule = getCurrentModule(moduleCode);
    const approvalConfigMapping = _.get(
      currentModule,
      'approval_config_mapping',
      [],
    );
    const approvalSetting = _.get(config, 'approval_setting', {});
    const approverObject = _.find(
      approvalConfigMapping,
      (approvalConfig) =>
        approvalConfig.type === action &&
        _.includes(approvalConfig.module, moduleCode),
    );
    const approvalConfigCode = _.get(
      approverObject,
      'approval_config_code',
      '',
    );
    const isApprovalEnabled = !_.isEmpty(approverObject);
    const isConditionalApprovalEnabled = _.get(
      approverObject,
      'conditional_approval',
      false,
    );
    const approvers = !_.isEmpty(approvalSetting)
      ? _.get(approvalSetting[approvalConfigCode], 'approvers', [])
      : [];

    return {
      isApprovalEnabled,
      isConditionalApprovalEnabled,
      approvers,
    };
  } else {
    // config.lead_modules
    return {};
  }
};

export const getConvertedApproverFields = (approvers: any = []) =>
  approvers.map((item: any) => ({
    name: item.name,
    code: item.code,
    required: false,
    hint: item.name,
    type: 'code_name_spinner',

    code_name_spinner_options: [
      { code: 'none', name: 'Select' },
      ...(item?.scope || []).map((itemScope) => getUsersList(itemScope)).flat(),
    ],
    disabled: item.default_selection,
  }));
