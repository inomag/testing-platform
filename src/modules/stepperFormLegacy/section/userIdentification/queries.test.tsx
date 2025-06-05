import { getInput, getUserIdentificationAttributes } from './queries';

describe('useridentification queries', () => {
  it('getUserIdentificationAttributes returns the correct attributes', () => {
    const section = {
      component: {
        meta: {
          inputs: [
            {
              type: 'typeValue',
              name: 'nameValue',
              code: 'codeValue',
              readOnly: true,
            },
          ],
        },
      },
    };

    const result = getUserIdentificationAttributes(section as any);

    expect(result).toEqual({
      type: 'typeValue',
      code: 'codeValue',
      label: 'nameValue',
      readOnly: true,
    });
  });
  test('getInput returns the correct input', () => {
    const section = {
      component: {
        meta: {
          inputs: [
            {
              type: 'pan',
              name: 'pan number',
              code: 'pan',
              value: 'abcd',
              readOnly: true,
            },
          ],
        },
      },
    };

    const result = getInput(section as any);

    expect(result).toEqual({
      type: 'pan',
      name: 'pan number',
      code: 'pan',
      value: 'abcd',
      readOnly: true,
    });
  });
});
