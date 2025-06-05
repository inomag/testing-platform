import { isEmpty } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import * as Modules from 'src/modules/constants';
import { getApiStatus as getAuthApiStatus } from 'src/models/appConfig/selectors';
import { setApiStatus as setAuthApiStatus } from 'src/models/appConfig/slice';
import { getAuthPayload } from 'src/models/auth/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ChildComponent from 'src/workspace/childComponent';
import ActivityCard from '../../activityCard';
import CallbackAction from '../../callbackAction';
import Consent from '../../consent';
import Contract from '../../contract';
import CustomLoader from '../../customLoader';
import DataSync from '../../dataSync';
import License from '../../license';
import MultiLob from '../../multiLob';
import { getApiStatus, getTemplateUi } from '../../selectors';
import { setApiStatus, setTemplateData } from '../../slice';
import { useStepperContext } from '../../stepperProvider';
import { saveAction } from '../../thunk';
import { StepperResult } from '../../types';
import HTMLContent from './htmlContent';
import styles from './index.module.scss';

function Content({ currentStep }: { currentStep: StepperResult['template'] }) {
  const dispatch = useAppDispatch();
  const { isDialog, debugMode } = useStepperContext();

  const stepperApiStatus = useAppSelector((state) =>
    getApiStatus(state, isDialog),
  );

  const authApiStatus = useAppSelector(getAuthApiStatus);
  const authPayload = useAppSelector(getAuthPayload);

  const templateUi = useAppSelector((state) => getTemplateUi(state, isDialog));

  useEffect(() => {
    const loaderTemplate = currentStep?.loader;
    if (stepperApiStatus === 'in_progress' && !isEmpty(loaderTemplate)) {
      dispatch(setTemplateData({ ...loaderTemplate, layout: 'dialog' }));
    }
  }, [currentStep?.loader, dispatch, stepperApiStatus]);

  useEffect(() => {
    if (
      (stepperApiStatus === 'cta_clicked' || authApiStatus === 'cta_clicked') &&
      !currentStep?.form &&
      ![
        'ConsentActionCategory',
        'MultiLobCardCategory',
        'LearningManagementActionCategory',
      ].includes(currentStep?.actionCategory as string)
    ) {
      if (authPayload?.valid ?? true) {
        (async () => {
          // TODO: bring payload too
          dispatch(
            saveAction({
              payload: { inputs: authPayload.inputs },
              isDialog,
              encryptPayload: authPayload?.encryptPayload ?? false,
              debugMode,
            }),
          );
        })();
      } else {
        dispatch(setAuthApiStatus('error'));
        dispatch(setApiStatus({ isDialog, apiStatus: undefined }));
      }
    }
  }, [
    stepperApiStatus,
    dispatch,
    authApiStatus,
    currentStep?.form,
    authPayload,
    isDialog,
    currentStep?.actionCategory,
    debugMode,
  ]);

  // eslint-disable-next-line complexity
  const getComponentSection = useCallback(() => {
    const components: any[] = [];
    if (currentStep) {
      components.push(
        <>
          {currentStep?.form?.inputs?.length && (
            <ChildComponent
              key={currentStep?.code}
              id={Modules.PROGRESSIVE_STEPPER_FORM}
            />
          )}
          {!isEmpty(currentStep?.html) && (
            <HTMLContent
              htmlContent={currentStep?.html}
              actionCategory={currentStep.actionCategory}
            />
          )}
        </>,
      );
      components.push(
        <>
          {['loginMpinPassword', 'loginOtp'].includes(
            String(currentStep?.actionCategory),
          ) && <ChildComponent key={currentStep?.code} id={Modules.AUTH} />}

          {currentStep.actionCategory === 'ActivityScheduleActionCategory' &&
            currentStep?.meta && (
              <ActivityCard
                meeting={currentStep.meta?.meeting}
                location={currentStep.meta?.location}
              />
            )}
          {currentStep.actionCategory === 'LearningManagementActionCategory' &&
            currentStep?.meta && (
              <ChildComponent
                key={currentStep?.code}
                id={Modules.PROGRESSIVE_STEPPER_ASSESSMENT}
              />
            )}
          {currentStep.actionCategory === 'ConsentActionCategory' &&
            currentStep?.meta && <Consent {...currentStep?.meta} />}

          {currentStep.actionCategory === 'LoginSyncCategory' && (
            <DataSync {...currentStep?.meta} />
          )}

          {currentStep.actionCategory === 'MultiLobCardCategory' &&
            currentStep?.meta && <MultiLob {...currentStep?.meta} />}

          {currentStep.actionCategory === 'SelectLicenseActionCategory' &&
            currentStep?.meta && <License {...currentStep?.meta} />}

          {currentStep.actionCategory === 'esignAction' &&
            currentStep?.meta && <Contract {...currentStep?.meta} />}

          {currentStep.actionCategory ===
            'PortalCallbackIntegrationActionCategory' &&
            currentStep?.meta && <CallbackAction {...currentStep?.meta} />}

          {['pollingLoader', 'loader'].includes(
            String(currentStep.actionCategory),
          ) &&
            currentStep?.meta && <CustomLoader {...currentStep?.meta} />}
        </>,
      );
    }

    return components;
  }, [currentStep]);

  const contentClasses = classNames({
    [styles.mainSectionContent]: true,
    [styles.mainSectionContent__grow]: templateUi?.content?.grow,
  });

  return <div className={contentClasses}>{getComponentSection()}</div>;
}

export default Content;
