import {
  getDateObject,
  getFieldValue,
  getFormattedDate,
  getGroupedFields,
  getUpdatedInput,
  getUpdatedSectionData,
} from './queries';

describe('stepperform queries', () => {
  it('should return the value of the input with matching code', () => {
    const sectionCode = 'section1';
    const code = 'code1';
    const formData = { section1: [{ code: 'code1', value: 'value1' }] };
    expect(getFieldValue(sectionCode, code, formData)).toBe('value1');
  });
  it('should return a new object with the updated value', () => {
    const input = { value: 'oldValue' };
    const newValue = 'newValue';
    const expected = { value: 'newValue' };

    const result = getUpdatedInput(input, newValue);

    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
  });

  it('should return newSectionData when newSectionData is truthy and sectionData is falsy', () => {
    const stepperFormData = {
      sectionName: {
        input1: { code: 'input1', value: 'value1' },
        input2: { code: 'input2', value: 'value2' },
      },
    };
    const sectionData = null;
    const sectionName = 'sectionName';
    const result = getUpdatedSectionData(
      stepperFormData,
      sectionData,
      sectionName,
    );

    expect(result).toEqual({
      input1: { code: 'input1', value: 'value1' },
      input2: { code: 'input2', value: 'value2' },
    });
  });
});

describe('getFormattedDate', () => {
  it('should return a formatted date string', () => {
    const formattedDate = getFormattedDate('2022-01-01 00:00:00');
    expect(formattedDate).toEqual('2022-01-01');
  });
});

describe('getDateObject', () => {
  it('should return a Date object', () => {
    const dateObject: any = getDateObject('2022-01-01');
    expect(dateObject).toContain('Sat Jan 01 2022 00:00:00');
  });
});

describe('getGroupedFields', () => {
  it('should group fields correctly by code', () => {
    const groups = [
      { title: 'group1', code: 'group1', fields: ['field1', 'field2'] },
      { title: 'group2', code: 'group2', fields: ['field3', 'field4'] },
    ];
    const inputs = [
      { code: 'field1' },
      { code: 'field2' },
      { code: 'field3' },
      { code: 'field4' },
    ];
    const meta = {
      groups,
      inputs,
    };
    const expectedResult = {
      group1: {
        inputs: [
          { code: 'field1', readOnly: true },
          { code: 'field2', readOnly: true },
        ],
        title: 'group1',
      },
      group2: {
        inputs: [
          { code: 'field3', readOnly: true },
          { code: 'field4', readOnly: true },
        ],
        title: 'group2',
      },
    };
    const groupedFields = getGroupedFields(undefined, meta);
    expect(groupedFields).toEqual(expectedResult);
  });
});
