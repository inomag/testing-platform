import { Document } from 'src/@vymo/ui/molecules/documentUploader/types';
import { Input, Section } from 'src/models/stepperFormLegacy/types';
import {
  getActionPayload,
  getCreateActionPayload,
  getGroupedSections,
  getIdentityValidatePayload,
  getInitAPIPayload,
  getInitAttributes,
  getMeta,
  getObjectUrl,
  getUpdateDocInputValue,
  hasDocumentInput,
  segregateInputs,
} from './queries';
import { ActionAPIPayload, InitAPIResponse } from './types';

const initApiResponse: InitAPIResponse = {
  message: 'success',
  result: {
    visitor: {},
    page: {
      component: {
        type: 'StepperForm',
        title: 'name of step',
        description: 'description of step',
        meta: {
          journey: [
            {
              name: 'Final Interview',
              code: 'final_Interview',
              description: 'This is Final Interview',
              order: 4,
              status: 'locked',
            },
          ],
          current_step: 'final_Interview',
          sections: [
            {
              code: 'authentication',
              title: 'Authentication',
              description: 'this is Authentication description',
              action: 'validate',
              component: {
                type: 'identification',
                meta: {
                  inputs: [
                    {
                      code: 'pan',
                      name: 'Pan Number',
                      type: 'pan',
                      options: [],
                      isMulti: false,
                      readOnly: false,
                      required: true,
                      value: 'BNZPM2501F',
                    },
                  ],
                },
              },
            },
            {
              title: 'profile',
              description: 'profile desc',
              action: 'submit',
              code: 'profile',
              component: {
                type: 'inputform',
                meta: {
                  inputs: [
                    {
                      code: 'name',
                      name: 'First Name',
                      type: 'text',
                      value: 'John',
                      options: [],
                      isMulti: false,
                      readOnly: false,
                      required: true,
                    },
                    {
                      code: 'lastname',
                      name: 'Last Name',
                      type: 'text',
                      value: 'Doe',
                      options: [],
                      isMulti: false,
                      readOnly: true,
                      required: true,
                    },
                    {
                      code: 'date',
                      name: 'DOB',
                      type: 'date',
                      value: '01-01-2000',
                      options: [],
                      isMulti: false,
                      readOnly: true,
                      required: true,
                    },
                    {
                      code: 'interested',
                      name: 'Interested',
                      type: 'radio',
                      value: 'yes',
                      options: [
                        {
                          label: 'Yes',
                          value: 'yes',
                        },
                        {
                          label: 'No',
                          value: 'no',
                        },
                      ] as any,
                      isMulti: false,
                      readOnly: false,
                      required: true,
                    },
                    {
                      code: 'state',
                      name: 'State',
                      type: 'dropdown',
                      value: {
                        label: 'Maharastra',
                        value: 'Maharastra',
                      },
                      options: [
                        {
                          label: 'Maharastra',
                          value: 'Maharastra',
                        },
                        {
                          label: 'Karnataka',
                          value: 'Karnataka',
                        },
                        {
                          label: 'Telengana',
                          value: 'Telengana',
                        },
                        {
                          label: 'UP',
                          value: 'UP',
                        },
                      ] as any,
                      isMulti: false,
                      readOnly: false,
                      required: true,
                    },
                    {
                      code: 'languages',
                      name: 'Languages',
                      type: 'dropdown',
                      value: [
                        {
                          label: 'English',
                          value: 'english',
                        },
                      ],
                      options: [
                        {
                          label: 'English',
                          value: 'english',
                        },
                        {
                          label: 'Spanish',
                          value: 'spanish',
                        },
                        {
                          label: 'German',
                          value: 'german',
                        },
                      ] as any,
                      isMulti: true,
                      readOnly: false,
                      required: true,
                    },
                    {
                      code: 'communication',
                      name: 'Mode of communication',
                      type: 'checkbox',
                      value: ['email'],
                      options: [
                        {
                          label: 'Email',
                          value: 'email',
                        },
                        {
                          label: 'SMS',
                          value: 'sms',
                        },
                        {
                          label: 'Phone',
                          value: 'phone',
                        },
                      ] as any,
                      isMulti: false,
                      readOnly: false,
                      required: true,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
};

describe('getIdentityValidatePayload', () => {
  it('should return transformed payload for API call', () => {
    const expectedPayload = {
      actionType: 'validate',
      code: 'pan',
      isEdit: false,
      payload: {
        type: 'identification',
        value: 'ABCDE1234D',
      },
    };
    const payload: ActionAPIPayload = getIdentityValidatePayload(
      'identification',
      'ABCDE1234D',
      'pan',
    );
    expect(payload).toEqual(expectedPayload);
  });
});

describe('getInitAttributes', () => {
  it('should return null if payload is null', () => {
    const payload = null;
    const result = getInitAttributes(payload);
    expect(result).toBeNull();
  });

  it('should return null if payload is an empty object', () => {
    const payload = {};
    const result = getInitAttributes(payload);
    expect(result).toBeNull();
  });

  it('should return initAttributes if payload has valid data', () => {
    const payload = {
      result: {
        page: {
          component: {
            title: 'Test Title',
            description: 'Test Description',
          },
          meta: {
            section: {
              steps: ['Step 1', 'Step 2', 'Step 3'],
              currentStep: 'Step 1',
            },
          },
        },
      },
    };
    const expected = {
      component: {
        title: 'Test Title',
        description: 'Test Description',
      },
      title: 'Test Title',
      description: 'Test Description',
      steps: ['Step 1', 'Step 2', 'Step 3'],
      currentStep: 'Step 1',
    };
    const result = getInitAttributes(payload);
    expect(result).toEqual(expected);
  });
});

describe('getCreateActionPayload', () => {
  it('should return an object with actionType and an empty payload', () => {
    const result = getCreateActionPayload();
    expect(result).toEqual({
      actionType: 'create',
      payload: {},
    });
  });
});

describe('getActionPayload', () => {
  it('should return action payload for submit action', () => {
    const apiResponse = {
      result: {
        page: {
          component: {
            meta: {
              current_step: 1,
            },
          },
        },
      },
    };
    const updatedInputs = {
      input1: 'value1',
      input2: 'value2',
    };
    const section: Section = {
      title: 'sectionTitle',
      code: 'sectionCode',
      action: 'submit',
      component: {
        type: 'text',
        meta: {
          inputs: [],
        },
      },
    };

    const result = getActionPayload(apiResponse, updatedInputs, section);
    expect(result).toEqual({
      actionType: 'submit',
      payload: {
        current_step: 1,
        current_section: 'sectionCode',
        inputs: {
          input1: 'value1',
          input2: 'value2',
        },
      },
    });
  });

  it('should return action payload for validate action', () => {
    const apiResponse = {
      result: {
        page: {
          component: {
            meta: {
              current_step: 1,
            },
          },
        },
      },
    };
    const updatedInputs = {
      input1: 'value1',
      input2: 'value2',
    };
    const section: Section = {
      title: 'sectionTitle',
      code: 'sectionCode',
      action: 'validate',
      component: {
        type: 'text',
        meta: {
          inputs: [],
        },
      },
    };

    const result = getActionPayload(apiResponse, updatedInputs, section);
    expect(result).toEqual({
      actionType: 'validate',
      payload: {
        current_section: 'sectionCode',
        current_step: 1,
        inputs: {
          input1: 'value1',
          input2: 'value2',
        },
      },
    });
  });
});

describe('segregateInputs', () => {
  it('segregates inputs into docInputs and updatedInputs', () => {
    const file1 = new File([''], 'file1');
    const file2 = new File([''], 'file2');
    const inputs = [
      { type: 'text', value: 'some text' },
      {
        type: 'multimedia',
        value: [
          { id: '1', file: file1 },
          { id: '2', file: file2 },
        ],
      },
    ] as Input[];
    const { docInputs, updatedInputs, filesById } = segregateInputs(inputs);
    expect(docInputs).toEqual([
      {
        type: 'multimedia',
        value: [
          { id: '1', file: file1 },
          { id: '2', file: file2 },
        ],
      },
    ]);
    expect(updatedInputs).toEqual([{ type: 'text', value: 'some text' }]);
    expect(filesById).toEqual({
      '1': { id: '1', file: file1 },
      '2': { id: '2', file: file2 },
    });
  });

  it('handles empty inputs', () => {
    const inputs = [];
    const { docInputs, updatedInputs, filesById } = segregateInputs(inputs);
    expect(docInputs).toEqual([]);
    expect(updatedInputs).toEqual([]);
    expect(filesById).toEqual({});
  });
});

describe('hasDocumentInput', () => {
  it('should return true if inputs contain a multimedia type', () => {
    const inputs = [{ type: 'multimedia' }] as Input[];
    expect(hasDocumentInput(inputs)).toBe(true);
  });

  it('should return false if inputs do not contain a multimedia type', () => {
    const inputs = [{ type: 'text' }, { type: 'image' }] as Input[];
    expect(hasDocumentInput(inputs)).toBe(false);
  });

  it('should return false if inputs is empty', () => {
    const inputs: Input[] = [];
    expect(hasDocumentInput(inputs)).toBe(false);
  });
});

describe('getInitAPIPayload', () => {
  let windowSpy;
  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get');
  });

  it('should generate the correct queryParam and headers when searchParams has values', () => {
    const originalWindow = { ...window };
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      portalId: 'testClient',
    }));
    const searchParams = new URLSearchParams('vo=test&auth_token=token');
    const result = getInitAPIPayload(searchParams);
    expect(result.queryParam).toEqual('portalId=testClient&vo=test');
    expect(result.headers).toEqual({ 'X-Vymo-Auth-Token': 'token' });
  });

  it('should generate the correct queryParam and headers when searchParams has no vo', () => {
    const originalWindow = { ...window };
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      portalId: 'testClient',
    }));
    const searchParams = new URLSearchParams('auth_token=token');
    const result = getInitAPIPayload(searchParams);
    expect(result.queryParam).toEqual('portalId=testClient');
    expect(result.headers).toEqual({ 'X-Vymo-Auth-Token': 'token' });
  });

  it('should generate the correct queryParam and headers when searchParams has no auth_token', () => {
    const originalWindow = { ...window };
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      portalId: 'testClient',
    }));
    const searchParams = new URLSearchParams('vo=test');
    const result = getInitAPIPayload(searchParams);
    expect(result.queryParam).toEqual('portalId=testClient&vo=test');
    expect(result.headers).toEqual(null);
  });
});

