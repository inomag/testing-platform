import { Section } from 'src/models/stepperFormLegacy/types';

export const getUserIdentificationAttributes = (section: Section) => {
  const { type, name, code, readOnly, required } =
    section.component.meta.inputs[0];
  return {
    type,
    code,
    label: name,
    readOnly,
    required,
  };
};

export const getInput = (section: Section) => section.component.meta.inputs[0];
