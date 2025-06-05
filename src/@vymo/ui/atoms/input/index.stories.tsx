import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Input from './index';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const WithValidation: Story = (args) => {
  const [value, setValue] = useState('Random Text');
  return (
    <Input
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};
WithValidation.args = {
  type: 'text',
  label: 'Input with validation',
  placeholder: 'Enter some text',
  validations: [
    {
      regex: /^.+$/,
      errorMessage: 'This field is required',
    },
    {
      regex: /^.{0,9}$/,
      errorMessage: 'This field must be less than 10 characters',
    },
  ],
};

export const Text: Story = (args) => {
  const [value, setValue] = useState('Random Text');

  return (
    <Input
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};
Text.args = {
  type: 'text',
  required: true,
  validations: [],
  value: '',
};

export const Number: Story = (args) => {
  const [value, setValue] = useState('1');

  return (
    <Input
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};
Number.args = {
  type: 'number',
  validations: [],
  value: 1,
};

export const SecureValue: Story = (args) => {
  const [value, setValue] = useState('1233234243');

  return (
    <Input
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};

SecureValue.args = { secureValue: true };

export const WithSubMessage: Story = (args) => <Input {...args} />;
WithSubMessage.args = {
  type: 'text',
  label: 'Input with sub message',
  placeholder: 'Enter some text',
  subMessage: 'This is a sub message',
};
