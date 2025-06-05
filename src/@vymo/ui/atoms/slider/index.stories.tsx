import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Slider from './index';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { status: { type: 'beta' } },
};
export default meta;

type Story = StoryObj<typeof Slider>;

// can take min and max as negative values
export const Linear: Story = (args) => <Slider {...args} />;

Linear.args = {
  min: 0,
  max: 100,
  value: 60,
};

// min and max will always be positive.
export const Angle: Story = (args) => <Slider {...args} />;

Angle.args = {
  type: 'angle',
  min: 0,
  max: 360,
  value: 90,
  displaySuffix: 'deg',
};
