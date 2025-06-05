/* eslint-disable max-lines-per-function */
import _ from 'lodash';
import axios from 'src/workspace/axios';
import { isValueEmpty } from 'src/workspace/utils';
import { FormFieldState } from '../types';
import { getSignedUrlPayload } from './queries';
import { FormSliceState } from './types';

const getMultimediaPayload = (
  multimediaInput: FormFieldState,
  bucket: string,
) =>
  typeof multimediaInput.value === 'string'
    ? multimediaInput.value
    : JSON.stringify({
        items: multimediaInput.value,
        bucket,
        media_type:
          multimediaInput.value[0]?.type ||
          multimediaInput.value[0]?.mime ||
          '',
      });

const uploadFilesToS3 = async (
  multimediaInputs: FormFieldState[],
  beforeSaveHookConfig: any,
) => {
  const { payload, isSignedUrlRequired } =
    getSignedUrlPayload(multimediaInputs);

  if (isSignedUrlRequired) {
    const response = await axios.post(
      beforeSaveHookConfig?.multimedia?.uploadUrl ||
        '/api/generate_signed_urls',
      payload,
    );

    const { multimedia_response: multimediaResponse, bucket } =
      response?.data?.result || {};

    const promises: any = [];
    const updatedInputs = multimediaInputs.map((multimediaInput) => {
      if (multimediaInput.code in multimediaResponse) {
        const uploadedFilesValue = multimediaResponse[multimediaInput.code].map(
          (file) => ({
            ...file,
            file: multimediaInput.value.find((doc) => doc.id === file.id)?.file,
            label: file.filename,
            bucket,
            uri: file.pre_signed_url,
          }),
        );

        uploadedFilesValue.forEach((file) =>
          promises.push(
            axios.put(file.uri, file.file, {
              headers: {
                'Content-Type': file.mime,
              },
              withCredentials: false,
            }),
          ),
        );
        multimediaInput.value = _.unionBy(
          uploadedFilesValue,
          multimediaInput.value,
          'id',
        );
      }
      if (isValueEmpty(multimediaInput.value)) {
        return {
          code: multimediaInput.code,
          value:
            beforeSaveHookConfig.multimedia.valueFormat === 'url' ? [] : '',
        };
      }
      return {
        code: multimediaInput.code,
        value:
          beforeSaveHookConfig.multimedia.valueFormat === 'url'
            ? multimediaInput.value.map((file) => file.uri)
            : getMultimediaPayload(multimediaInput, bucket),
      };
    });

    try {
      const result = await Promise.all(promises);
      // eslint-disable-next-line no-console
      console.log(result);
    } catch (error) {
      Promise.reject(error);
    }

    return updatedInputs;
  }
  return multimediaInputs.map((multimediaInput) => {
    if (isValueEmpty(multimediaInput.value)) {
      return {
        code: multimediaInput.code,
        value: beforeSaveHookConfig.multimedia.valueFormat === 'url' ? [] : '',
      };
    }
    return multimediaInput;
  });
};

export const beforeSaveHook = async (
  configData: FormSliceState['config']['data'],
  formSliceState: FormSliceState,
): Promise<Record<string, any>> => {
  const { formData, config } = formSliceState;
  const { fields } = formData;
  const {
    beforeSaveHookConfig = {
      multimedia: {
        isMultimediaBeforeSaveHookDisabled: false,
        uploadUrl: '/api/getS3signedUrl',
        valueFormat: 'url',
      },
    },
  } = config;
  const beforeHookData = {};

  if (!beforeSaveHookConfig?.multimedia?.isMultimediaBeforeSaveHookDisabled) {
    const multimediaInputs = configData
      .filter(
        (inputField) =>
          inputField.type === 'multimedia' &&
          !_.isNil(fields[inputField?.code]),
      )
      .map((inputField) => ({ ...inputField, ...fields[inputField?.code] }));
    const updatedInputs = await uploadFilesToS3(
      multimediaInputs,
      beforeSaveHookConfig,
    );

    updatedInputs.forEach(({ code, value }) => {
      beforeHookData[code] = value;
    });
  }
  return beforeHookData;
};
