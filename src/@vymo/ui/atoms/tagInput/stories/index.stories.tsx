import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TagInput from '../index';

const meta: Meta<typeof TagInput> = {
  title: 'Atoms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TagInput>;

export const Primary: Story = (args) => <TagInput {...args} />;

Primary.args = {
  value: [
    { label: 'Cheque', value: 'Cheque' },
    { label: 'DD', value: 'DD' },
  ],
};
