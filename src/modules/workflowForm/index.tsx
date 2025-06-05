import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Loader, Text } from 'src/@vymo/ui/atoms';
import { Form } from 'src/@vymo/ui/molecules';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import * as LmsConfigQueries from 'src/models/lmsConfig/queries';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { WORKFLOW_FORM } from 'src/modules/constants';
import { RootState } from 'src/store';
import { useAppDispatch } from 'src/store/hooks';
import { removeDialog } from 'src/workspace/slice';
import { getClientConfigData } from 'src/workspace/utils';
import {
  getApprovalConfigData,
  getConvertedApproverFields,
} from './queries/approvals';
import {
  getFilteredData,
  getSubmitButtonText,
  getVymoFormTitle,
} from './queries/common';
import {
  getConditionalApproverFields,
  getFormInputs,
  getFormInputsValues,
  getFormReferralVo,
  getFormStatus,
  getFormVo,
} from './selectors';
import { checkForApprovals, formSubmit } from './thunk';
import styles from './index.module.scss';

function WorkflowForm({
  moduleCode,
  voId,
  action,
}: {
  moduleCode: string;
  voId: string;
  action: string;
}) {
  const [values, setValues] = useState({});
  const formStatus = useSelector(getFormStatus);
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  const config = getClientConfigData();

  // ////////////// FORM INPUTS LOGIC START ////////////////\
  const referralVo = useSelector(getFormReferralVo);

  const module = LmsConfigQueries.getCurrentModule(moduleCode);
  const inputsMap = useSelector((state: RootState) =>
    getFormInputsValues(state, moduleCode, action),
  );
  const formInputs = useSelector((state: RootState) =>
    getFormInputs(
      state,
      action,
      module,
      moduleCode,
      referralVo,
      values,
      inputsMap,
    ),
  );

  const vo = useSelector(getFormVo);

  // ////////////// FORM INPUTS LOGIC END ////////////////

  // ////////// APPROVALS LOGIC START /////////////////
  const [additionalInputFields, setAdditionalInputFields] = useState([]);
  const [checkForApprovalsAPICalled, setCheckForApprovalsAPICalled] =
    useState(false);

  const conditionalApprovers = useSelector(getConditionalApproverFields);
  const { isApprovalEnabled, isConditionalApprovalEnabled, approvers } =
    useMemo(
      () => getApprovalConfigData(moduleCode, action, config),
      [moduleCode, action, config],
    );

  useEffect(() => {
    if (!isConditionalApprovalEnabled) {
      setAdditionalInputFields(getConvertedApproverFields(approvers));
    } else if (
      isConditionalApprovalEnabled &&
      !_.isEmpty(conditionalApprovers)
    ) {
      setAdditionalInputFields(conditionalApprovers);
      setCheckForApprovalsAPICalled(true);
    }
  }, [isConditionalApprovalEnabled, approvers, conditionalApprovers]);

  // /////////////// APPROVALS LOGIC END /////////////////

  if (formStatus.error) {
    return <div>Error: {JSON.stringify(formStatus.error)}</div>;
  }

  const onSubmit = async () => {
    // @ts-ignore
    const result = await formRef.current?.getFieldsForSubmission?.();
    if (result?.valid === 'valid') {
      const filteredResult = getFilteredData(action, result, vo);
      if (isConditionalApprovalEnabled && !checkForApprovalsAPICalled) {
        dispatch(
          checkForApprovals({
            moduleCode,
            action,
            voId,
            result: filteredResult,
          }),
        );
      } else {
        dispatch(
          formSubmit({
            action,
            result: filteredResult,
            voId,
            moduleCode,
            inputsMap,
          }),
        );
      }
    }
  };

  return (
    <div className={styles.form}>
      <Text bold type="h4" classNames={styles.form__title}>
        {getVymoFormTitle(action)}
      </Text>
      <div className={styles.form__form}>
        <Loader visible={formStatus.loading}>
          <Form
            name="formWithCheckForApproval"
            onChange={setValues}
            ref={formRef}
            config={{
              version: FormVersion.web,
              data: [...formInputs, ...additionalInputFields],
              grouping: [],
            }}
            value={inputsMap}
          />
        </Loader>
      </div>
      <div className={styles.form__buttons}>
        <Button
          onClick={() => dispatch(removeDialog({ id: WORKFLOW_FORM }))}
          type="text"
        >
          {locale(Keys.CANCEL)}
        </Button>
        <Button onClick={onSubmit}>
          {getSubmitButtonText(
            action,
            isApprovalEnabled,
            isConditionalApprovalEnabled,
            checkForApprovalsAPICalled,
          )}
        </Button>
      </div>
    </div>
  );
}

export default WorkflowForm;
