export type OifWrapperProps = {
  children: any;
  code: string;
  oifOptions: {
    type?: string;
    url: string;
    params?: Array<{ code: string; name: string }>;
    label?: string;
  };
  label?: string;
  value: string | boolean | number;
  isElementDropdownType: boolean;
  type: string;
  onChange: (arg0: string, event, additionalData?: any) => void;
  'data-test-id': string;
  customPayload?: {
    oifFieldVerifyVoPayload: {
      entity?: string | null;
      first_update_type?: string | null;
      vo?: string | null;
    };
  };
  verified?: boolean;
};

export type OTPAndDPPTypeOifProps = {
  children: any;
  code: string;
  oifOptions: {
    type?: string;
    url: string;
    params?: Array<{ code: string; name: string }>;
    label?: string;
    dppIntegrationEventHandler?: string;
  };
  label?: string;
  value: string | boolean | number;
  onChange: (
    arg0: string,
    event,
    additionalData?: any,
    isValid?: boolean,
  ) => void;
  dataTestId: string;
  customPayload?: {
    oifFieldVerifyVoPayload: {
      entity?: string | null;
      first_update_type?: string | null;
      vo?: string | null;
    };
  };
  verified?: boolean;
};

export type DefaultOifTypeProps = {
  children: any;
  code: string;
  oifOptions: {
    type?: string;
    url: string;
    params?: Array<{ code: string; name: string }>;
    label?: string;
  };
  label?: string;
  value: string | boolean | number;
  isElementDropdownType: boolean;
  type: string;
  onChange: (
    newValue: string,
    event,
    additionalData?: any,
    isValid?: boolean,
  ) => void;
  dataTestId: string;
  verified?: boolean;
};
