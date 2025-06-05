import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = (args) => <Button {...args}>Test Button</Button>;
Primary.args = {
  type: 'primary',
  rounded: false,
  disabled: false,
};

export const Outlined: Story = (args) => <Button {...args}>Test Button</Button>;
Outlined.args = {
  type: 'outlined',
  rounded: false,
  disabled: false,
};

export const Link: Story = (args) => <Button {...args}>Test Button</Button>;
Link.args = {
  type: 'link',
  rounded: false,
  disabled: false,
};

export const Text: Story = (args) => <Button {...args}>Test Button</Button>;
Text.args = {
  type: 'text',
  rounded: false,
  disabled: false,
};
