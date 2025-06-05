/* eslint-disable complexity */

/* eslint-disable max-lines-per-function */

/* eslint-disable no-case-declarations */
import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { RootState } from 'src/store';
import { getClientConfigData } from 'src/workspace/utils';
import { getConvertedValues } from './queries/common';
import { getTaskCreationInputs } from './queries/tasks';
import {
  disableResetPassword,
  getExternalAuthEnabled,
  getOtpConfig,
} from './queries/users';
import { getTaskUpdateInputs } from './queries/voUpdate';

export const getFormInputs = createSelector(
  [
    (state: RootState) => state.workflowForm?.inputs,
    (state: RootState) => state.workflowForm?.allInputs,
    (_state: RootState, action: string) => action,
    (_state: RootState, _action: string, module: any) => module,
    (_state: RootState, _action: string, _module: any, moduleCode: string) =>
      moduleCode,
    (
      _state: RootState,
      _action: string,
      _module: any,
      _moduleCode: string,
      vo: any,
    ) => vo,
    (
      _state: RootState,
      _action: string,
      _module: any,
      _moduleCode: string,
      _vo: any,
      values: any,
    ) => values,
    (
      _state: RootState,
      _action: string,
      _module: any,
      _moduleCode: string,
      _vo: any,
      _values: any,
      inputsMap: any,
    ) => inputsMap,
  ],
  (inputs, allInputs, action, module, moduleCode, vo, values, inputsMap) => {
    if (moduleCode === 'user') {
      switch (action) {
        case 'edit_user':
        case 'add_user':
          const filteredInputs: any = [];

          const config = getClientConfigData();
          const isExternalAuthEnabled = getExternalAuthEnabled(config);
          const otpConfig = getOtpConfig(config);

          if (!isExternalAuthEnabled) {
            if (
              !_.find(inputs, { code: 'reset_password' }) &&
              !_.get(otpConfig, 'disableForEdit', false)
            ) {
              filteredInputs.push({
                type: 'checkbox',
                code: 'reset_password',
                hint: locale(Keys.RESET_PASSWORD_WITH_OTP_NOTE),
                disabled: disableResetPassword(config),
              });
            } else if (!_.find(inputs, { code: 'password' })) {
              filteredInputs.push({
                code: 'password',
                hint: locale(Keys.PASSWORD),
                value: vo.password,
                type: 'text',
                disabled: disableResetPassword(config),
              });
            }
          }

          filteredInputs.push(
            ...(inputs || [])
              .filter((input) => input.code !== 'parent')
              .map((input) =>
                input.code === 'password'
                  ? { ...input, required: false, type: 'text' }
                  : input,
              ),
          );

          return filteredInputs;
        case 'create_task':
          return getTaskCreationInputs(
            values,
            allInputs,
            module,
            vo,
            moduleCode,
          );
        case 'update_task':
          return getTaskUpdateInputs(
            values,
            allInputs,
            module,
            vo,
            moduleCode,
            inputsMap,
            {},
          );
        default:
          return inputs;
      }
    } else {
      switch (action) {
        case 'create_task':
          return getTaskCreationInputs(
            values,
            allInputs,
            module,
            vo,
            moduleCode,
          );

        case 'update_task':
          return getTaskUpdateInputs(
            values,
            allInputs,
            module,
            vo,
            moduleCode,
            inputsMap,
            {},
          );
        default:
          return inputs;
      }
    }
  },
);

export const getFormInputsValues = createSelector(
  [
    (state: RootState) => state.workflowForm?.inputsMap,
    (_state: RootState, moduleCode: string) => moduleCode,
    (_state: RootState, _moduleCode: string, action: string) => action,
  ],
  (details, moduleCode, action) => {
    if (moduleCode === 'user') {
      switch (action) {
        case 'update_task':
          return details;
        default:
          return getConvertedValues(details?.inputs_map || {});
      }
    }
    return details;
  },
);

export const getFormReferralVo = (state: RootState) => state.workflowForm?.vo;
export const getFormStatus = (state: RootState) => state.workflowForm?.status;

export const getConditionalApproverFields = (state: RootState) =>
  state.workflowForm?.conditionalApprovers;

export const getFormVo = (state: RootState) => state.workflowForm?.inputsMap;
