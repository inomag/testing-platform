import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RangePicker from './index';

const meta: Meta<typeof RangePicker> = {
  title: 'Blocks/DateTime/RangePicker',
  component: RangePicker,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;

export const Primary: StoryObj<typeof RangePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <RangePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val.value);
      }}
    />
  );
};

Primary.args = {
  value: [new Date('1 jan 2024'), new Date('22 jan 2024')],
  placeholderText: 'Select date',
  onChange: () => {},
};

export const DateRangeWithTime: StoryObj<typeof RangePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <RangePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val.value);
      }}
    />
  );
};

DateRangeWithTime.args = {
  value: [new Date('1 jan 2024'), new Date('22 jan 2024')],
  placeholderText: 'Select date',
  showTime: true,
  onChange: () => {},
};

export const MonthRange: StoryObj<typeof RangePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <RangePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

MonthRange.args = {
  value: [new Date('1 jan 2024'), new Date('22 apr 2024')],
  placeholderText: 'Select Month',
  picker: 'month',
  onChange: () => {},
};

export const QuarterRange: StoryObj<typeof RangePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <RangePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

QuarterRange.args = {
  value: [new Date('1 jan 2024'), new Date('22 July 2024')],
  placeholderText: 'Select quarter',
  picker: 'quarter',
  onChange: () => {},
};

export const YearRange: StoryObj<typeof RangePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <RangePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

YearRange.args = {
  value: [new Date('1 jan 2024'), new Date('22 jan 2026')],
  placeholderText: 'Select Year',
  picker: 'year',
  onChange: () => {},
};
