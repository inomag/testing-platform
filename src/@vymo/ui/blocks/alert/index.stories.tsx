import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Alert from '.';

const meta: Meta<typeof Alert> = {
  title: 'Blocks/Alert',
  component: Alert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const DefaultAlert: Story = (args) => (
  <Alert {...args}>{'This is a Alert story description '}</Alert>
);
DefaultAlert.args = {
  closeable: true,
  variant: 'info',
  title: 'This is a Alert story message ',
};
