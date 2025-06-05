import { Input, Section, Value } from 'src/models/stepperFormLegacy/types';

export interface UserIdentificationProps {
  section: Section;
  value: string;
  handleIdentificationChange: (arg1) => void;
  handleEditButton?: () => void;
  closeEditModal?: () => void;
  handleSubmit: (section: Section, arg?: any) => void;
}

export interface UserIdValidatedProp {
  code: string;
  value: boolean;
}

export interface SectionItemProp {
  input: Input;
  value: Value;
  onChange?: (...arg) => void;
}

export interface MeetingSectionProp {
  startDate?: string;
  endDate?: string;
  format?: string;
  meeting?: {
    online: {
      link: string;
      label: string;
    };
    offline: {
      link: string;
      label: string;
      address: string;
    };
  };
  info?: { label: string; value: string }[];
}
