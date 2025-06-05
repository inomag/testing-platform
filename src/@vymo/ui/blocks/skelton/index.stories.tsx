import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Skelton from './index';

const meta: Meta<typeof Skelton> = {
  title: 'Blocks/Skelton',
  component: Skelton,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};

export default meta;
type Story = StoryObj<typeof Skelton>;

export const Primary: Story = (args) => <Skelton {...args} />;
Primary.args = {
  avtar: true,
  lines: 4,
};

export const Avtar: Story = (args) => <Skelton {...args} />;
Avtar.args = {
  avtar: true,
};

export const Lines: Story = (args) => <Skelton {...args} />;
Lines.args = {
  lines: 4,
};

export const Rect: Story = (args) => <Skelton {...args} />;
Rect.args = {
  rect: true,
  height: 200,
  width: 100,
};
