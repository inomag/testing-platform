import React from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import { Meta, StoryObj } from '@storybook/react';
import Popup from './index';

const meta: Meta<typeof Popup> = {
  title: 'Blocks/Popup',
  component: Popup,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;
type Story = StoryObj<typeof Popup>;

export const Primary: Story = (args) => <Popup {...args} />;
Primary.args = {
  placement: 'bottom',
  children: <Button size="small">Test Button</Button>,
  content: 'Check the content of popup',
};
