import { keys } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Form from 'src/@vymo/ui/molecules/form';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import { getPageDirty } from 'src/models/appConfig/selectors';
import { setPageDirty } from 'src/models/appConfig/slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  getApiStatus,
  getCurrentStepComponent,
  getLobCode,
} from '../selectors';
import { setApiStatus } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';
import { getDefaultValues } from './queries';
import {
  getFormGroupingConfig,
  getFormInputs,
  getFormValues,
  getFormViewMode,
} from './selectors';
import styles from './index.module.scss';

export default function StepperForm() {
  const dispatch = useAppDispatch();
  const formRef = useRef(null);
  const { isDialog, debugMode } = useStepperContext();
  const groupConfig = useAppSelector((state) =>
    getFormGroupingConfig(state, isDialog),
  );
  const currentStep = useAppSelector((state) =>
    getCurrentStepComponent(state, isDialog),
  );

  const isPageDirty = useAppSelector((state) => getPageDirty(state));
  const formInputs = useAppSelector((state) => getFormInputs(state, isDialog));
  const viewMode = useAppSelector((state) => getFormViewMode(state, isDialog));
  const formValues = useAppSelector((state) => getFormValues(state, isDialog));
  const apiStatus = useAppSelector((state) => getApiStatus(state, isDialog));

  const lobCode = useAppSelector(getLobCode);

  const convertedValues = useMemo(() => {
    const updatedValues = keys(formValues).map((item) => ({
      [item]: formValues[item],
    }));
    const values = getDefaultValues(Object.assign({}, ...updatedValues));
    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues)]);

  useEffect(() => {
    if (apiStatus === 'cta_clicked' && formRef.current) {
      (async () => {
        // @ts-ignore
        const result = await formRef.current?.getFieldsForSubmission?.();
        if (result?.valid === 'valid') {
          dispatch(
            saveAction({
              payload: { inputs: result.data },
              isDialog,
              debugMode,
            }),
          );
        } else {
          dispatch(setApiStatus({ isDialog, apiStatus: undefined }));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiStatus, dispatch, isDialog, JSON.stringify(convertedValues)]);

  const handleFormChange = useCallback(() => {
    if (!isPageDirty) {
      dispatch(setPageDirty(true));
    }
  }, [dispatch, isPageDirty]);

  return (
    <div>
      <Form
        key={currentStep?.code}
        ref={formRef}
        id="checkerForm"
        name="checkerForm"
        onChange={handleFormChange}
        className={styles.form}
        span="1fr"
        config={{
          version: FormVersion.web,
          customPayload: {
            oifFieldVerifyVoPayload: {
              entity: lobCode,
              vo: null,
              first_update_type: null,
            },
          },
          data: formInputs || [],
          grouping: groupConfig,
          beforeSaveHookConfig: {
            multimedia: {
              isMultimediaBeforeSaveHookDisabled: false,
              uploadUrl: `/portal/v3/generate_signed_urls${
                window.portalId ? `?portalId=${window.portalId}` : ''
              }`,
              valueFormat: 'jsonString',
            },
          },
          fieldItemConfig: {
            showDisabledIcon: true,
          },
          groupConfig: {
            collapsibleClasses: styles.stepperForm__collapsible,
          },
          viewMode,
        }}
        formulaContext={{ data: { vo: { inputs_map: formValues } } }}
        value={convertedValues}
      />
    </div>
  );
}
