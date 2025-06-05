import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NoData from './index';

const meta: Meta<typeof NoData> = {
  title: 'Blocks/NoData',
  component: NoData,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NoData>;

export const Primary: Story = (args) => <NoData {...args} />;
Primary.args = {};

export const Custom: Story = (args) => <NoData {...args} />;
Custom.args = {
  message: 'Custom No Data Message',
};
