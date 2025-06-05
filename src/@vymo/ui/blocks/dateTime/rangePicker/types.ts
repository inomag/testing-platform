export type DateTimeRangePickerProps = {
  value: [Date | null, Date | null];
  min?: number;
  max?: number;
  onChange?: (arg0: { value: [Date, Date] }, event) => void;
  format?: string;
  showTime?: boolean;
  duration?: Array<number>;
  placeholderText?: string;
  picker?: 'date' | 'month' | 'quarter' | 'year';
  showDisabledIcon?: boolean;
  'data-test-id'?: string;
  viewMode?: boolean;
};
