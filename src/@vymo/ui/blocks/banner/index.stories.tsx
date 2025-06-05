import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Banner from './index';

const meta: Meta<typeof Banner> = {
  title: 'Blocks/Banner',
  component: Banner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const DefaultBanner: Story = (args) => <Banner {...args} />;
DefaultBanner.args = {
  closeable: true,
  variant: 'info',
  message: 'This is a Banner story message ',
};
