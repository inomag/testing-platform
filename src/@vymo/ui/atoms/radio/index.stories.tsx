/* eslint-disable react/destructuring-assignment */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Option, RadioGroup } from './index';

const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Radio: Story = (args) => (
  <RadioGroup {...args}>
    <Option label="Option 1" value="option1" disabled />
    <Option label="Option 2" value="option2" />
    <Option label="Option 3" value="option3" />
  </RadioGroup>
);
Radio.args = {
  name: 'Radio',
  value: 'option2',
  type: 'radio',
};

export const Tabs: Story = (args) => (
  <RadioGroup {...args}>
    <Option label="Option 1" value="option1" disabled />
    <Option label="Option 2" value="option2" />
    <Option label="Option 3" value="option3" />
  </RadioGroup>
);
Tabs.args = {
  name: 'Radio',
  value: 'option2',
  type: 'tabs',
};

export const ChipRadio: Story = (args) => (
  <RadioGroup {...args}>
    <Option label="Option 1" value="option1" disabled />
    <Option label="Option 2" value="option2" />
    <Option label="Option 3" value="option3" />
  </RadioGroup>
);
ChipRadio.args = {
  name: 'Radio',
  value: 'option2',
  type: 'chipRadio',
};
