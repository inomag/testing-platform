export type DatePickerProps = {
  value: Date | null;
  picker?: 'date' | 'month' | 'quarter' | 'year';
  placeholderText?: string;
  disabled?: boolean;
  showTime?: boolean;
  format?: string;
  open?: boolean;
  isClearable?: boolean;
  onChange?: (arg0: Date, event) => void;
  min?: number; // expect min in milliseconds
  max?: number;
  id?: string;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  discreteTimeOptions?: any;
  minMaxRelativeDate?: Date | null;
  timeStep?: any;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
  wrapperClassName?: string;
  showIcon?: boolean;
  customInput?: React.ReactNode;
  'data-test-id'?: string;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};
