export type TimeFormat = 'HH:mm' | 'hh:mm a' | 'HH:mm:ss' | 'hh:mm:ss a';
export type TimePickerProps = {
  value: string;
  onChange: (arg0, arg1, arg2) => void;
  format?: TimeFormat;
  showInput?: boolean;
  step?: { stepHours: number; stepMinutes: number; stepSeconds: number };
  discreteTimeOptions?: {
    hours: null | Array<number>;
    minutes: null | Array<number>;
    seconds: null | Array<number>;
  };
  'data-test-id'?: string;
  viewMode?: boolean;
};
