import moment from 'moment';
import { Input } from 'src/models/stepperFormLegacy/types';

export const getFieldValue = (sectionCode, code, formData) => {
  const inputs = formData[`${sectionCode}`];
  return inputs?.find((input) => input.code === code)?.value;
};

export const getUpdatedInput = (input, newValue) => {
  const updatedInput = { ...input };
  updatedInput.value = newValue;
  return updatedInput;
};

export const getUpdatedSectionData = (
  stepperFormData,
  sectionData,
  sectionName,
) => {
  const newSectionData: Input[] = { ...stepperFormData[`${sectionName}`] };
  if (newSectionData && sectionData) {
    const newInputs: Input[] = Object.entries(newSectionData).map((input) => {
      let value;

      if (sectionData[`${input[1].code}`]) {
        value = sectionData[`${input[1].code}`].value;
      } else {
        value = input[1].value;
      }

      return getUpdatedInput(input[1], value);
    });
    return newInputs;
  }
  return newSectionData;
};

export const getFormattedDate = (date: string) => {
  if (date) {
    const dateObject = moment(date);
    return dateObject.format('YYYY-MM-DD');
  }
  return '';
};

export const getDateObject = (date: string) =>
  moment(date, 'YYYY-MM-DD').toDate().toString();

export const handleAutoSavePrepopulation = (autoSaveData, stepperFormData) => {
  if (
    autoSaveData &&
    autoSaveData.currentStep === stepperFormData.currentStep
  ) {
    return {
      ...stepperFormData,
      sectionData: autoSaveData.sectionData,
    };
  }
  return false;
};

export const getGroupedFields = (action, meta) => {
  const { groups, inputs } = meta;
  let updatedInputs: Input[] = inputs ? [...inputs] : [];
  if (!action) {
    updatedInputs = inputs?.map((input) => ({
      ...input,
      readOnly: true,
    }));
  }
  const groupedFields = {};
  groups.forEach((group) => {
    const groupInputs = updatedInputs.filter((input) =>
      group?.fields.some((field) => field === input.code),
    );
    groupedFields[group?.code] = {
      inputs: groupInputs,
      title: group?.title,
      status: group?.status,
    };
  });
  return groupedFields;
};
