import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxGroup } from './index';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Atoms/Checkbox',
  component: CheckboxGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const CheckboxStory: Story = (args) => (
  <CheckboxGroup {...args}>
    <Checkbox label="Option 1" value="option1" disabled />
    <Checkbox label="Option 2" value="option2" />
    <Checkbox label="Option 3" value="option3" />
  </CheckboxGroup>
);
CheckboxStory.args = {
  value: ['option3', 'option2'],
  disabled: false,
  size: 'medium',
  orientation: 'vertical',
};
