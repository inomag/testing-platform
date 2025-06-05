import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Switch from './index';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const RegularSwitch: Story = (args) => <Switch {...args} />;
RegularSwitch.args = {
  size: 'medium',
};

export const DisabledSwitch: Story = (args) => <Switch {...args} />;
DisabledSwitch.args = {
  disabled: true,
};