describe('getGroupedSections', () => {
  it('returns a promise that resolves to an object with the sections grouped by code', async () => {
    const sections: Section[] = [
      {
        code: 'section1',
        title: 'section1',
        action: 'create',
        component: {
          type: 'inputform',
          meta: {
            inputs: [
              {
                code: 'pan',
                name: 'Pan Number',
                type: 'pan',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: 'BNZPM2501F',
              },
            ],
          },
        },
      },
      {
        code: 'section2',
        title: 'section2',
        action: 'create',
        component: {
          type: 'inputform',
          meta: {
            inputs: [
              {
                code: 'aadhaar',
                name: 'aadhaar Number',
                type: 'pan',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: '1234566',
              },
            ],
          },
        },
      },
    ];

    const result = await getGroupedSections(sections);

    expect(result).toEqual({
      section1: [
        {
          code: 'pan',
          name: 'Pan Number',
          type: 'pan',
          options: [],
          isMulti: false,
          readOnly: false,
          required: true,
          value: 'BNZPM2501F',
        },
      ],
      section2: [
        {
          code: 'aadhaar',
          name: 'aadhaar Number',
          type: 'pan',
          options: [],
          isMulti: false,
          readOnly: false,
          required: true,
          value: '1234566',
        },
      ],
    });
  });

  it('marks all inputs as readOnly if the section does not have an action', async () => {
    const sections: Section[] = [
      {
        code: 'section1',
        title: 'section1',
        component: {
          type: 'inputform',
          meta: {
            inputs: [
              {
                code: 'pan',
                name: 'Pan Number',
                type: 'pan',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: 'BNZPM2501F',
              },
            ],
          },
        },
      },
    ];
    const result = await getGroupedSections(sections);
    expect(result).toEqual({
      section1: [
        {
          code: 'pan',
          name: 'Pan Number',
          type: 'pan',
          options: [],
          isMulti: false,
          readOnly: true,
          required: true,
          value: 'BNZPM2501F',
        },
      ],
    });
  });

  it('does not mark any inputs as readOnly if the section has an action', async () => {
    const sections: Section[] = [
      {
        code: 'section1',
        title: 'section1',
        action: 'create',
        component: {
          type: 'inputform',
          meta: {
            inputs: [
              {
                code: 'pan',
                name: 'Pan Number',
                type: 'pan',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: 'BNZPM2501F',
              },
            ],
          },
        },
      },
    ];

    const result = await getGroupedSections(sections);

    expect(result).toEqual({
      section1: [
        {
          code: 'pan',
          name: 'Pan Number',
          type: 'pan',
          options: [],
          isMulti: false,
          readOnly: false,
          required: true,
          value: 'BNZPM2501F',
        },
      ],
    });
  });

  it('resolves documents from its urls', async () => {
    const sections: Section[] = [
      {
        code: 'section1',
        title: 'section1',
        action: 'create',
        component: {
          type: 'inputform',
          meta: {
            inputs: [
              {
                code: 'pan',
                name: 'Pan image',
                type: 'multimedia',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: [
                  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
                ],
              },
              {
                code: 'pan',
                name: 'Pan image',
                type: 'multimedia',
                options: [],
                isMulti: false,
                readOnly: false,
                required: true,
                value: [
                  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.pdf',
                ],
              },
            ],
          },
        },
      },
    ];
    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          blob: () => Promise.resolve('base64Data'),
        }) as Promise<any>,
    );
    const result = await getGroupedSections(sections);
    const file = new File(['base64Data'], 'pan-googlelogo_color_272x92dp.png', {
      type: 'image/png',
    });
    const pdfFile = new File(
      ['base64Data'],
      'pan-googlelogo_color_272x92dp.pdf',
      {
        type: 'application/pdf',
      },
    );
    expect(result).toEqual({
      section1: [
        {
          code: 'pan',
          name: 'Pan image',
          type: 'multimedia',
          options: [],
          isMulti: false,
          readOnly: false,
          required: true,
          value: [
            {
              id: 'pan-googlelogo_color_272x92dp.png',
              file,
              mime: 'image/png',
              uri: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            },
          ],
        },
        {
          code: 'pan',
          name: 'Pan image',
          type: 'multimedia',
          options: [],
          isMulti: false,
          readOnly: false,
          required: true,
          value: [
            {
              id: 'pan-googlelogo_color_272x92dp.pdf',
              file: pdfFile,
              mime: 'application/pdf',
              uri: '',
            },
          ],
        },
      ],
    });
  });
});

