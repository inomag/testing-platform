/* eslint-disable max-lines-per-function */
import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  getBrandRootVariables,
  updateAppTheme,
} from 'src/designTokens/themes/utils';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import Logger from 'src/logger';
import { getApiStatus as getAuthApiStatus } from 'src/models/appConfig/selectors';
import { setApiStatus as setAuthApiStatus } from 'src/models/appConfig/slice';
import { getAuthTokenFromCookie } from 'src/models/auth/lmsLogin/queries';
import {
  getCurrentCta as getCurrentAuthCta,
  getUserAuthenticated,
  getVymoUserToken,
} from 'src/models/auth/selectors';
import {
  setAuthScenarioType,
  setIsAssistedOnboarding,
  setIsAuthenticated,
  setMetaData,
  setPayload,
  setVymoUserToken,
} from 'src/models/auth/slice';
import { setPortalConfig } from 'src/models/portalConfig/slice';
import { getPortalMedium } from 'src/models/stepper/queries';
import { getState } from 'src/store';
import axios from 'src/workspace/axios';
import { HOSTAPP_WEB_PLATFORM_MODULE } from 'src/workspace/constants';
import {
  getPropsForCurrentModuleByUrl,
  syncAppRouteHash,
} from 'src/workspace/selectors';
import {
  removeDialog,
  setRouteModuleBreadCrumbParams,
} from 'src/workspace/slice';
import {
  closePortal,
  encryptPgp,
  getAppLocationInfo,
  getHostAppLocation,
  getModuleProps,
  isLmsWeb,
  isNativeMobileApp,
  isWebInit,
  isWebPlatform,
  navigate,
} from 'src/workspace/utils';
import { clearCookies, setMockFlow } from './queries';
import {
  getCurrentStep,
  getCurrentStepActionType,
  getCurrentStepCtaAction,
  getLobCode,
  getPageData,
} from './selectors';
import {
  resetStepperState,
  setApiStatus,
  setCurrentCta,
  setErrorMessage,
  setLobCode,
  setTemplateData,
} from './slice';
import { StepperResult } from './types';

const log = new Logger('stepperDebug');

const usePrefixMockApiWithOtherProxy = false;

const mockScenario = false;

const mockState = setMockFlow('loginFlowNtb');

const ZONE = encodeURIComponent(moment().format('Z'));

let requestId = '';

const apiPrefix = usePrefixMockApiWithOtherProxy
  ? 'https://56fb4d22-114e-4f96-aeec-d83cc9bc8e01.mock.pstmn.io'
  : '';

const setRequestHeaders = (dispatch, headers) => {
  dispatch(setVymoUserToken(headers['x-vymo-user-token']));
  requestId = headers['x-request-id'];
};

export const getRequestHeaders = (isUserAuthenticated: boolean) => ({
  'x-vymo-user-token': getVymoUserToken(getState()),
  reqId: requestId,
  ...(isWebPlatform() && { portalId: window.portalId }),
  medium: getPortalMedium(),
  ...(!isUserAuthenticated && { multilob: true }),
});

const getRequestQuery = (queryString = '') => {
  const querParams = new URLSearchParams(queryString);
  const moduleQueryParams = getModuleProps?.()?.queryParams;
  if (mockScenario) {
    querParams.append('userMode', mockState);
  }
  if (ZONE) {
    querParams.append('tz', ZONE);
  }
  if (moduleQueryParams) {
    Object.keys(moduleQueryParams).forEach((item) => {
      querParams.append(item, moduleQueryParams[item]);
    });
  }

  return querParams.toString();
};

const getInitUrl = (lobCode?: string, actionCode?: string) => {
  const queryString = getRequestQuery(getAppLocationInfo().query);
  const { leadId, module } = getHostAppLocation()?.pathParams ?? {};
  const clientParam = window.portalId ? `&client=${window.portalId}` : '';
  const moduleParam = module ? `&moduleCode=${module}` : '';
  const commonParams = isWebPlatform() ? '' : `${clientParam}${moduleParam}`;
  let url = '';

  if (getModuleProps?.()?.scenario === 'leadStepper') {
    url = `${apiPrefix}/lead/stepper${leadId ? `/${leadId}` : ''}${
      actionCode ? `/action/${actionCode}` : '/init'
    }?${queryString}${commonParams}`;
  } else {
    url = `${apiPrefix}/portal/${lobCode ? `v3/${lobCode}/` : 'v3/'}init${
      actionCode ? `/action/${actionCode}` : ''
    }?${queryString}${commonParams}`;
  }

  return url;
};

