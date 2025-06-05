import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';
import { getEnumKey } from 'src/@vymo/ui/molecules/documentUploader/queries';
import { Document } from 'src/@vymo/ui/molecules/documentUploader/types';
import {
  Input,
  InputsMap,
  Journey,
  Section,
} from 'src/models/stepperFormLegacy/types';
// eslint-disable-next-line vymo-ui/restrict-import
import { INPUT_TYPE } from 'src/modules/stepperFormLegacy/constants';
import {
  ActionAPIPayload,
  DocumentInputItem,
  GetUpdateDocInputValueParam,
  InitAPIResponse,
  InitAttributes,
  SegregateInputReturnType,
} from './types';

export const getActionPayload = (
  apiResponse,
  updatedInputs,
  section: Section,
): ActionAPIPayload | {} => {
  let payload = {};
  if (!section.action) {
    return {};
  }
  payload = {
    current_step: apiResponse.result.page.component.meta.current_step,
    current_section: section.code,
    inputs: updatedInputs,
  };
  return {
    actionType: section.action,
    payload,
  };
};

export const getIdentityValidatePayload = (
  type,
  value,
  code = '',
  isEdit = false,
): ActionAPIPayload => ({
  actionType: 'validate',
  payload: {
    type,
    value,
  },
  code,
  isEdit,
});

export const getInitAttributes = (payload): InitAttributes | null => {
  if (payload && Object.keys(payload).length > 0) {
    const {
      component,
      component: { title, description },
      meta: { section: { steps = [], currentStep = {} } = {} } = {},
    } = payload.result.page;

    const initAttributes = {
      component,
      title,
      description,
      steps,
      currentStep,
    };
    return initAttributes;
  }
  return null;
};

export const getCreateActionPayload = (): ActionAPIPayload => ({
  actionType: 'create',
  payload: {},
});

const modifyDocumentUrlsToObjects = async (sectionArray: Section[]) =>
  Promise.all(
    sectionArray.map(async (section) => {
      const newSection: Section = { ...section };
      const updatedInputs = await Promise.all(
        (section.component?.meta?.inputs || []).map(async (input) => {
          if (
            input.type === INPUT_TYPE.MULTIMEDIA &&
            Array.isArray(input.value) &&
            input?.value?.length > 0
          ) {
            const updatedInputValue = await Promise.all(
              input.value.map(async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                const filename = url.split('/').pop()?.split('?')[0] || '';
                const extension = filename.split('.').pop() || '';
                const type =
                  MimeTypes[extension.toUpperCase() as keyof typeof MimeTypes];
                const file = new File([blob], filename, { type });
                let uri = url;
                if (type === 'application/pdf') {
                  uri = '';
                }
                const doc: Document = {
                  id: `${input.code}-${filename}`,
                  file,
                  mime: getEnumKey(file.type),
                  uri,
                };
                return doc;
              }),
            );
            return { ...input, value: updatedInputValue };
          }
          return input;
        }),
      );

      const updatedSection = {
        ...section,
        component: {
          ...section.component,
          meta: {
            ...newSection.component.meta,
            inputs: updatedInputs as Input[],
          },
        },
      };
      return updatedSection;
    }),
  );

export const getGroupedSections = (sections: Section[]) => {
  const groupedSections = {};
  const hasDocumentInputs = sections?.some((section) =>
    section?.component?.meta?.inputs?.some(
      (input) =>
        input.type === INPUT_TYPE.MULTIMEDIA &&
        Array.isArray(input.value) &&
        input.value?.length > 0,
    ),
  );
  return new Promise((resolve) => {
    const processSections = (updatedSections) => {
      updatedSections?.forEach((section) => {
        const defaultCode = section.code ?? 'default';
        if (!section.action) {
          const updatedInputs = section?.component?.meta?.inputs?.map(
            (input) => ({
              ...input,
              readOnly: true,
            }),
          );
          groupedSections[defaultCode] = updatedInputs;
        } else {
          groupedSections[defaultCode] = section?.component?.meta?.inputs;
        }
      });
      resolve(groupedSections);
    };
    if (hasDocumentInputs) {
      modifyDocumentUrlsToObjects(sections).then(processSections);
    } else {
      processSections(sections);
    }
  });
};

export const getMeta = (
  payload: InitAPIResponse,
): {
  sections: Section[];
  journey: Journey;
  currentStep: number;
  inputsMap: InputsMap;
} => {
  const {
    sections,
    journey,
    current_step: currentStep,
    inputsMap = {},
  } = payload.result.page.component.meta;
  const journeyItem = journey.find((item) => item.code === currentStep);
  return { sections, journey, currentStep: journeyItem?.order ?? 0, inputsMap };
};

export const getSignedUrlPayload = (docInput) => ({
  file_attributes: docInput.value,
  field_code: docInput.code,
});

export const getUpdateDocInputValue = ({
  bucket,
  filesById,
  responseArray,
}: GetUpdateDocInputValueParam): string => {
  let mediaType = '';
  const items: DocumentInputItem[] = [];
  responseArray?.forEach((item) => {
    mediaType = filesById[item.id]?.file.type;
    items.push({
      bucket,
      filename: item.filename,
      size: filesById[item.id]?.file?.size,
      mime: item.mime,
      label: filesById[item.id]?.file?.name,
      path: item.path,
    });
  });
  return JSON.stringify({
    media_type: mediaType,
    items,
    bucket,
  });
};

export const hasDocumentInput = (inputs: Input[]) =>
  inputs?.some((input) => input.type === 'multimedia');

export const segregateInputs = (inputs: Input[]): SegregateInputReturnType => {
  const docInputs: Input[] = [];
  const updatedInputs: Input[] = [];
  const filesById: { [id: string]: Document } = {};
  inputs?.forEach((input) => {
    if (input.type === 'multimedia') {
      docInputs.push(input);
      const files = input.value as Document[];
      if (Array.isArray(files)) {
        files.forEach((item) => {
          filesById[item.id] = item;
        });
      }
    } else {
      updatedInputs.push(input);
    }
  });
  return { docInputs, updatedInputs, filesById };
};

export const getInitAPIPayload = (searchParams) => {
  const queryParams: string[] = [];
  queryParams.push(`portalId=${window.portalId ?? ''}`);
  if (searchParams.get('vo')) {
    queryParams.push(`vo=${searchParams.get('vo')}`);
  }
  const headers = searchParams.get('auth_token')
    ? { 'X-Vymo-Auth-Token': searchParams.get('auth_token') || '' }
    : null;
  const queryParam = queryParams.join('&');
  return { queryParam, headers };
};

export const getObjectUrl = async (link) => {
  const mimeType = link?.split('.')?.pop();
  if (mimeType === 'pdf') {
    try {
      const response = await fetch(`/portal/fileObj?url=${link}`);
      const base64Data = await response.text();
      return `data:application/pdf;base64,${base64Data}`;
    } catch (error) {
      return link;
    }
  }
  return link;
};
