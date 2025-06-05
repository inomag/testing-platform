import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Pan from './index';

const meta: Meta<typeof Pan> = {
  title: 'Molecules/identification/Pan',
  component: Pan,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pan>;

export const PanInput: Story = (args) => {
  const ref = React.useRef<any>(null);
  return <Pan {...args} ref={ref} />;
};
PanInput.args = {
  otpValidation: false,
  required: false,
  onChange: () => {},
  validations: [
    {
      regex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      errorMessage: 'Invalid PAN number',
    },
  ],
  value: 'AHHSS1234N',
};
