import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Divider from './index';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const DividerComponent: Story = () => <Divider />;

DividerComponent.args = {
  'data-test-id': 'divider',
};
