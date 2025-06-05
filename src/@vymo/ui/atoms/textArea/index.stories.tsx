import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TextArea from './index';

const meta: Meta<typeof TextArea> = {
  title: 'Atoms/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const WithValidation: Story = (args) => {
  const [value, setValue] = useState('Random Text');
  return (
    <TextArea
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};
WithValidation.args = {
  label: 'TextArea with validation',
  placeholder: 'Enter some text',
  validations: [
    {
      regex: /^.{0,9}$/,
      errorMessage: 'This field must be less than 10 characters',
    },
  ],
};

export const WithRequired: Story = (args) => {
  const [value, setValue] = useState('Random Text');

  return (
    <TextArea
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
};
WithRequired.args = {
  required: true,
  validations: [],
  value: '',
};

export const WithSubMessage: Story = (args) => <TextArea {...args} />;
WithSubMessage.args = {
  label: 'TextArea with sub message',
  placeholder: 'Enter some text',
  subMessage: 'This is a sub message',
};
