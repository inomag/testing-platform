import React, { useCallback } from 'react';
import DocuSign from 'src/@vymo/ui/molecules/docuSign';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getCurrentStep } from 'src/models/stepperFormLegacy/selectors';
import { ActionType, Input } from 'src/models/stepperFormLegacy/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { actionAPI, getESignDetails } from 'src/modules/recruitment/thunk';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

interface Iprops {
  label: string;
  code: string;
  templateId: string;
  inputObj: Input;
  scriptLink: string;
}
export default function ESignature({
  label,
  code,
  templateId,
  inputObj,
  scriptLink,
}: Iprops) {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(getCurrentStep);
  const getESignMeta = useCallback(() => {
    const data = getESignDetails(templateId);
    return data;
  }, [templateId]);
  const onComplete = useCallback(
    (envelopeId) => {
      let updatedInputs: Input[] = [];
      if (inputObj) {
        const inputObjCopy = { ...inputObj };
        inputObj.value = envelopeId;
        updatedInputs = [inputObjCopy];
      }
      const payload = {
        actionType: 'submit' as ActionType,
        payload: {
          current_step: currentStep,
          current_section: code,
          inputs: updatedInputs,
        },
      };
      dispatch(actionAPI(payload));
    },
    [code, currentStep, dispatch, inputObj],
  );
  return (
    <DocuSign
      label={label}
      code={code}
      readOnly={inputObj.readOnly}
      scriptLink={scriptLink}
      finishText={locale(Keys.MESSAGE_SIGNING_SUCCESS_PROCEED)}
      getESignMeta={getESignMeta}
      onComplete={onComplete}
    />
  );
}
