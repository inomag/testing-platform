import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Aadhar from './index';

const meta: Meta<typeof Aadhar> = {
  title: 'Molecules/identification/Aadhar',
  component: Aadhar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Aadhar>;

export const AadharInput: Story = (args) => <Aadhar {...args} />;
AadharInput.args = {
  otpValidation: false,
  required: false,
  onChange: () => {},
  validations: [
    {
      regex: /^(\d{4}-){2}\d{4}$|^\d{12}$/,
      errorMessage: 'Invalid Aadhar Number',
    },
  ],
  value: '123456789123',
};
