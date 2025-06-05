import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from '../index';

const meta: Meta<typeof TimePicker> = {
  title: 'Blocks/DateTime/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;

export const Primary: StoryObj<typeof TimePicker> = (args) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [value, setValue] = useState(args.value);
  return (
    <TimePicker
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

Primary.args = {
  value: '01:30',
  onChange: () => {},
  format: 'HH:mm',
};
