import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/@vymo/ui/atoms';
import { AssessmentConfig } from 'src/@vymo/ui/components/assessment/types';
import { Assessment } from 'src/@vymo/ui/molecules';
import { useAppSelector } from 'src/store/hooks';
import { getApiStatus, getCTAs } from '../selectors';
import { setApiStatus, setCurrentCta, setTemplateUi } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';
import { getAssessmentConfig } from './selectors';
import { saveDraft } from './thunk';

function StepperAssessment() {
  const dispatch = useDispatch();
  const assessmentRef = useRef(null);
  // using save mode ref to keep track of the mode of submission
  const saveModeRef = useRef('save');
  const { isDialog, debugMode } = useStepperContext();
  const assessmentConfig: AssessmentConfig = useAppSelector((state) =>
    getAssessmentConfig(state, isDialog),
  );
  const { draftApiPath } = assessmentConfig;
  const submitCta = useAppSelector((state) => getCTAs(state, isDialog))?.[0];
  const apiStatus = useAppSelector((state) => getApiStatus(state, isDialog));
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    // Dispatch an action to hide the CTA button
    dispatch(
      setTemplateUi({
        isDialog,
        templateUi: {
          header: { hide: { title: true, description: true } },
          footer: { hide: { cta: true } },
        },
      }),
    );
    return () => {
      // Dispatch an action to enable the CTA for the next action
      dispatch(
        setTemplateUi({
          isDialog,
          templateUi: {
            header: { hide: { title: false, description: false } },
            footer: { hide: { cta: false } },
          },
        }),
      );
    };
  }, [dispatch, isDialog]);

  // Effect to handle the submission of the assessment when CTA is clicked
  useEffect(() => {
    if (apiStatus === 'cta_clicked') {
      (async () => {
        // @ts-ignore
        const payload = await assessmentRef.current?.getAnswers(
          saveModeRef.current,
        );
        const result = {
          ...assessmentConfig,
          answer: payload.answers,
        };
        if (payload?.valid) {
          dispatch<any>(saveAction({ payload: result, isDialog, debugMode }));
        } else {
          dispatch(setApiStatus({ isDialog, apiStatus: 'error' }));
        }
      })();
      setisSubmitting(['completed', 'error'].includes(String(apiStatus)));
    }
  }, [apiStatus, assessmentConfig, dispatch, isDialog, debugMode]);

  // Function to handle the submission of the assessment
  const handleSubmit = useCallback(
    (mode) => {
      saveModeRef.current = mode;
      try {
        dispatch(setApiStatus({ isDialog, apiStatus: 'cta_clicked' }));
        dispatch(setCurrentCta({ isDialog, currentCta: submitCta }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error while submitting assessment', error);
      }
    },
    [dispatch, isDialog, submitCta],
  );

  // Function to handle the change of question and save the draft if api is provided in the config
  const handleQuestionChange = useCallback(
    async (_, direction) => {
      if (direction === 'next' && draftApiPath) {
        // @ts-ignore
        const payload = await assessmentRef.current?.getAnswers(
          saveModeRef.current,
        );
        const result = {
          apiPath: draftApiPath,
          payload: {
            ...assessmentConfig,
            actionType: 'draft_answer',
            answer: payload.answers,
          },
        };
        dispatch<any>(saveDraft(result));
      }
    },
    [assessmentConfig, dispatch, draftApiPath],
  );

  // Custom submit button for the assessment which is CTA in this case
  const customSubmitButton = (
    <Button
      data-cta={
        submitCta.type === 'action'
          ? submitCta.action
          : submitCta?.actionResponse?.template?.code
      }
      disabled={isSubmitting}
      data-test-id={`cta-${
        submitCta.type === 'action'
          ? submitCta.action
          : submitCta?.actionResponse?.template?.code
      }`}
      type={submitCta.variant ?? 'primary'}
      onClick={() => handleSubmit(saveModeRef.current)}
    >
      {submitCta.title}
    </Button>
  );

  return (
    <Assessment
      ref={assessmentRef}
      assessmentConfig={assessmentConfig}
      onSubmit={handleSubmit}
      allowNavigation={false}
      isSubmitting={isSubmitting}
      submitButton={customSubmitButton}
      onQuestionChange={handleQuestionChange}
    />
  );
}

export default React.memo(StepperAssessment);
