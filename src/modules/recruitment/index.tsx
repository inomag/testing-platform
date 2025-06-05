import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from 'src/@vymo/ui/atoms/loader';
import classNames from 'classnames';
import { deleteForm } from 'src/models/form/slice';
import { getIsAssistedOnboarding } from 'src/models/recruitmentMeta/selectors';
import { initAPI } from 'src/models/recruitmentMeta/thunk';
import { getIsInitialised } from 'src/models/stepperFormLegacy/selectors';
import {
  initializeStepperForm,
  setApiError,
  setIsInitialised as setIsStepperInitialised,
} from 'src/models/stepperFormLegacy/slice';
import { Section } from 'src/models/stepperFormLegacy/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { isFirstTimeLogin } from 'src/modules/authLegacy/queries';
import { LEGACY_AUTH, RECRUITMENT, STEPPER_FORM } from 'src/modules/constants';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import ChildComponent from 'src/workspace/childComponent';
import { renderModule } from 'src/workspace/slice';
import { API_STATUS, FLOW_NAME } from './constants';
import {
  getActionPayload,
  getCreateActionPayload,
  getGroupedSections,
  getInitAPIPayload,
  getInitAttributes,
  getMeta,
  hasDocumentInput,
} from './queries';
import RedirectModal from './redirectModal';
import {
  getApiError,
  getApiStatus,
  getFlow,
  getInitResponse,
} from './selectors';
import { setApiStatus } from './slice';
import { actionAPI, handleDocumentInputs } from './thunk';
import { ActionAPIPayload } from './types';
import styles from './index.module.scss';

/* @ts-nocheck */
function Recruitment() {
  // TODO once API is ready
  const registeredUser = false;
  const apiStatus = useAppSelector(getApiStatus);
  const flowName = useAppSelector(getFlow);
  const initApiResponse = useAppSelector(getInitResponse);
  const dispatch = useAppDispatch();
  const isStepperformInitialized = useAppSelector(getIsInitialised);
  const apiErrorMessage = useAppSelector(getApiError);
  const firstTimeLogin = isFirstTimeLogin();
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchParams] = useSearchParams();
  const showShowStepInfo = !useAppSelector(getIsAssistedOnboarding);

  const handleSubmit = useCallback(
    (section: Section, args: any) => {
      const { updatedInputfields = {} } = args || {};
      dispatch(deleteForm({ formKey: `stepper-section-${section?.title}` }));
      if (section.action === 'submit' || section.action === 'validate') {
        const payload = getActionPayload(
          initApiResponse,
          updatedInputfields,
          section,
        ) as ActionAPIPayload;
        if (hasDocumentInput(section?.component?.meta?.inputs)) {
          dispatch(setApiStatus(API_STATUS.PENDING));
          dispatch(
            handleDocumentInputs({
              actionAPIPayload: payload,
            }),
          );
        } else {
          dispatch(actionAPI(payload));
        }
      }
    },
    [dispatch, initApiResponse],
  );

  useEffect(() => {
    dispatch(setIsStepperInitialised(false));
  }, [dispatch]);
  useEffect(() => {
    if (initApiResponse && apiStatus === API_STATUS.SUCCESS) {
      const {
        sections = [],
        journey = {},
        currentStep = 0,
        inputsMap = {},
      } = getMeta(initApiResponse);
      const pageAttribute = getInitAttributes(initApiResponse);
      getGroupedSections(sections).then((sectionData) => {
        const payload = {
          sections,
          journey,
          currentStep,
          pageAttribute,
          sectionData,
          inputsMap,
        };
        dispatch(initializeStepperForm(payload));
      });
    } else if (apiStatus !== API_STATUS.PENDING) {
      dispatch(setApiError(apiErrorMessage || ''));
      dispatch(setIsStepperInitialised(true));
    }
  }, [
    apiErrorMessage,
    apiStatus,
    dispatch,
    initApiResponse,
    isStepperformInitialized,
  ]);
  const renderComponent = useMemo(() => {
    if (registeredUser) {
      return <RedirectModal link />;
    }
    if (
      apiStatus === API_STATUS.SERVER_ERROR ||
      apiStatus === API_STATUS.BAD_REQUEST
    ) {
      return <h2>{apiErrorMessage || 'Something went wrong'}</h2>;
    }
    switch (flowName) {
      case FLOW_NAME.STEPPER_FORM:
        return (
          <ChildComponent
            id={STEPPER_FORM}
            props={{ handleSubmit, showShowStepInfo }}
          />
        );
      default:
        return null;
    }
  }, [
    registeredUser,
    apiStatus,
    flowName,
    apiErrorMessage,
    handleSubmit,
    showShowStepInfo,
  ]);

  useEffect(() => {
    dispatch(setApiStatus(''));
    setInitialLoad(false);
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoad) {
      if (apiStatus === API_STATUS.UNAUTHORIZED) {
        dispatch(
          renderModule({
            id: LEGACY_AUTH,
            props: { lastPage: RECRUITMENT },
          }),
        );
      } else if (
        !initApiResponse &&
        apiStatus !== API_STATUS.PENDING &&
        apiStatus !== API_STATUS.BAD_REQUEST &&
        apiStatus !== API_STATUS.SERVER_ERROR
      ) {
        if (firstTimeLogin) {
          const createActionPayload = getCreateActionPayload();
          dispatch(actionAPI(createActionPayload));
        } else {
          const payload = getInitAPIPayload(searchParams);
          dispatch(initAPI({ payload }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiStatus, dispatch, initApiResponse, initialLoad]);

  return (
    <div
      className={classNames(styles['form-container'])}
      data-test-id="registration-flow"
    >
      {apiStatus === API_STATUS.PENDING || !isStepperformInitialized ? (
        <Loader />
      ) : (
        renderComponent
      )}
    </div>
  );
}

export default Recruitment;