const getActionUrl = (
  ctaAction: string,
  lobCode,
  isUserAuthenticated: boolean,
) => {
  const queryString = getRequestQuery(getAppLocationInfo().query);
  const { leadId, module } = getHostAppLocation()?.pathParams ?? {};
  const clientParam = window.portalId ? `&client=${window.portalId}` : '';
  const moduleParam = module ? `&moduleCode=${module}` : '';
  const commonParams = isWebPlatform() ? '' : `${clientParam}${moduleParam}`;
  let url = '';

  if (getModuleProps?.()?.scenario === 'leadStepper') {
    url = `${apiPrefix}/lead/stepper${
      isUserAuthenticated ? `${leadId ? `/${leadId}` : ''}` : '/login/v2'
    }/action/${ctaAction}?${queryString}${commonParams}`;
  } else {
    url = `${apiPrefix}/portal${
      isUserAuthenticated ? `/v3${lobCode ? `/${lobCode}` : ''}` : '/login/v2'
    }/action/${ctaAction}?${queryString}${commonParams}`;
  }

  return url;
};

const setAuthModelResponseData = (dispatch, result) => {
  dispatch(setMetaData({ ...result.template.meta, client: result.client }));
  dispatch(setPayload({}));

  if (result.template.actionCategory === 'loginMpinPassword') {
    if (result.template.meta.confirmMpinEnabled) {
      dispatch(
        setAuthScenarioType({
          scenario: 'setupAuth',
          type: 'MPIN',
          functionality: 'partial',
        }),
      );
    } else {
      dispatch(
        setAuthScenarioType({
          scenario: 'userAuthentication',
          type: 'MPIN',
          functionality: 'partial',
        }),
      );
    }
  } else {
    dispatch(
      setAuthScenarioType({
        scenario: 'verifyUserAuth',
        type: 'OTP',
        functionality: 'partial',
      }),
    );
  }
};

