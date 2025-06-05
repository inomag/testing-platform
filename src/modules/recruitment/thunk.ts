import { createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit';
import {
  setIsAssistedOnboarding,
  setUserIdValidatedFlag,
} from 'src/models/recruitmentMeta/slice';
import { setTimeout } from 'src/models/session/slice';
import {
  resetStepperFormStatus,
  setApiStatusForEdit,
  setIsInitialised,
  setIsUserIdValidated,
} from 'src/models/stepperFormLegacy/slice';
import { Input } from 'src/models/stepperFormLegacy/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { setIsFirstTimeLogin } from 'src/modules/authLegacy/queries';
// eslint-disable-next-line vymo-ui/restrict-import
import { setAuthenticated } from 'src/modules/authLegacy/slice';
import axios from 'src/workspace/axios';
import { API_STATUS } from './constants';
import {
  getSignedUrlPayload,
  getUpdateDocInputValue,
  segregateInputs,
} from './queries';
import {
  resetState,
  setApiError,
  setApiStatus,
  setFlow,
  setInitResponse,
} from './slice';
import { ActionAPIPayload, SubmitActionAPIPayload } from './types';

const handleActionAPIError = (
  dispatch: ThunkDispatch<any, any, any>,
  error: any,
  isEdit: boolean = false,
) => {
  if (error.response.status === 401) {
    dispatch(setApiStatus(API_STATUS.UNAUTHORIZED));
    dispatch(resetState());
  } else if (
    error.response.status === 500 ||
    error.response.status === 404 ||
    error.response.status === 502
  ) {
    dispatch(setApiStatus(API_STATUS.SERVER_ERROR));
  } else if (error.response.status === 400) {
    dispatch(setApiStatus(API_STATUS.BAD_REQUEST));
    dispatch(setApiError(error.response.data.error));
  } else if (error.response.status === 403) {
    if (isEdit) {
      const editStatusPayload = {
        status: API_STATUS.VALIDATION_ERROR,
        error: error.response.data.error,
      };
      dispatch(setApiStatusForEdit(editStatusPayload));
    } else {
      dispatch(setApiStatus(API_STATUS.VALIDATION_ERROR));
      dispatch(setApiError(error.response.data.error));
    }
  }
};
export const actionAPI = createAsyncThunk(
  'action',
  async (
    { actionType, payload, code = '', isEdit }: ActionAPIPayload,
    { dispatch },
  ) => {
    try {
      // both action and init response will share same slice
      if (actionType !== 'validate') {
        dispatch(resetState());
        dispatch(resetStepperFormStatus());
      }
      if (isEdit) {
        dispatch(setApiStatusForEdit({ status: API_STATUS.PENDING }));
      } else {
        dispatch(setIsInitialised(false));
        dispatch(setApiStatus(API_STATUS.PENDING));
      }
      dispatch(setApiError(''));
      const response: any = await axios.post(
        `/portal/recruitment/action/${actionType}?portalId=${
          window.portalId ?? ''
        }`,
        payload,
      );
      if (response?.headers['x-vymo-portal-session-interval']) {
        dispatch(
          setTimeout(response?.headers['x-vymo-portal-session-interval']),
        );
      }
      if (isEdit) {
        dispatch(setApiStatusForEdit({ status: API_STATUS.SUCCESS }));
      } else {
        dispatch(setApiStatus(API_STATUS.SUCCESS));
      }
      if (response?.data?.message === 'success') {
        const responseData = response.data;
        const {
          result: {
            page: {
              component: { type },
            },
            isAssistedOnboarding,
          },
        } = responseData;
        dispatch(setFlow(type));
        dispatch(setInitResponse(response.data));
        dispatch(setIsAssistedOnboarding(isAssistedOnboarding));
        if (actionType === 'validate') {
          dispatch(setIsUserIdValidated({ code, value: true }));
          dispatch(setUserIdValidatedFlag(true));
        }
        dispatch(setAuthenticated(true));
      }
      if (actionType === 'create') {
        setIsFirstTimeLogin(false);
      }
    } catch (error: any) {
      handleActionAPIError(dispatch, error, isEdit);
      dispatch(setAuthenticated(error.response?.status !== 401));
    }
  },
);

export const uploadFile = createAsyncThunk(
  'documentUploader/uploadFile',
  async ({ payload }: any) => {
    const { signedUrl, file } = payload;
    try {
      const response = await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.mime,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  },
);

export const handleSignedResponse = createAsyncThunk(
  'documentUploader/handleSignedResponse',
  async (
    { multimediaResponse, filesById, updatedActionAPIPayload }: any,
    { dispatch },
  ) => {
    // upload file
    if (multimediaResponse) {
      await Promise.all(
        Object.keys(multimediaResponse).map(async (key) => {
          const files = multimediaResponse[key];
          await Promise.all(
            files?.map((file) =>
              dispatch(
                uploadFile({
                  payload: {
                    signedUrl: file.pre_signed_url,
                    file: filesById[file.id]?.file,
                  },
                }),
              ),
            ),
          );
        }),
      );
    }
    dispatch(actionAPI(updatedActionAPIPayload));
  },
);

export const handleDocumentInputs = createAsyncThunk(
  'documentUploader/generateSignedUrls',
  async ({ actionAPIPayload }: any, { dispatch }) => {
    try {
      // segregate the inputs to generate the payload
      const inputs = actionAPIPayload.payload.inputs as Input[];
      const { updatedInputs, docInputs, filesById } = segregateInputs(inputs);
      if (docInputs.length > 0) {
        const payload = {
          signed_url_requests: docInputs
            .filter((input) => Boolean(input?.value))
            ?.map((input) => getSignedUrlPayload(input)),
        };
        if (payload.signed_url_requests.length === 0) {
          dispatch(actionAPI(actionAPIPayload));
          return;
        }
        // get signed urls
        const response = await axios.post(
          `/portal/recruitment/generate_signed_urls?portalId=${
            window.portalId ?? ''
          }`,
          payload,
        );
        // prepare payload for file upload
        const { multimedia_response: multimediaResponse, bucket } =
          response.data?.result || {};
        docInputs?.forEach((input) => {
          const docInput: any = { ...input };
          docInput.value = getUpdateDocInputValue({
            bucket,
            filesById,
            responseArray: multimediaResponse[input.code],
          });
          updatedInputs.push(docInput);
        });
        // update action API payload

        const submitActionAPIPayload =
          actionAPIPayload.payload as SubmitActionAPIPayload;
        submitActionAPIPayload.inputs = updatedInputs;
        const updatedActionAPIPayload: ActionAPIPayload = {
          ...actionAPIPayload,
          payload: submitActionAPIPayload,
        };
        dispatch(
          handleSignedResponse({
            multimediaResponse,
            filesById,
            updatedActionAPIPayload,
          }),
        );
      }
    } catch (error) {
      handleActionAPIError(dispatch, error);
    }
  },
);

export const getESignDetails = async (templateId) => {
  try {
    // TODO fix by Shashank
    // @ts-ignore
    const response = await axios.get(`/portal/e-sign`, { templateId });
    return response.data;
  } catch (error) {
    return null;
  }
};
