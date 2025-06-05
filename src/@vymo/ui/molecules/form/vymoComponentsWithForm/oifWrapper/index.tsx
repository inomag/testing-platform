/* eslint-disable complexity */
import React from 'react';
import { FormContextProps } from 'src/@vymo/ui/molecules/form/formProvider/types';
import DefaultOifType from './defaultOifType';
import OtpAndDppTypeOif from './otpAndDppTypeOif';
import { OifWrapperProps } from './types';

function OifWrapper({
  children,
  code,
  oifOptions,
  onChange,
  appendFieldsAtCode,
  isElementDropdownType,
  value,
  type,
  label,
  customPayload,
  verified = false,
  'data-test-id': dataTestId,
}: React.PropsWithChildren<OifWrapperProps> & {
  appendFieldsAtCode: FormContextProps['appendFieldsAtCode'];
}) {
  const { type: oifType } = oifOptions ?? {};

  return ['otp', 'dpp'].includes(oifType as string) ? (
    <OtpAndDppTypeOif
      code={code}
      oifOptions={oifOptions}
      onChange={onChange}
      appendFieldsAtCode={appendFieldsAtCode}
      value={value}
      label={label}
      customPayload={customPayload}
      verified={verified}
      dataTestId={dataTestId}
    >
      {children}
    </OtpAndDppTypeOif>
  ) : (
    <DefaultOifType
      code={code}
      oifOptions={oifOptions}
      onChange={onChange}
      appendFieldsAtCode={appendFieldsAtCode}
      isElementDropdownType={isElementDropdownType}
      value={value}
      type={type}
      dataTestId={dataTestId}
    >
      {children}
    </DefaultOifType>
  );
}

export default React.memo(OifWrapper);