describe('getMeta', () => {
  it('returns the sections, journey and currentStep from the payload', () => {
    const { sections, journey, currentStep } = getMeta(initApiResponse);
    expect(sections).toEqual(
      initApiResponse.result.page.component.meta.sections,
    );
    expect(journey).toEqual([
      {
        name: 'Final Interview',
        code: 'final_Interview',
        description: 'This is Final Interview',
        order: 4,
        status: 'locked',
      },
    ]);
    expect(currentStep).toBe(4);
  });

  it('returns 0 as currentStep if the current_step is not found in the journey', () => {
    const initResponse = { ...initApiResponse };
    initResponse.result.page.component.meta.journey[0].code = 'not-found';
    const { currentStep } = getMeta(initResponse);
    expect(currentStep).toBe(0);
  });
});

describe('getUpdateDocInputValue', () => {
  it('should return a JSON string with the correct properties', () => {
    const bucket = 'test-bucket';
    const filesById = {
      'file-1': {
        id: 'file-1',
        mime: 'image/png',
        file: {
          name: 'file-1',
          size: 1000,
          type: 'image/png',
        },
      } as Document,
      'file-2': {
        id: 'file-2',
        mime: 'image/png',
        file: {
          name: 'file-2',
          size: 2000,
          type: 'image/png',
        },
      } as Document,
    };
    const responseArray = [
      {
        filename: 'file-1',
        id: 'file-1',
        mime: 'image/png',
        path: 'path/to/file-1',
      },
      {
        filename: 'file-2',
        id: 'file-2',
        mime: 'image/png',
        path: 'path/to/file-2',
      },
    ];
    const expected = JSON.stringify({
      media_type: 'image/png',
      items: [
        {
          bucket,
          filename: 'file-1',
          size: 1000,
          mime: 'image/png',
          label: 'file-1',
          path: 'path/to/file-1',
        },
        {
          bucket,
          filename: 'file-2',
          size: 2000,
          mime: 'image/png',
          label: 'file-2',
          path: 'path/to/file-2',
        },
      ],
      bucket,
    });
    const actual = getUpdateDocInputValue({
      bucket,
      filesById,
      responseArray,
    });

    expect(actual).toEqual(expected);
  });
});

describe('getObjectUrl', () => {
  it('should return the given link when mimeType is not pdf', async () => {
    const link = 'https://example.com/sample.jpg';
    const result = await getObjectUrl(link);
    expect(result).toEqual(link);
  });

  it('should return the given link when fetch fails', async () => {
    const link = 'https://example.com/sample.pdf';
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
      throw new Error('fetch failed');
    });
    const result = await getObjectUrl(link);
    expect(result).toEqual(link);
  });

  it('should return the link with dataUrl when mimeType is pdf', async () => {
    const link = 'https://example.com/sample.pdf';
    const base64Data = 'dummybase64data';
    jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          text: () => Promise.resolve(base64Data),
        }) as Promise<Response>,
    );
    const result = await getObjectUrl(link);
    expect(result).toEqual(`data:application/pdf;base64,${base64Data}`);
  });
});
