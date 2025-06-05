import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Location from './index';

const meta: Meta<typeof Location> = {
  title: 'Blocks/Location',
  component: Location,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;
type Story = StoryObj<typeof Location>;

export const Default: Story = () => {
  const [value, setValue] = useState({});
  return <Location value={value} onChange={setValue} />;
};
Default.args = {};

export const CheckIn: Story = () => {
  const [value, setValue] = useState({});
  return (
    <Location value={value} onChange={setValue} type="check_in" disabled />
  );
};
CheckIn.args = {};
