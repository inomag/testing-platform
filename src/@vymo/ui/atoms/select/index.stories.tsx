import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Select from './index';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Single: Story = (args) => <Select {...args} />;

Single.args = {
  options: [
    {
      value: 'A',
      label: 'Bank',
    },
    {
      value: 'B',
      label: 'ID Proof',
    },
    {
      value: 'C',
      label: 'Address',
    },
  ],
  value: ['A'],
  disabled: false,
};

export const Multi: Story = (args) => <Select {...args} />;

Multi.args = {
  options: [
    {
      value: 'A',
      label: 'Bank',
    },
    {
      value: 'B',
      label: 'ID Proof',
    },
    {
      value: 'C',
      label: 'Address',
    },
  ],
  value: ['A'],
  disabled: false,
  search: true,
  multi: true,
};

export const Tree: Story = (args) => <Select {...args} />;

Tree.args = {
  options: [
    {
      value: 'A',
      label: 'Bank',
      options: [
        {
          value: 'A-1',
          label: 'Bank Name',
          options: [
            { value: 'A-1-1', label: 'ABC' },
            { value: 'A-1-2', label: 'Branch' },
          ],
        },
        {
          value: 'A-2',
          label: 'Account Type',
          options: [
            { value: 'A-2-1', label: 'IFSC Code' },
            { value: 'A-2-2', label: 'Address' },
          ],
        },
      ],
    },
    {
      value: 'B',
      label: 'ID Prood',
      options: [
        {
          value: 'B-1',
          label: 'govt Proof',
          options: [
            { value: 'B-1-1', label: 'Aadhar' },
            { value: 'B-1-2', label: 'Pan Card' },
          ],
        },
        {
          value: 'B-2',
          label: 'insitutional',
          options: [
            { value: 'B-2-1', label: 'account statement' },
            { value: 'B-2-2', label: 'electrivity bill' },
          ],
        },
      ],
    },
  ],
  value: ['A-1'],
  disabled: false,
  search: true,
};
