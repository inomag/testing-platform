import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './index';

/**
 * We are using 3rd party library
 * please refer this link for more examples
 * https://reactdatepicker.com/
 * https://github.com/Hacker0x01/react-datepicker
 */

const meta: Meta<typeof DatePicker> = {
  title: 'Blocks/DateTime/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = (args) => {
  const [value, setValue] = useState(new Date('1 Jan 2024'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

Primary.args = {
  placeholderText: 'Select date',
  onChange: () => {},
};

export const DatePickerWithTime: Story = (args) => {
  const [value, setValue] = useState(new Date('June 1, 2024 12:00 AM'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

DatePickerWithTime.args = {
  placeholderText: 'Select date',
  onChange: () => {},
  showTime: true,
};

export const MinMax: Story = (args) => {
  const [value, setValue] = useState(new Date('10 Jan 2024'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

MinMax.args = {
  placeholderText: 'Select date',
  onChange: () => {},
  min: -200000000,
  max: 1000000000,
};

export const MonthPicker: Story = (args) => {
  const [value, setValue] = useState(new Date('Jan 2024'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

MonthPicker.args = {
  placeholderText: 'Select Month',
  onChange: () => {},
  picker: 'month',
};

export const QuarterPicker: Story = (args) => {
  const [value, setValue] = useState(new Date('1 Jan 2024'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

QuarterPicker.args = {
  placeholderText: 'Select quarter',
  onChange: () => {},
  picker: 'quarter',
};

export const YearPicker: Story = (args) => {
  const [value, setValue] = useState(new Date('2024'));
  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

YearPicker.args = {
  placeholderText: 'Select Year',
  onChange: () => {},
  picker: 'year',
};