const deviceLogout = (dispatch) => {
  clearCookies();
  dispatch(setIsAuthenticated(false));
  dispatch(setAuthApiStatus('completed'));
  if (isNativeMobileApp() || isLmsWeb()) {
    closePortal(true);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  dispatch(init({}));
};

// eslint-disable-next-line complexity
const setStepperResponseData = (
  dispatch,
  response,
  isDialog,
  lobCode = 'lob',
) => {
  const { result, portalConfig }: { result: StepperResult; portalConfig: any } =
    response;

  if (!isWebPlatform() && result?.legacyLogin) {
    getModuleProps()?.setLegacyLogin(result.legacyLogin);
    return;
  }

  if (!_.isEmpty(portalConfig)) {
    updateAppTheme(
      getBrandRootVariables(portalConfig?.branding?.theme?.primary),
    );
    dispatch(
      setPortalConfig({
        client: result.client,
        portalConfig,
      }),
    );
  }

  const isUserAuthenticated = getUserAuthenticated(getState());

  const { nextAction } = result?.loginInfo ?? { action: '' };
  if (nextAction && nextAction?.action === 'VYMO_LOGIN') {
    deviceLogout(dispatch);
    return;
  }

  if (result?.loginInfo?.isLoginSuccess) {
    dispatch(setIsAuthenticated(true));
    if (isLmsWeb() && nextAction) {
      if (nextAction?.action === 'PORTAL') {
        const { hash, query } = getAppLocationInfo(nextAction?.path ?? '');

        let updatedHash = hash;
        if (['/', ''].includes(hash)) {
          updatedHash = 'stepper/lob/action/init';
        } else if (updatedHash.indexOf('webPlatform/') > -1) {
          updatedHash = updatedHash?.split('webPlatform/')?.[1] || '';
        }

        navigate(HOSTAPP_WEB_PLATFORM_MODULE, { path: updatedHash }, query);
      } else if (nextAction?.action === 'SESSION_INIT') {
        dispatch(setPortalConfig({ client: '', portalConfig: null }));

        const authToken = getAuthTokenFromCookie();
        if (authToken) {
          closePortal(false, true, authToken);
        } else {
          navigate('home');
        }
      }
      return;
    }
    if (isWebPlatform()) {
      const props = getPropsForCurrentModuleByUrl(
        getState(),
        nextAction?.path ?? '',
      );
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dispatch(init(props));
    }
  }
  if (
    result.template.type === 'custom' &&
    !isUserAuthenticated &&
    result.template.actionCategory !== 'ConsentActionCategory'
  ) {
    // handler for auth model
    setAuthModelResponseData(dispatch, result);
  }
  if (result.template.layout !== 'dialog') {
    dispatch(removeDialog({ id: 'PROGRESSIVE_STEPPER_DIALOG' }));
    // sync the route path with action code
    syncAppRouteHash(
      getState(),
      {
        lobCode,
        actionCode: result.template.code,
      },
      true,
    );
  }
  if (result.template) dispatch(setTemplateData(result.template));
  dispatch(setIsAssistedOnboarding(Boolean(result.isAssistedOnboarding)));
  dispatch(setApiStatus({ apiStatus: 'completed', isDialog }));
  dispatch(setAuthApiStatus('completed'));
  dispatch(setCurrentCta({ isDialog, currentCta: {} }));
};

export const init = createAsyncThunk(
  'init',
  async (
    {
      actionCode,
      lobCode,
      isDialog = false,
    }: { actionCode?: string; lobCode?: string; isDialog?: boolean },
    { dispatch },
  ) => {
    try {
      dispatch(setApiStatus({ apiStatus: 'in_progress', isDialog }));
      dispatch(setAuthApiStatus('in_progress'));
      dispatch(
        setErrorMessage({
          errorMessage: '',
          isDialog,
        }),
      );

      const isUserAuthenticated = getUserAuthenticated(getState());

      const initUrl = getInitUrl(lobCode, actionCode);

      const { data, headers }: any = await axios.get(initUrl, {
        headers: getRequestHeaders(isUserAuthenticated),
      });

      dispatch(setIsAuthenticated(true));
      setRequestHeaders(dispatch, headers);
      setStepperResponseData(dispatch, data, isDialog, lobCode);
    } catch (error: any) {
      const { data, status, headers }: any = error.response;

      // generic utility method to handle different errors
      if (status === 401 && !error?.response?.data?.error) {
        // TODO - Backend should do from their end
        clearCookies();
        dispatch(setIsAuthenticated(false));
        setRequestHeaders(dispatch, headers);
        setStepperResponseData(dispatch, data, isDialog, lobCode);
      } else {
        dispatch(setApiStatus({ apiStatus: 'error', isDialog }));
        dispatch(setAuthApiStatus('error'));
        dispatch(
          setErrorMessage({
            errorMessage: error?.response?.data?.error,
            isDialog,
          }),
        );
      }
    }
  },
);

export const webInit = createAsyncThunk(
  'webInit',
  async (
    {
      lobCode,
      isDialog = false,
      actionCode = null,
    }: { lobCode?: string; isDialog?: boolean; actionCode?: string | null },
    { dispatch },
  ) => {
    try {
      const isUserAuthenticated = getUserAuthenticated(getState());
      dispatch(setApiStatus({ apiStatus: 'in_progress', isDialog }));
      dispatch(setAuthApiStatus('in_progress'));
      dispatch(
        setErrorMessage({
          errorMessage: '',
          isDialog,
        }),
      );

      const initUrl = `${apiPrefix}/login/web/init${
        actionCode ? `/action/${actionCode}` : ''
      }${window.portalId ? `?client=${window.portalId}` : ''}`;

      const { status, headers, data }: any = await axios.get(initUrl, {
        headers: getRequestHeaders(isUserAuthenticated),
      });

      if (status === 200) {
        setRequestHeaders(dispatch, headers);
        setStepperResponseData(dispatch, data, isDialog, lobCode);
      }
    } catch (error: any) {
      const { data, status, headers }: any = error.response;

      // generic utility method to handle different errors
      if (status === 401 && !error?.response?.data?.error) {
        // TODO - Backend should do from their end
        clearCookies();
        dispatch(setIsAuthenticated(false));
        setRequestHeaders(dispatch, headers);
        setStepperResponseData(dispatch, data, isDialog, lobCode);
      } else {
        dispatch(setApiStatus({ apiStatus: 'error', isDialog }));
        dispatch(setAuthApiStatus('error'));
        dispatch(
          setErrorMessage({
            errorMessage: error?.response?.data?.error,
            isDialog,
          }),
        );
      }
    }
  },
);

export const saveAction = createAsyncThunk(
  'saveAction',
  // eslint-disable-next-line max-lines-per-function, complexity
  async (
    { payload, isDialog, encryptPayload = false, debugMode }: any,
    { dispatch },
  ) => {
    const lobCode = getLobCode(getState());
    try {
      if (encryptPayload) {
        payload = {
          ...payload,
          inputs: await Promise.all(
            payload.inputs.map(async (input) => ({
              ...input,
              value: await encryptPgp(input.value),
            })),
          ),
        };
      }

      const authApiStatus = getAuthApiStatus(getState());
      const actionType = getCurrentStepActionType(getState(), isDialog);
      let triggeredCta = getCurrentStepCtaAction(getState(), isDialog);
      if (authApiStatus === 'cta_clicked') {
        triggeredCta = getCurrentAuthCta(getState());
      }
      const ctaAction = triggeredCta?.action;
      const templateCode = getCurrentStep(getState(), isDialog);

      const isUserAuthenticated = getUserAuthenticated(getState());
      let response: any;

      if (triggeredCta?.type === 'static') {
        response = {
          data: {
            result: { ...triggeredCta.actionResponse },
          },
          headers: getRequestHeaders(isUserAuthenticated),
        };
      } else {
        // TODO backend will make templateCode same as above for login too
        const body = {
          ...payload,
          actionType: actionType ?? templateCode,
        };
        if (debugMode) {
          // eslint-disable-next-line testing-library/no-debugging-utils
          log.debug({ ctaAction, lobCode, isUserAuthenticated, body });
          return;
        }
        if (triggeredCta.type !== 'polling')
          dispatch(setApiStatus({ apiStatus: 'in_progress', isDialog }));
        dispatch(setAuthApiStatus('in_progress'));
        response = await axios.post(
          getActionUrl(ctaAction, lobCode, isUserAuthenticated),
          body,
          {
            headers: getRequestHeaders(isUserAuthenticated),
          },
        );
      }

      const {
        data,
        headers,
      }: { data: { result: StepperResult }; headers: any } = response;

      if (!isUserAuthenticated) {
        dispatch(setAuthApiStatus('completed'));
        // TODO - change to cookie based only
        if (response.headers['x-vymo-user-token']) {
          dispatch(setVymoUserToken(response.headers['x-vymo-user-token']));
        }
        // TODO - remove this make it generic
        requestId = headers['x-request-id'];
      } else {
        setRequestHeaders(dispatch, headers);
      }

      setStepperResponseData(dispatch, data, isDialog, lobCode);
    } catch (error: any) {
      const { data, status, headers }: any = error.response;
      if (status === 401) {
        clearCookies();
        setRequestHeaders(dispatch, headers);
        setStepperResponseData(dispatch, data, isDialog, lobCode);
      } else {
        const isUserAuthenticated = getUserAuthenticated(getState());
        if (!isUserAuthenticated) {
          dispatch(setAuthApiStatus('error'));
        }
        // build query function for error
        const isCustomLoader = !_.isEmpty(getPageData(getState())?.loader);
        if (isCustomLoader) {
          dispatch(setTemplateData({ layout: 'dialog' }));
        }
        dispatch(setApiStatus({ apiStatus: 'error', isDialog }));

        dispatch(
          setErrorMessage({
            errorMessage: error?.response?.data?.error,
            isDialog,
          }),
        );
      }
    }
  },
);

export const logout = createAsyncThunk('logout', async (__, { dispatch }) => {
  try {
    const logoutUrl = `/portal/v3/logout?${getRequestQuery()}`;
    const isUserAuthenticated = getUserAuthenticated(getState());

    dispatch(setAuthApiStatus('in_progress'));
    const response: any = await axios.get(logoutUrl, {
      headers: getRequestHeaders(isUserAuthenticated),
    });
    const { message }: { message: string } = response.data;
    if (message === 'success') {
      deviceLogout(dispatch);
    } else {
      dispatch(setAuthApiStatus('error'));
    }
  } catch (error: any) {
    dispatch(setAuthApiStatus('error'));
    dispatch(
      setErrorMessage({
        errorMessage: locale(Keys.ERROR_LOGOUT_FAILED),
        isDialog: false,
      }),
    );
  }
});

export const initStepper = ({
  dispatch,
  actionCode,
  lobCode,
  isDialog = false,
}) => {
  const isAuthenticated = getUserAuthenticated(getState());
  const dispatchWebInit =
    !isAuthenticated &&
    isWebInit() &&
    getModuleProps?.()?.scenario !== 'leadStepper';
  const payload = { actionCode, lobCode, isDialog };

  if (dispatchWebInit) {
    dispatch(webInit(payload));
    return;
  }

  dispatch(init(payload));
};

export const onActivate = async ({ dispatch, props }) => {
  const isDialog = Boolean(props?.isDialog);

  if (!isDialog) {
    let actionCode = props?.actionCode as string;
    if (actionCode === 'init') {
      actionCode = '';
    }

    let lobCode = props?.lobCode as string;

    if (lobCode === 'lob') {
      // @ts-ignore
      lobCode = undefined;
      actionCode = '';
    }

    if (props.debugMode) {
      // eslint-disable-next-line testing-library/no-debugging-utils
      log.debug({ actionCode, lobCode });
      return;
    }

    dispatch(setLobCode(lobCode));

    if (getModuleProps?.()?.scenario === 'leadStepper') {
      const leadName = getModuleProps()?.leadName;
      dispatch(setRouteModuleBreadCrumbParams({ leadName }));
    }

    initStepper({ dispatch, actionCode, lobCode, isDialog });
  }
};

const onDeactivate = ({ dispatch, props }) => {
  const isDialog = Boolean(props?.isDialog);
  // onDeactivate would call for scenario where stepper module is opened as dialog by stepper only.
  // in this case we would not reset data
  if (!isDialog) {
    dispatch(resetStepperState());
  }
};

export default { onActivate, onDeactivate };
